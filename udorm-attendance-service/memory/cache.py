import json
from datetime import date, datetime, timedelta
from typing import Optional

import numpy as np

from config.settings import settings
from memory.redis_client import redis_client
from utils.logger import logger


# ================================
# Redis Key Constants
# ================================

EMBEDDINGS_KEY = "embeddings" 
HYDRATED_KEY   = "is_hydrated" 


def _logged_key() -> str:
    return f"{settings.REDIS_LOGGED_KEY_PREFIX}:{date.today().isoformat()}"


def _seconds_until_midnight() -> int:
    now      = datetime.now()
    midnight = (now + timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    return int((midnight - now).total_seconds())


# ================================
# Local NumPy Cache (per-process)
# ================================
_local_embeddings: dict[int, dict] = {}


# ================================
# Hydration Called once by /hydrate-memory on system boot.
# ================================

def hydrate(students: list[dict], already_logged_ids: set[int]) -> None:
    global _local_embeddings

    logger.info(f"Hydrating Redis cache with {len(students)} students.")

    # ── Clear existing embeddings hash ──
    redis_client.delete(EMBEDDINGS_KEY)

    # ── Write all embeddings to Redis Hash in one pipeline ──
    # Pipeline batches all HSET commands into one network round trip.
    if students:
        pipe = redis_client.pipeline()
        for s in students:
            pipe.hset(
                EMBEDDINGS_KEY,
                key=str(s["student_id"]),
                value=json.dumps({
                    "full_name":   s["full_name"],
                    "embedding":   s["embedding"],
                }),
            )
        pipe.execute()

    # ── Build local NumPy cache ──
    _local_embeddings = {
        s["student_id"]: {
            "full_name":   s["full_name"],
            "embedding":   np.array(s["embedding"], dtype=np.float32),
        }
        for s in students
    }

    # ── Load today's already-logged set into Redis ──
    if already_logged_ids:
        key  = _logged_key()
        pipe = redis_client.pipeline()
        for student_id in already_logged_ids:
            pipe.sadd(key, str(student_id))
        # Set TTL to expire at midnight — auto-resets for next day
        pipe.expire(key, _seconds_until_midnight())
        pipe.execute()

    # ── Set hydration flag ──
    redis_client.set(HYDRATED_KEY, "1")

    logger.info(
        f"Redis hydrated: {len(students)} embeddings, "
        f"{len(already_logged_ids)} already logged today."
    )


# ================================
# Embedding Cache Operations
# ================================
# Called by /enroll-student when a new student is enrolled or an existing
def add_student(
    student_id:  int,
    full_name:   Optional[str],
    embedding:   list[float],
) -> None:
    
    value = json.dumps({
        "full_name":   full_name,
        "embedding":   embedding,
    })
    redis_client.hset(EMBEDDINGS_KEY, key=str(student_id), value=value)

    # Update local NumPy cache
    _local_embeddings[student_id] = {
        "full_name":   full_name,
        "embedding":   np.array(embedding, dtype=np.float32),
    }

    logger.debug(f"Student added to cache: student_id={student_id}")

#Called by /unenroll-student when acceptance is revoked.
def remove_student(student_id: int) -> bool:
    removed = redis_client.hdel(EMBEDDINGS_KEY, str(student_id))

    if student_id in _local_embeddings:
        del _local_embeddings[student_id]

    logger.debug(
        f"Student removed from cache: student_id={student_id} "
        f"found={bool(removed)}"
    )
    return bool(removed)

# Called by matcher.py during recognition for matrix multiplication.
def get_all_embeddings() -> dict[int, dict]:
    return _local_embeddings


def get_student_info(student_id: int) -> Optional[dict]:
    return _local_embeddings.get(student_id)


# ================================
# Already Logged — Atomic SADD
# ================================

def is_already_logged_atomic(student_id: int) -> bool:
    key    = _logged_key()
    result = redis_client.sadd(key, str(student_id))

    if result == 1:
        try:
            redis_client.expire(key, _seconds_until_midnight(), nx=True)
        except Exception:
            redis_client.expire(key, _seconds_until_midnight())

    return result == 1


def get_logged_count_today() -> int:
    return redis_client.scard(_logged_key())


# ================================
# Reset
# ================================

def reset() -> None:
    global _local_embeddings

    redis_client.delete(EMBEDDINGS_KEY)
    redis_client.delete(HYDRATED_KEY)
    redis_client.delete(_logged_key())

    _local_embeddings = {}

    logger.info("Redis cache and local NumPy cache cleared.")


# ================================
# Status
# ================================
# Called by /status endpoint so the frontend can confirm readiness.
def get_status() -> dict:
    return {
        "is_hydrated":       bool(redis_client.exists(HYDRATED_KEY)),
        "students_in_cache": len(_local_embeddings),
        "logged_today":      get_logged_count_today(),
    }