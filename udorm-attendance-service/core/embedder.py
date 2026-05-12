import cv2
import numpy as np
from typing import Optional

from core.face_detector import DetectedFace, face_detector
from utils.logger import logger


# ================================
# Jitter Configuration
# (used only by single-photo mode)
# ================================
JITTER_COUNT = 10
MAX_ROTATION_DEGREES = 5
SCALE_RANGE = (0.95, 1.05)
MAX_SHIFT_FRACTION = 0.03

# Minimum frames required to generate a valid embedding from live capture
MIN_FRAMES_REQUIRED = 15


# ================================
# Internal Helpers
# ================================

def _jitter_image(image: np.ndarray) -> np.ndarray:
    h, w   = image.shape[:2]
    center = (w / 2, h / 2)

    angle = np.random.uniform(-MAX_ROTATION_DEGREES, MAX_ROTATION_DEGREES)
    scale = np.random.uniform(*SCALE_RANGE)
    M     = cv2.getRotationMatrix2D(center, angle, scale)

    tx = np.random.uniform(-MAX_SHIFT_FRACTION, MAX_SHIFT_FRACTION) * w
    ty = np.random.uniform(-MAX_SHIFT_FRACTION, MAX_SHIFT_FRACTION) * h
    M[0, 2] += tx
    M[1, 2] += ty

    return cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_LINEAR)


def _extract_single_embedding(image: np.ndarray) -> Optional[np.ndarray]:
    faces: list[DetectedFace] = face_detector.detect(image)

    if not faces:
        return None

    return faces[0].embedding


def _average_and_normalize(embeddings: list[np.ndarray]) -> Optional[list[float]]:
    stacked  = np.stack(embeddings, axis=0)
    averaged = np.mean(stacked, axis=0)

    norm = np.linalg.norm(averaged)
    if norm == 0:
        logger.error("Averaged embedding has zero norm — cannot normalize.")
        return None

    return (averaged / norm).tolist()

# ================================
# Live Frame Enrollment
# ================================

def generate_embedding_from_frames(
    frames: list[np.ndarray],
) -> Optional[list[float]]:

    embeddings: list[np.ndarray] = []

    for i, frame in enumerate(frames):
        embedding = _extract_single_embedding(frame)

        if embedding is not None:
            embeddings.append(embedding)
        else:
            logger.warning(
                f"Frame {i + 1}/{len(frames)}: no face detected during "
                f"final embedding generation — skipping."
            )

    if len(embeddings) < MIN_FRAMES_REQUIRED:
        logger.error(
            f"Not enough valid frames to generate embedding. "
            f"Got {len(embeddings)}, required {MIN_FRAMES_REQUIRED}."
        )
        return None

    logger.info(
        f"Live-capture embedding generated from "
        f"{len(embeddings)}/{len(frames)} frames."
    )

    return _average_and_normalize(embeddings)