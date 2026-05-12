import enum
from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from database.connection import Base

class Student(Base):
    __tablename__ = "students"

    id         = Column(Integer, primary_key=True)
    userId     = Column(Integer, nullable=False, unique=True)
    fullName   = Column(String, nullable=True)

class StudentApplication(Base):
    __tablename__ = "student_applications"

    id        = Column(Integer, primary_key=True, autoincrement=True)
    studentId = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    status    = Column(String, nullable=False)
    securityReviewStatus        = Column(Boolean, nullable=True)
    candidateForFinalAcceptance = Column(String, nullable=True, default="pending")
    finalAcceptance             = Column(String, nullable=True, default="pending")

class Resident(Base):
    __tablename__ = "residents"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    student_id     = Column(Integer, ForeignKey("students.id", ondelete="RESTRICT"), nullable=False)
    application_id = Column(Integer, ForeignKey("student_applications.id", ondelete="RESTRICT"), nullable=False, unique=True)
    status         = Column(String, nullable=False, default="pending_assignment")

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, unique=True)
    embedding  = Column(Text, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("student_id", name="uq_face_embeddings_student_id"),
    )

class AttendanceMethodEnum(enum.Enum):
    face_scan = "face_scan"
    manual    = "manual"

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    resident_id = Column(Integer, ForeignKey("residents.id", ondelete="CASCADE"), nullable=False)
    logged_at   = Column(DateTime, default=datetime.utcnow, nullable=False)
    method      = Column(Enum(AttendanceMethodEnum), nullable=False, default=AttendanceMethodEnum.face_scan)
    confidence  = Column(Float, nullable=True)
    notes       = Column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint("resident_id", "logged_at", name="uq_attendance_logs_resident_logged_at"),
    )