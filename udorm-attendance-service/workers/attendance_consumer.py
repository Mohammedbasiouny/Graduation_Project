import json
import signal
import sys
import time
from datetime import datetime

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from config.settings import settings
from database.connection import SessionLocal
from database.models import AttendanceLog
from database.queries import log_attendance
from memory.redis_client import create_redis_client
from utils.logger import logger


# ================================
# Graceful Shutdown
# ================================
_running = True


def _handle_shutdown(signum, frame):
    global _running
    logger.info(f"Consumer received signal {signum} — shutting down after current batch.")
    _running = False


signal.signal(signal.SIGTERM, _handle_shutdown)
signal.signal(signal.SIGINT, _handle_shutdown)


# ================================
# Batch Insert
# ================================

def _insert_batch(db: Session, events: list[dict]) -> tuple[int, int]:
    inserted   = 0
    duplicates = 0

    for event in events:
        try:
            record = log_attendance(db, **event)
            if record:
                inserted += 1
        except IntegrityError:
            db.rollback()
            duplicates += 1
            logger.debug(f"Duplicate skipped for student_id={event.get('student_id')}")
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to insert attendance event: {e} | event={event}")

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Batch commit failed: {e}")
        return 0, len(events)

    return inserted, duplicates

# ================================
# Main Consumer Loop
# ================================
def run_consumer() -> None:
    logger.info("=" * 60)
    logger.info("Attendance consumer starting...")
    logger.info(f"Redis queue key:    {settings.REDIS_QUEUE_KEY}")
    logger.info(f"Batch size:         {settings.CONSUMER_BATCH_SIZE}")
    logger.info(f"Batch window (ms):  {settings.CONSUMER_BATCH_WINDOW_MS}")
    logger.info("=" * 60)

    consumer_redis = create_redis_client()

    batch_window_seconds = settings.CONSUMER_BATCH_WINDOW_MS / 1000.0

    while _running:
        try:
            # ── BRPOP — block until an event arrives ──
            # Timeout = batch_window_seconds so we don't block forever on shutdown
            result = consumer_redis.brpop(
                settings.REDIS_QUEUE_KEY,
                timeout=batch_window_seconds,
            )

            if result is None:
                continue

            # ── First event received — start collecting batch ──
            _, raw_event = result
            batch = []

            try:
                batch.append(json.loads(raw_event))
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse event from queue: {e} raw={raw_event}")

            deadline = time.monotonic() + batch_window_seconds

            while (
                len(batch) < settings.CONSUMER_BATCH_SIZE
                and time.monotonic() < deadline
                and _running
            ):
                result = consumer_redis.brpop(
                    settings.REDIS_QUEUE_KEY,
                    timeout=max(0.01, deadline - time.monotonic()),
                )

                if result is None:
                    break

                _, raw_event = result
                try:
                    batch.append(json.loads(raw_event))
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse event: {e} raw={raw_event}")

            if not batch:
                continue

            logger.info(f"Inserting batch of {len(batch)} attendance records...")

            db = SessionLocal()
            try:
                inserted, duplicates = _insert_batch(db, batch)
                logger.info(
                    f"Batch complete: {inserted} inserted, "
                    f"{duplicates} duplicates skipped."
                )
            finally:
                db.close()

        except Exception as e:
            logger.error(f"Consumer loop error: {e}")
            time.sleep(2)

    logger.info("Attendance consumer shut down cleanly.")

# ================================
# Entry Point
# ================================
if __name__ == "__main__":
    try:
        run_consumer()
    except Exception as e:
        logger.critical(f"Consumer crashed with unhandled exception: {e}")
        sys.exit(1)