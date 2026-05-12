import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, File, HTTPException, Request, UploadFile, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response

from config import Settings, get_settings
from services.CleanupService import CleanupService
from services.IDCardService import IDCardService
from services.RedisService import RedisService
from services.StaleTaskMonitorService import StaleTaskMonitorService
from services.StudentWordService import StudentWordService
from services.TaskService import ACTIVE_STATUSES, TaskService
from services.WebSocketManager import WebSocketManager
from utils.setup_logger_utils import setup_logger
from workers.WordGenerationWorker import WordGenerationWorker


logger = setup_logger("requests_logger", "requests.log", logging.INFO, console=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    os.makedirs(settings.outputs_dir, exist_ok=True)
    os.makedirs(settings.temp_dir, exist_ok=True)

    redis_service = RedisService(
        settings.redis_url,
        health_check_interval=settings.redis_health_check_interval,
    )
    await redis_service.connect()

    task_service = TaskService(redis_service)
    id_card_service = IDCardService(
        settings.base_dir,
        template_path=settings.template_path,
        model_path=settings.model_path,
        allowed_extensions=settings.allowed_image_extensions,
        yolo_confidence=settings.yolo_confidence,
        yolo_image_size=settings.yolo_image_size,
        opencv_num_threads=settings.opencv_num_threads,
    )
    student_word_service = StudentWordService(
        id_card_service=id_card_service,
        temp_dir=settings.temp_dir,
        max_workers=settings.worker_max_workers,
        queue_max_size=settings.student_queue_max_size,
    )
    websocket_manager = WebSocketManager(
        task_service,
        pubsub_timeout_seconds=settings.websocket_pubsub_timeout_seconds,
    )
    word_worker = WordGenerationWorker(
        task_service=task_service,
        student_word_service=student_word_service,
        base_dir=settings.base_dir,
        outputs_dir=settings.outputs_dir,
        queue_name=settings.word_generation_queue,
        heartbeat_interval_seconds=settings.task_heartbeat_interval,
    )
    cleanup_service = CleanupService(
        outputs_dir=settings.outputs_dir,
        base_dir=settings.base_dir,
        task_service=task_service,
        retention_days=settings.output_retention_days,
        interval_seconds=settings.cleanup_interval_seconds,
    )
    cleanup_task = asyncio.create_task(cleanup_service.run_forever())
    stale_task_monitor = StaleTaskMonitorService(
        task_service=task_service,
        stale_timeout_seconds=settings.task_stale_timeout,
        interval_seconds=settings.task_monitor_interval,
    )
    stale_monitor_task = asyncio.create_task(stale_task_monitor.run_forever())

    app.state.settings = settings
    app.state.redis_service = redis_service
    app.state.task_service = task_service
    app.state.id_card_service = id_card_service
    app.state.websocket_manager = websocket_manager
    app.state.word_worker = word_worker
    app.state.cleanup_service = cleanup_service
    app.state.stale_task_monitor = stale_task_monitor

    try:
        yield
    finally:
        stale_task_monitor.stop()
        cleanup_service.stop()
        stale_monitor_task.cancel()
        cleanup_task.cancel()
        try:
            await stale_monitor_task
        except asyncio.CancelledError:
            pass
        try:
            await cleanup_task
        except asyncio.CancelledError:
            pass
        await redis_service.close()


app = FastAPI(title="ID Card Processor", lifespan=lifespan)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def enforce_upload_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > settings().max_upload_size:
        return JSONResponse(
            status_code=413,
            content={"detail": "Uploaded file is too large"},
        )
    return await call_next(request)


def settings() -> Settings:
    return app.state.settings


def id_card_service() -> IDCardService:
    return app.state.id_card_service


def task_service() -> TaskService:
    return app.state.task_service


def word_worker() -> WordGenerationWorker:
    return app.state.word_worker


def websocket_manager() -> WebSocketManager:
    return app.state.websocket_manager


def cleanup_service() -> CleanupService:
    return app.state.cleanup_service


async def save_upload_to_temp(upload: UploadFile, task_id: str) -> str:
    tmp_zip_path = os.path.join(settings().temp_dir, f"{task_id}.zip")

    with open(tmp_zip_path, "wb") as buffer:
        while True:
            chunk = await upload.read(1024 * 1024)
            if not chunk:
                break
            await asyncio.to_thread(buffer.write, chunk)

    return tmp_zip_path


def resolve_output_path(output_path: str) -> str:
    output_path_fs = output_path
    if not os.path.isabs(output_path_fs):
        output_path_fs = os.path.join(settings().base_dir, output_path_fs)
    return output_path_fs


# ---------------- ID Card APIs ----------------
@app.post("/process-id-image/", tags=["ID Card"])
async def process_id_image(file: UploadFile = File(...)):
    image_bytes = await id_card_service().process_id_image(file)

    return Response(
        content=image_bytes,
        media_type="image/jpeg",
    )


@app.post("/check-egyptian-id/", tags=["ID Card"])
async def check_egyptian_id(file: UploadFile = File(...)):
    is_egyptian = await id_card_service().is_egyptian_id(file)

    return JSONResponse({"is_egyptian": is_egyptian})


# ---------------- Word Document ----------------
@app.post("/generate-word", tags=["Word Document"])
async def generate_word(zip_file: UploadFile = File(...)):
    if not zip_file.filename or not zip_file.filename.lower().endswith(".zip"):
        return JSONResponse(
            status_code=422,
            content={"detail": "Invalid file type. Only ZIP files are allowed."},
        )

    task_id = str(uuid.uuid4())
    task = await task_service().create_task(task_id)

    try:
        tmp_zip_path = await save_upload_to_temp(zip_file, task_id)
    except Exception as exc:
        await task_service().mark_failed(task_id, f"Could not save uploaded ZIP: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Could not save uploaded ZIP", "task_id": task_id},
        )

    await word_worker().enqueue_generate_word(task_id, tmp_zip_path)

    return JSONResponse({"task_id": task_id, "status": task["status"]})


@app.get("/tasks", tags=["Tasks"])
async def get_all_tasks():
    return JSONResponse(await task_service().get_all_tasks())


@app.get("/tasks/{task_id}", tags=["Tasks"])
async def get_single_task(task_id: str):
    task = await task_service().get_task(task_id)
    if not task:
        return JSONResponse(status_code=404, content={"detail": "Task not found"})
    return JSONResponse(task)


@app.get("/tasks/{task_id}/download", tags=["Tasks"])
async def download_task_output(task_id: str):
    task = await task_service().get_task(task_id)
    if not task:
        return JSONResponse(status_code=404, content={"detail": "Task not found"})

    status = task.get("status")
    if status == "finished":
        output_path = task.get("output_path")
        if not output_path:
            return JSONResponse(
                status_code=500,
                content={"message": "Output file not found on server"},
            )

        output_path_fs = resolve_output_path(str(output_path))

        if not os.path.exists(output_path_fs):
            return JSONResponse(
                status_code=500,
                content={"message": "Output file not found on server"},
            )

        return FileResponse(
            path=output_path_fs,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{task_id}.docx",
        )

    if status in ACTIVE_STATUSES:
        return JSONResponse({"message": "Task is still processing"})

    return JSONResponse(
        status_code=400,
        content={"message": task.get("error") or "Task failed"},
    )


@app.websocket("/ws/tasks/{task_id}")
async def task_updates(websocket: WebSocket, task_id: str):
    await websocket_manager().stream_task(websocket, task_id)


@app.post("/dev/reset", tags=["Development"])
async def dev_reset():
    """
    Development-only reset endpoint.

    Enable with ENABLE_DEV_RESET=true. Do not enable this route in production.
    It cancels active task state, publishes cancellation updates, clears Redis
    task/queue/index data, and deletes generated outputs.
    """
    if not settings().enable_dev_reset:
        raise HTTPException(status_code=404, detail="Not found")

    reason = "Development reset requested"
    cancelled_tasks = await task_service().cancel_active_tasks(reason)
    deleted_redis_keys = await task_service().clear_runtime_state(
        [settings().word_generation_queue]
    )
    deleted_output_paths = await cleanup_service().reset_outputs()

    logger.warning(
        "Development reset completed: cancelled_tasks=%s deleted_redis_keys=%s deleted_output_paths=%s",
        cancelled_tasks,
        deleted_redis_keys,
        deleted_output_paths,
    )

    return JSONResponse(
        {
            "status": "reset_complete",
            "cancelled_tasks": cancelled_tasks,
            "deleted_redis_keys": deleted_redis_keys,
            "deleted_output_paths": deleted_output_paths,
        }
    )

# ---------------- Run Server ----------------
if __name__ == "__main__":
    app_settings = get_settings()
    uvicorn.run(app, host=app_settings.api_host, port=app_settings.api_port)
