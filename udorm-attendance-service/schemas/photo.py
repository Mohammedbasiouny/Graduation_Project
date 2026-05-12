from typing import Literal, Optional
from pydantic import BaseModel

# ================================
# POST /validate-photo
# ================================
class ValidatePhotoResponse(BaseModel):
    """
    Response returned after running photo validation checks.

    Fields:
      passed  — True if all checks passed, False if any failed
      errors  — dict of failed check name → error message
                empty dict if passed=True
                keys: "face_count", "aspect_ratio", "background"
    """
    passed: bool
    errors: dict[str, str] = {}

# ================================
# WS /ws/enroll/{student_id}
# (live capture enrollment)
# ================================
class LiveEnrollMessage(BaseModel):
    """
    WebSocket message sent by Python to React during a live
    enrollment session. Sent after processing every received frame.

    Fields:
      status           — one of five states (see below)
      frames_collected — number of confirmed good frames so far
      frames_required  — target frame count (always 15)
      student_id       — present only on "success"
      message          — human-readable description for the supervisor UI

    Status values:
      "waiting"    — connection opened, system ready to receive frames
      "collecting" — frame accepted, same person confirmed, count++
      "reject"     — frame rejected:
                        • different person detected (consistency check failed)
                        • no face detected in frame
                        • face quality too low
                        • Multiple faces detected
      "success"    — 15 good frames collected, embedding saved to DB
      "error"      — fatal error: student not found, DB failure, etc.
                      connection will close after this message
    """
    status:           Literal["waiting", "collecting", "reject", "success", "error"]
    frames_collected: int                = 0
    frames_required:  int                = 15
    student_id:       Optional[int]      = None
    message:          str                = ""

# ================================
# POST /unenroll-student
# ================================
class UnenrollStudentRequest(BaseModel):
    """
    Request body for removing a student's face embedding.
    Sent by NestJS when a student's acceptance is revoked.
    """
    student_id: int

class UnenrollStudentResponse(BaseModel):
    """
    Response returned after removing a student from DB and cache.

    Fields:
      student_id         — the student that was unenrolled
      removed_from_db    — True if embedding was found and deleted from PostgreSQL
      removed_from_cache — True if student was found and removed from Redis cache
    """
    student_id:         int
    removed_from_db:    bool
    removed_from_cache: bool