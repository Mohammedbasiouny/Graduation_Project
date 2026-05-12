import math
import sys
import time


def create_progress_tracker(total: int):
    return {
        "total": total,
        "done": 0,
        "start_time": time.time()
    }


def update_progress(tracker: dict, step: int = 1, label: str = "") -> int:
    tracker["done"] += step

    elapsed = time.time() - tracker["start_time"]

    if tracker["done"] > 0:
        avg = elapsed / tracker["done"]
        remaining = tracker["total"] - tracker["done"]
        eta = math.ceil(avg * remaining)
    else:
        eta = 0

    percent = (tracker["done"] / tracker["total"]) * 100 if tracker["total"] else 100

    msg = f"[{percent:6.2f}%] {tracker['done']}/{tracker['total']} | ETA: {eta}s"

    if label:
        msg += f" | {label}"

    sys.stdout.write("\r" + msg)
    sys.stdout.flush()
    return min(100, max(0, int(percent)))


def finish_progress():
    sys.stdout.write("\n")
    sys.stdout.flush()
