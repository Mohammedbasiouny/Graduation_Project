from typing import Optional
from pydantic import BaseModel

# ================================
# POST /hydrate-memory
# ================================

class StudentEmbeddingItem(BaseModel):
    """
    A single student record sent by NestJS during cache hydration.
    NestJS queries all accepted students with embeddings from PostgreSQL
    and sends them in one batch to this endpoint.

    Fields:
        student_id  — student's primary key
        full_name   — student's full name for display in recognition response
        embedding   — 512-dimensional ArcFace embedding as a list of floats
    """
    student_id:  int
    full_name:   Optional[str]   = None
    embedding:   list[float]

class HydrateMemoryRequest(BaseModel):
    """
    Request body for /hydrate-memory.
    NestJS sends all accepted students in one batch.
    """
    students: list[StudentEmbeddingItem]

class HydrateMemoryResponse(BaseModel):
    """
    Response returned after successfully loading the cache.

    Fields:
        students_loaded — number of student embeddings loaded into Redis
        already_logged  — number of students found to already be logged today
                        pre-loaded from PostgreSQL to handle Python restarts mid-day
    """
    students_loaded: int
    already_logged:  int

# ================================
# POST /reset-system
# ================================
class ResetSystemResponse(BaseModel):
    """
    Response returned after a full system reset for a new academic year.
    Python owns the entire reset — DB truncation + Redis cache clear.

    Fields:
        embeddings_cleared — True if face_embeddings table was truncated
        logs_cleared       — True if attendance_logs table was truncated
        cache_cleared      — True if Redis cache was cleared
        embeddings_deleted — number of embedding records deleted
        logs_deleted       — number of attendance log records deleted
    """
    embeddings_cleared: bool
    logs_cleared:       bool
    cache_cleared:      bool
    embeddings_deleted: int
    logs_deleted:       int