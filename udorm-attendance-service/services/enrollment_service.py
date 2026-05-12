import numpy as np
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

import httpx
from config.settings import settings

from core.embedder import generate_embedding_from_frames
from core.face_detector import face_detector
from database import queries
from memory import cache
from schemas.photo import (
    LiveEnrollMessage,
    UnenrollStudentResponse,
)
from utils.image_utils import apply_clahe, decode_image_bytes, resize_frame
from utils.logger import logger


# ================================
# Configurations
# ================================
CONSISTENCY_THRESHOLD = 0.50
FRAMES_REQUIRED = 15

# ================================
# Notifications
# ================================
async def notify_nestjs_enrollment_complete(student_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.NESTJS_SERVICE_URL}/api/internal/residents/from-enrollment",
                json    = {"student_id": student_id},
                headers = {"x-internal-key": settings.INTERNAL_API_KEY},
                timeout = 10.0,
            )
            response.raise_for_status()
            logger.info(f"NestJS resident row created for student_id={student_id}")
    except Exception as e:
        logger.error(f"Failed to notify NestJS for student_id={student_id}: {e}")

# ================================
# WS /ws/enroll/{student_id}
# Live capture enrollment — frame-by-frame
# ================================
async def process_enrollment_frame(
    student_id:       int,
    image_bytes:      bytes,
    collected_frames: list[np.ndarray],
    reference_embedding: "np.ndarray | None",
    db:               Session,
) -> tuple[LiveEnrollMessage, list[np.ndarray], "np.ndarray | None", bool]:
    frames_collected = len(collected_frames)

    # ── Decode and preprocess frame ──
    frame = decode_image_bytes(image_bytes)
    if frame is None:
        return (
            LiveEnrollMessage(
                status           = "reject",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = "Could not decode frame — please try again.",
            ),
            collected_frames,
            reference_embedding,
            False,
        )

    frame = resize_frame(frame, max_width=1280)
    frame = apply_clahe(frame)

    # ── Detect face in frame ──
    detected = face_detector.detect(frame)

    if not detected:
        return (
            LiveEnrollMessage(
                status           = "reject",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = "No face detected — look directly at the camera.",
            ),
            collected_frames,
            reference_embedding,
            False,
        )
    
    if len(detected) > 1:
        logger.warning(
            f"Multiple faces detected in frame for student_id={student_id} — "
            f"rejecting frame. Detected faces: {len(detected)}"
        )
        return (
            LiveEnrollMessage(
                status           = "reject",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = "Multiple faces detected — ensure only the student sits in front of the camera.",
            ),
            collected_frames,
            reference_embedding,
            False,
        )
    
    # Take highest-confidence face
    best_face = detected[0]

    # ── Set reference embedding on first good frame ──
    if reference_embedding is None:
        reference_embedding = best_face.embedding
        collected_frames.append(frame)
        frames_collected = len(collected_frames)

        logger.info(
            f"Reference embedding set for student_id={student_id}. "
            f"Frame 1/{FRAMES_REQUIRED} collected."
        )

        return (
            LiveEnrollMessage(
                status           = "collecting",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = "Face detected — keep looking at the camera.",
            ),
            collected_frames,
            reference_embedding,
            False,
        )

    # ── Consistency check — is this the same person? ──
    similarity      = float(np.dot(best_face.embedding, reference_embedding))
    cosine_distance = 1.0 - similarity

    if cosine_distance > CONSISTENCY_THRESHOLD:
        logger.warning(
            f"Consistency check failed for student_id={student_id}: "
            f"similarity={similarity:.4f} distance={cosine_distance:.4f}"
        )
        return (
            LiveEnrollMessage(
                status           = "reject",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = "Different face detected — ensure only the student sits in front of the camera.",
            ),
            collected_frames,
            reference_embedding,
            False,
        )

    # ── Frame accepted — add to collection ──
    collected_frames.append(frame)
    frames_collected = len(collected_frames)

    logger.info(
        f"Frame accepted for student_id={student_id}: "
        f"{frames_collected}/{FRAMES_REQUIRED} "
        f"similarity={similarity:.4f}"
    )

    # ── Check if we have enough frames ──
    if frames_collected < FRAMES_REQUIRED:
        return (
            LiveEnrollMessage(
                status           = "collecting",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = f"Collecting... {frames_collected}/{FRAMES_REQUIRED}",
            ),
            collected_frames,
            reference_embedding,
            False,
        )

    # ── 15 frames collected — generate final embedding ──
    logger.info(
        f"Generating final embedding from {FRAMES_REQUIRED} frames "
        f"for student_id={student_id}."
    )

    embedding = generate_embedding_from_frames(collected_frames)

    if embedding is None:
        logger.error(
            f"Embedding generation failed for student_id={student_id} "
            f"despite {FRAMES_REQUIRED} collected frames."
        )
        return (
            LiveEnrollMessage(
                status           = "error",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = "Failed to generate embedding. Please restart the session.",
            ),
            collected_frames,
            reference_embedding,
            True,   # done = True — close connection
        )

    # ── Save to PostgreSQL ──
    try:
        student = queries.get_student_by_id(db, student_id)
        queries.save_embedding(db, student_id, embedding)
        logger.info(f"Live enrollment embedding saved for student_id={student_id}")
    except Exception as e:
        logger.error(f"DB save failed for student_id={student_id}: {e}")
        return (
            LiveEnrollMessage(
                status           = "error",
                frames_collected = frames_collected,
                frames_required  = FRAMES_REQUIRED,
                message          = "Failed to save enrollment to database.",
            ),
            collected_frames,
            reference_embedding,
            True,   # done = True — close connection
        )

    # ── Update Redis cache if already hydrated ──
    if cache.get_status()["is_hydrated"] and student:
        cache.add_student(
            student_id  = student_id,
            full_name   = student.fullName,
            embedding   = embedding,
        )
        logger.info(f"Redis cache updated for student_id={student_id}")

    # ── Notify NestJS to create Resident row ── 
    await notify_nestjs_enrollment_complete(student_id)

    return (
        LiveEnrollMessage(
            status           = "success",
            frames_collected = frames_collected,
            frames_required  = FRAMES_REQUIRED,
            student_id       = student_id,
            message          = "Enrollment complete.",
        ),
        collected_frames,
        reference_embedding,
        True,   # done = True — close connection
    )


# ================================
# POST /unenroll-student
# ================================
async def unenroll_student(
    student_id: int,
    db:         Session,
) -> UnenrollStudentResponse:
    """
    Returns:
        UnenrollStudentResponse indicating what was removed.

    Raises:
        HTTP 404 if no embedding found for this student in the database.
    """
    # ── Remove from PostgreSQL ──
    removed_from_db = queries.delete_embedding(db, student_id)

    if not removed_from_db:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"No face embedding found for student_id={student_id}.",
        )

    logger.info(f"Embedding deleted from DB for student_id={student_id}")

    # ── Remove from Redis cache ──
    removed_from_cache = cache.remove_student(student_id)

    if removed_from_cache:
        logger.info(f"Student removed from cache: student_id={student_id}")
    else:
        logger.warning(
            f"Student not in cache during unenroll: student_id={student_id} "
            f"— may not have been hydrated yet."
        )

    return UnenrollStudentResponse(
        student_id         = student_id,
        removed_from_db    = removed_from_db,
        removed_from_cache = removed_from_cache,
    )