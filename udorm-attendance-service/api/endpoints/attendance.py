import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.websockets import WebSocketState

from schemas.attendance import StatusResponse
from services.attendance_service import get_system_status, process_frame
from utils.logger import logger

router = APIRouter(tags=["Attendance"])

# ================================
# WS /ws/recognize
# called by React directly (supervisor's recognition interface).
# ================================
@router.websocket("/ws/recognize")
async def ws_recognize(websocket: WebSocket):
    """
    Protocol:
      Client → Server: binary JPEG frame bytes
      Server → Client: JSON string matching RecognizeResponse schema
        {
          "faces": [
            {
              "recognized":     bool,
              "student_id":     int | null,
              "full_name":      str | null,
              "confidence":     float | null,
              "already_logged": bool,
              "logged_now":     bool,
              "bounding_box": {
                "top": int, "right": int,
                "bottom": int, "left": int
              }
            }
          ],
          "faces_detected": int,
          "faces_logged":   int
        }
    """
    await websocket.accept()
    client = websocket.client
    logger.info(f"WebSocket connection opened: {client.host}:{client.port}")

    try:
        while True:
            # ── Receive binary frame from React ──
            try:
                image_bytes = await websocket.receive_bytes()
            except WebSocketDisconnect:
                logger.info(
                    f"WebSocket disconnected by client: "
                    f"{client.host}:{client.port}"
                )
                break

            try:
                result = await process_frame(image_bytes)

                # ── Send JSON result back to React ──
                await websocket.send_text(result.model_dump_json())

            except Exception as e:
                error_payload = json.dumps({
                    "error":   str(e),
                    "faces":   [],
                    "faces_detected": 0,
                    "faces_logged":   0,
                })
                logger.error(
                    f"Frame processing error for "
                    f"{client.host}:{client.port}: {e}"
                )

                # Only send if connection is still open
                if websocket.client_state == WebSocketState.CONNECTED:
                    await websocket.send_text(error_payload)

    except WebSocketDisconnect:
        logger.info(
            f"WebSocket closed: {client.host}:{client.port}"
        )
    except Exception as e:
        logger.error(
            f"Unexpected WebSocket error for "
            f"{client.host}:{client.port}: {e}"
        )
    finally:
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.close()
        logger.info(
            f"WebSocket session ended: {client.host}:{client.port}"
        )

# ================================
# GET /status
# called by React directly (supervisor's attendance page).
# ================================
@router.get("/status", response_model=StatusResponse)
async def status():
    """
    Return the current health and readiness state of the service.

    Called by React when the supervisor opens the attendance page.
    React uses this to decide whether to show "System Ready" or
    "System Not Ready — contact admin".

    Response fields:
      - is_hydrated:       True if /hydrate-memory was called successfully
      - students_in_cache: Number of enrolled students loaded in Redis
      - logged_today:      Number of students already logged today
      - model_loaded:      True if InsightFace model is loaded and ready

    Returns 200 always — React reads the fields to determine readiness.
    """
    return await get_system_status()