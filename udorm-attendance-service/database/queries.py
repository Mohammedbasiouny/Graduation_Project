import json
from datetime import date, datetime
from typing import Optional
from utils.logger import logger
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models import (
    Student,
    StudentApplication,
    FaceEmbedding,
    AttendanceLog,
    Resident,
    AttendanceMethodEnum,
)


# ================================
# Student Queries
# ================================
def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
    return db.query(Student).filter(Student.id == student_id).first()

# Called once by /hydrate-memory to load the in-memory cache.
def get_all_accepted_students_with_embeddings(db: Session) -> list[dict]:
    rows = (
        db.query(Student, FaceEmbedding)
        .join(FaceEmbedding, FaceEmbedding.student_id == Student.id)
        .join(StudentApplication, StudentApplication.studentId == Student.id)
        .filter(StudentApplication.securityReviewStatus == True)
        .filter(StudentApplication.candidateForFinalAcceptance == "accepted")
        .filter(StudentApplication.finalAcceptance == "accepted")
        .all()
    )

    result = []
    for student, embedding in rows:
        result.append({
            "student_id":  student.id,
            "full_name":   student.fullName,
            "embedding":   json.loads(embedding.embedding),
        })

    return result

# ================================
# Face Embedding Queries
# ================================
def get_embedding_by_student_id(db: Session, student_id: int) -> Optional[FaceEmbedding]:
    return (
        db.query(FaceEmbedding)
        .filter(FaceEmbedding.student_id == student_id)
        .first()
    )

# Called by /enroll-student after InsightFace generates the embedding.
def save_embedding(db: Session, student_id: int, embedding: list[float]) -> FaceEmbedding:
    existing = get_embedding_by_student_id(db, student_id)

    if existing:
        existing.embedding  = json.dumps(embedding)
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing

    record = FaceEmbedding(
        student_id = student_id,
        embedding  = json.dumps(embedding),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

# Called by /unenroll-student when a student's acceptance is revoked.
def delete_embedding(db: Session, student_id: int) -> bool:
    record = get_embedding_by_student_id(db, student_id)
    if not record:
        return False

    db.delete(record)
    db.commit()
    return True

# ================================
# Attendance Log Queries
# ================================
def get_todays_logged_student_ids(db: Session) -> set[int]:
    today = date.today()

    rows = (
        db.query(Resident.student_id)
        .join(AttendanceLog, AttendanceLog.resident_id == Resident.id)
        .filter(func.date(AttendanceLog.logged_at) == today)
        .all()
    )

    return {row.student_id for row in rows}

# Called by attendance_service after a student passes recognition
def log_attendance(db: Session, student_id: int, confidence: float, **kwargs) -> Optional[AttendanceLog]:
    """
    Finds the resident ID for a student and logs their attendance.
    The **kwargs catch extra fields (like 'date') sent by the consumer.
    """
    # 1. Find the resident record for this student
    resident = db.query(Resident).filter(Resident.student_id == student_id).first()
    
    if not resident:
        logger.error(f"Attendance failed: Student ID {student_id} is not a registered resident.")
        return None

    # 2. Create the log using resident_id instead of student_id
    record = AttendanceLog(
        resident_id = resident.id,
        logged_at   = datetime.utcnow(),
        confidence  = confidence,
        method      = kwargs.get("method", AttendanceMethodEnum.face_scan)
    )
    
    db.add(record)
    # Note: The consumer handles the db.commit()
    return record

# Used by /status to return today's logged count to the frontend.
def get_attendance_logs_for_today(db: Session) -> list[AttendanceLog]:
    today = date.today()

    return (
        db.query(AttendanceLog)
        .filter(func.date(AttendanceLog.logged_at) == today)
        .order_by(AttendanceLog.logged_at.asc())
        .all()
    )

def get_attendance_logs_for_date(db: Session, target_date: str) -> list[AttendanceLog]:
    return (
        db.query(AttendanceLog)
        .filter(func.date(AttendanceLog.logged_at) == target_date)
        .order_by(AttendanceLog.logged_at.asc())
        .all()
    )

# ================================
# Reset Queries
# ================================
# Called by reset_system() at the start of a new academic year.
def truncate_face_embeddings(db: Session) -> int:
    count = db.query(FaceEmbedding).count()
    db.query(FaceEmbedding).delete()
    db.commit()
    logger.info(f"Truncated face_embeddings: {count} records deleted.")
    return count

# Called by reset_system() at the start of a new academic year.
def truncate_attendance_logs(db: Session) -> int:
    count = db.query(AttendanceLog).count()
    db.query(AttendanceLog).delete()
    db.commit()
    logger.info(f"Truncated attendance_logs: {count} records deleted.")
    return count