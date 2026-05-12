import os
os.environ["ORT_LOGGING_LEVEL"] = "3"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import warnings
import logging
# ── SILENCE WARNINGS ──
warnings.filterwarnings("ignore", category=UserWarning, module="onnxruntime")
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")
warnings.filterwarnings("ignore", category=UserWarning, module="albumentations")
logging.getLogger("pydantic").setLevel(logging.ERROR)

from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.dependencies import get_database_session
from database.connection import SessionLocal
from api.router import app_router
from config.settings import settings
from core.face_detector import face_detector
from database import queries
from memory import cache
from memory.redis_client import redis_client
from utils.logger import logger


# ================================
# Lifespan — Startup & Shutdown
# ================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    logger.info("=" * 60)
    logger.info("udorm-attendance service starting up...")
    logger.info(f"Host: {settings.APP_HOST}  Port: {settings.APP_PORT}")
    logger.info(f"InsightFace model:     {settings.INSIGHTFACE_MODEL_PACK}")
    logger.info(f"Detection threshold:   {settings.DETECTION_THRESHOLD}")
    logger.info(f"Recognition threshold: {settings.RECOGNITION_THRESHOLD}")
    logger.info(f"Max faces per frame:   {settings.MAX_FACES_PER_FRAME}")
    logger.info(f"Redis URL:             {settings.REDIS_URL}")
    logger.info(f"Queue key:             {settings.REDIS_QUEUE_KEY}")
    logger.info(f"Consumer batch size:   {settings.CONSUMER_BATCH_SIZE}")
    logger.info("=" * 60)

    os.makedirs("logs", exist_ok=True)

    # ── Verify Redis connection ──
    try:
        redis_client.ping()
        logger.info("Redis connection verified.")
    except Exception as e:
        logger.critical(f"Redis is not reachable at startup: {e}")
        logger.critical("Service cannot start without Redis.")
        raise

    # ── Load InsightFace model ──
    try:
        face_detector.load()
    except Exception as e:
        logger.critical(f"Failed to load InsightFace model: {e}")
        logger.critical("Service cannot start without the face recognition model.")
        raise

    logger.info("Service is ready. Waiting for /hydrate-memory from NestJS.")
    logger.info("=" * 60)


    # ── Self-Hydration ──
    db = SessionLocal()
    try:
        students = queries.get_all_accepted_students_with_embeddings(db)
        already_logged = queries.get_todays_logged_student_ids(db)
        cache.hydrate(students, already_logged)
        logger.info(f"Self-hydrated on boot: {len(students)} students loaded.")
    finally:
        db.close()
    logger.info("Service is ready.")
    
    yield

    # ── Shutdown ──
    logger.info("=" * 60)
    logger.info("udorm-attendance service shutting down...")
    logger.info("=" * 60)

# ================================
# FastAPI Application
# ================================
app = FastAPI(
    title       = "udorm-attendance",
    description = (
        "AI Face Recognition Microservice for the UDORM University Housing Platform. "
        "Handles photo validation, student enrollment, and real-time attendance recognition."
    ),
    version     = "1.0.0",
    lifespan    = lifespan,
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

# ================================
# CORS Middleware
# ================================
app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.ALLOWED_ORIGINS_LIST,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ================================
# Routes
# ================================
app.include_router(app_router)

# ================================
# Root Health Check
# ================================
@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "udorm-attendance",
        "version": "1.0.0",
        "status":  "running",
    }

# ================================
# Entry Point
# ================================
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host    = settings.APP_HOST,
        port    = settings.APP_PORT,
        reload  = False,   # never use reload=True in production
    )