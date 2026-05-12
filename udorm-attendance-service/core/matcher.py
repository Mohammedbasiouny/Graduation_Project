import numpy as np
from dataclasses import dataclass
from typing import Optional

from memory import cache
from config.settings import settings
from utils.logger import logger

@dataclass
class MatchResult:
    student_id:  int
    full_name:   Optional[str]
    confidence:  float


# ================================
# Matcher
# ================================

def find_best_match(live_embedding: np.ndarray) -> Optional[MatchResult]:
    enrolled = cache.get_all_embeddings()

    if not enrolled:
        logger.warning("find_best_match() called but cache is empty — no students enrolled.")
        return None

    # ── Build matrix of all enrolled embeddings ──
    student_ids = list(enrolled.keys())
    matrix      = np.stack(
        [enrolled[sid]["embedding"] for sid in student_ids],
        axis=0,
    )  # shape: (N, 512)

    # ── Compute cosine similarity via dot product ──
    similarities = matrix @ live_embedding  # shape: (N,)

    # ── Find the best match ──
    best_idx   = int(np.argmax(similarities))
    best_score = float(similarities[best_idx])

    # ── Convert similarity to distance and apply threshold ──
    cosine_distance = 1.0 - best_score

    if cosine_distance > settings.RECOGNITION_THRESHOLD:
        logger.debug(
            f"No match found. Best score: {best_score:.4f} "
            f"(distance: {cosine_distance:.4f} > threshold: {settings.RECOGNITION_THRESHOLD})"
        )
        return None

    # ── Build result ──
    matched_id   = student_ids[best_idx]
    student_info = cache.get_student_info(matched_id)

    logger.debug(
        f"Match found: student_id={matched_id} "
        f"name='{student_info.get('full_name')}' "
        f"similarity={best_score:.4f} distance={cosine_distance:.4f}"
    )

    return MatchResult(
        student_id  = matched_id,
        full_name   = student_info.get("full_name"),
        confidence  = best_score,
    )