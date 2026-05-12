import json
from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from core.face_detector import face_detector
from core.matcher import find_best_match
from database import queries
from memory import cache
from memory.redis_client import redis_client
from config.settings import settings
from schemas.attendance import (
    BoundingBox,
    FaceResult,
    RecognizeResponse,
    StatusResponse,
)
from schemas.system import (
    HydrateMemoryRequest,
    HydrateMemoryResponse,
    ResetSystemResponse,
)
from utils.image_utils import apply_clahe, decode_image_bytes, resize_frame
from utils.logger import logger

# ================================
# - WS /ws/recognize
# ================================
async def process_frame(image_bytes: bytes) -> RecognizeResponse:
    """
    Returns:
        RecognizeResponse with results for every detected face in the frame.

    Raises:
        HTTP 422 if image bytes cannot be decoded.
        HTTP 503 if the system is not hydrated yet.
    """
    # ── Guard: system must be hydrated before recognizing ──
    if not cache.get_status()["is_hydrated"]:
        raise HTTPException(
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE,
            detail      = "System is not ready. Call /hydrate-memory first.",
        )

    # ── Decode frame ──
    frame = decode_image_bytes(image_bytes)
    if frame is None:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail      = "Could not decode frame. Ensure the image is a valid JPEG or PNG.",
        )

    # ── Preprocess ──
    frame = resize_frame(frame, max_width=1280)
    frame = apply_clahe(frame)

    # ── Detect all faces ──
    detected_faces = face_detector.detect(frame)

    if not detected_faces:
        logger.debug("No faces detected in frame.")
        return RecognizeResponse(
            faces          = [],
            faces_detected = 0,
            faces_logged   = 0,
        )

    logger.debug(f"{len(detected_faces)} face(s) detected in frame.")

    # ── Process each detected face ──
    face_results: list[FaceResult] = []
    faces_logged = 0

    for detected in detected_faces:
        bounding_box = BoundingBox(**detected.bounding_box)

        # ── Match against local NumPy cache ──
        match = find_best_match(detected.embedding)

        # ── Unknown face ──
        if match is None:
            face_results.append(FaceResult(
                recognized   = False,
                bounding_box = bounding_box,
            ))
            continue

        # ── Atomic SADD — race-condition safe across all workers ──
        is_new = cache.is_already_logged_atomic(match.student_id)
        logged_now = False

        if is_new:
            # ── Publish attendance event to Redis queue ──
            try:
                event = json.dumps({
                    "student_id": match.student_id,
                    "date":       date.today().isoformat(),
                    "confidence": match.confidence,
                })
                redis_client.lpush(settings.REDIS_QUEUE_KEY, event)
                logged_now   = True
                faces_logged += 1

                logger.info(
                    f"Attendance event queued: student_id={match.student_id} "
                    f"name='{match.full_name}' confidence={match.confidence:.4f}"
                )

            except Exception as e:
                logger.error(
                    f"Failed to publish attendance event for "
                    f"student_id={match.student_id}: {e}"
                )
        else:
            logger.debug(
                f"Student already logged today — skipping: "
                f"student_id={match.student_id} name='{match.full_name}'"
            )

        face_results.append(FaceResult(
            recognized     = True,
            student_id     = match.student_id,
            full_name      = match.full_name,
            confidence     = match.confidence,
            already_logged = not is_new,
            logged_now     = logged_now,
            bounding_box   = bounding_box,
        ))

    return RecognizeResponse(
        faces          = face_results,
        faces_detected = len(detected_faces),
        faces_logged   = faces_logged,
    )

# ================================
# - POST /hydrate-memory
# ================================

async def hydrate_memory(
    request: HydrateMemoryRequest,
    db:      Session,
) -> HydrateMemoryResponse:
    """
    Returns:
        HydrateMemoryResponse confirming how many students and logs were loaded.
    """
    logger.info(f"Hydrating memory with {len(request.students)} students.")

    # ── Load today's already-logged student IDs from PostgreSQL ──
    already_logged_ids = queries.get_todays_logged_student_ids(db)
    logger.info(f"Found {len(already_logged_ids)} students already logged today.")

    # ── Convert request items to plain dicts for cache.hydrate() ──
    students = [
        {
            "student_id":  s.student_id,
            "full_name":   s.full_name,
            "embedding":   s.embedding,
        }
        for s in request.students
    ]

    # ── Load into Redis + local NumPy cache ──
    cache.hydrate(students, already_logged_ids)

    logger.info(
        f"Hydration complete: {len(students)} embeddings loaded, "
        f"{len(already_logged_ids)} students marked as already logged today."
    )

    return HydrateMemoryResponse(
        students_loaded = len(students),
        already_logged  = len(already_logged_ids),
    )

# ================================
# - POST /reset-system
# ================================
async def reset_system(db: Session) -> ResetSystemResponse:
    """
    Returns:
        ResetSystemResponse with counts of deleted records and cache state.
    """
    logger.info("Starting full system reset for new academic year.")

    # ── Step 1 + 2: Truncate DB tables ──
    try:
        embeddings_deleted = queries.truncate_face_embeddings(db)
        logs_deleted       = queries.truncate_attendance_logs(db)
    except Exception as e:
        logger.error(f"DB truncation failed during reset: {e}")
        raise

    # ── Step 3: Clear Redis cache + local NumPy cache ──
    cache.reset()

    logger.info(
        f"System reset complete: {embeddings_deleted} embeddings deleted, "
        f"{logs_deleted} attendance logs deleted, cache cleared."
    )

    return ResetSystemResponse(
        embeddings_cleared = True,
        logs_cleared       = True,
        cache_cleared      = True,
        embeddings_deleted = embeddings_deleted,
        logs_deleted       = logs_deleted,
    )

# ================================
# Status
# - GET  /status
# ================================
async def get_system_status() -> StatusResponse:
    """
    Return the current health and readiness state of the service.
    React calls this on page load to confirm the system is ready.

    Returns:
        StatusResponse with hydration state, cache counts, and model readiness.
    """
    cache_status = cache.get_status()

    return StatusResponse(
        is_hydrated       = cache_status["is_hydrated"],
        students_in_cache = cache_status["students_in_cache"],
        logged_today      = cache_status["logged_today"],
        model_loaded      = face_detector.is_ready,
    )