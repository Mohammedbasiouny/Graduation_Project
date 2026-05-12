import json

from fastapi import APIRouter, Depends, File, Form, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.websockets import WebSocketState
from sqlalchemy.orm import Session

from api.dependencies import get_database_session
from database import queries
from schemas.photo import (
    LiveEnrollMessage,
    UnenrollStudentRequest,
    UnenrollStudentResponse,
    ValidatePhotoResponse,
)
from services.enrollment_service import (
    process_enrollment_frame,
    unenroll_student,
)
from services.validation_service import run_photo_validation
from utils.logger import logger

router = APIRouter(tags=["Photo"])


# ================================
# POST /validate-photo
# called by NestJS only — not by React directly.
# ================================
@router.post("/validate-photo", response_model=ValidatePhotoResponse)
async def validate_photo(file: UploadFile = File(...)):

    image_bytes = await file.read()
    return await run_photo_validation(image_bytes)

# ================================
# WS /ws/enroll/{student_id}
# called by React directly (supervisor's enrollment interface).
# ================================
@router.websocket("/ws/enroll/{student_id}")
async def ws_enroll(
    websocket:  WebSocket,
    student_id: int,
    db:         Session = Depends(get_database_session),
):
    """
    Protocol:
        Client → Server: binary JPEG frame bytes
        Server → Client: JSON string matching LiveEnrollMessage schema
            {
                "status":           "waiting" | "collecting" | "reject" | "success" | "error",
                "frames_collected": int,
                "frames_required":  15,
                "student_id":       int | null,
                "message":          str
            }
    """
    await websocket.accept()
    client = websocket.client
    logger.info(
        f"Enrollment WebSocket opened: "
        f"student_id={student_id} client={client.host}:{client.port}"
    )

    # ── Verify student exists before starting the session ──
    student = queries.get_student_by_id(db, student_id)
    if not student:
        logger.warning(f"Enrollment attempted for unknown student_id={student_id}")
        await websocket.send_text(
            LiveEnrollMessage(
                status  = "error",
                message = f"Student with id {student_id} not found.",
            ).model_dump_json()
        )
        await websocket.close()
        return

    # ── Send initial waiting message — React starts camera ──
    await websocket.send_text(
        LiveEnrollMessage(
            status  = "waiting",
            message = f"Ready to enroll {student.fullName}. Start the camera.",
        ).model_dump_json()
    )

    # ── Session state ──
    collected_frames     = []
    reference_embedding  = None

    try:
        while True:
            try:
                image_bytes = await websocket.receive_bytes()
            except WebSocketDisconnect:
                logger.info(
                    f"Enrollment WebSocket disconnected by client: "
                    f"student_id={student_id}"
                )
                break

            # ── Process frame — delegate to service layer ──
            message, collected_frames, reference_embedding, done = (
                await process_enrollment_frame(
                    student_id          = student_id,
                    image_bytes         = image_bytes,
                    collected_frames    = collected_frames,
                    reference_embedding = reference_embedding,
                    db                  = db,
                )
            )

            # ── Send result back to React ──
            if websocket.client_state == WebSocketState.CONNECTED:
                await websocket.send_text(message.model_dump_json())

            # ── Close on success or fatal error ──
            if done:
                logger.info(
                    f"Enrollment session ended: "
                    f"student_id={student_id} status={message.status}"
                )
                break

    except WebSocketDisconnect:
        logger.info(
            f"Enrollment WebSocket closed: student_id={student_id}"
        )
    except Exception as e:
        logger.error(
            f"Unexpected enrollment error: student_id={student_id} error={e}"
        )
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_text(
                LiveEnrollMessage(
                    status           = "error",
                    frames_collected = len(collected_frames),
                    frames_required  = 15,
                    message          = "An unexpected error occurred. Please restart the session.",
                ).model_dump_json()
            )
    finally:
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.close()
        logger.info(
            f"Enrollment WebSocket session complete: "
            f"student_id={student_id} "
            f"frames_collected={len(collected_frames)}/15"
        )

# ================================
# POST /unenroll-student
# called by NestJS only — not by React directly.
# ================================
@router.post("/unenroll-student", response_model=UnenrollStudentResponse)
async def unenroll_student_endpoint(
    request: UnenrollStudentRequest,
    db:      Session = Depends(get_database_session),
):
    """
    Returns 200 with removal confirmation on success.
    Returns 404 if no embedding found for this student.
    """
    return await unenroll_student(request.student_id, db)