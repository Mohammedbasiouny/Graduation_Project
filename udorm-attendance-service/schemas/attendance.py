from typing import Optional
from pydantic import BaseModel

# ================================
# WS /ws/recognize
# ================================
class BoundingBox(BaseModel):
    """
    Pixel coordinates of a detected face in the frame.
    React uses these to draw overlay boxes on the video feed.
    Origin is top-left corner of the frame.
    """
    top:    int
    right:  int
    bottom: int
    left:   int

class FaceResult(BaseModel):
    """
    Result for a single detected face in the frame.

    Fields:
      recognized     — True if face matched an enrolled student
      student_id     — matched student's primary key (None if unrecognized)
      full_name      — matched student's full name (None if unrecognized)
      confidence     — cosine similarity score 0.0 → 1.0 (None if unrecognized)
      already_logged — True if this student was already logged today
      logged_now     — True if this frame just triggered a new attendance log
      bounding_box   — pixel coordinates for drawing overlay on the video feed
    """
    recognized:     bool
    student_id:     Optional[int]   = None
    full_name:      Optional[str]   = None
    confidence:     Optional[float] = None
    already_logged: bool            = False
    logged_now:     bool            = False
    bounding_box:   BoundingBox

class RecognizeResponse(BaseModel):
    """
    Response returned after processing a single frame.
    Contains results for ALL detected faces simultaneously.

    Fields:
      faces          — list of FaceResult, one per detected face
      faces_detected — total number of faces detected in the frame
      faces_logged   — number of new attendance records written in this frame
    """
    faces:          list[FaceResult]
    faces_detected: int
    faces_logged:   int

# ================================
# GET /status
# ================================
class StatusResponse(BaseModel):
    """
    Current state of the Python service.
    React uses this to decide whether to allow starting an attendance session.

    Fields:
      is_hydrated       — True if /hydrate-memory has been called successfully
      students_in_cache — number of enrolled students loaded in Redis
      logged_today      — number of students already logged today
      model_loaded      — True if InsightFace model is loaded and ready
    """
    is_hydrated:        bool
    students_in_cache:  int
    logged_today:       int
    model_loaded:       bool