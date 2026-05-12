import os
from dataclasses import dataclass
from functools import lru_cache


def _load_dotenv(path: str) -> None:
    if not os.path.exists(path):
        return

    with open(path, "r", encoding="utf-8") as file:
        for raw_line in file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def _csv_env(name: str, default: str) -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


def _path_env(name: str, default: str, base_dir: str) -> str:
    value = os.getenv(name, default)
    if os.path.isabs(value):
        return value
    return os.path.join(base_dir, value)


def _bool_env(name: str, default: str = "false") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}


_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_load_dotenv(os.path.join(_BASE_DIR, ".env"))


@dataclass(frozen=True)
class Settings:
    base_dir: str
    api_host: str
    api_port: int
    cors_origins: list[str]
    redis_url: str
    redis_health_check_interval: int
    word_generation_queue: str
    outputs_dir: str
    temp_dir: str
    logs_dir: str
    cleanup_interval_seconds: int
    output_retention_days: int
    max_upload_size: int
    model_path: str
    template_path: str
    allowed_image_extensions: set[str]
    yolo_confidence: float
    yolo_image_size: int
    opencv_num_threads: int
    worker_max_workers: int
    student_queue_max_size: int
    websocket_pubsub_timeout_seconds: float
    task_heartbeat_interval: int
    task_stale_timeout: int
    task_monitor_interval: int
    enable_dev_reset: bool


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    base_dir = _BASE_DIR

    return Settings(
        base_dir=base_dir,
        api_host=os.getenv("API_HOST", "0.0.0.0"),
        api_port=int(os.getenv("API_PORT", "8000")),
        cors_origins=_csv_env(
            "CORS_ORIGINS",
            "http://localhost:3030,http://127.0.0.1:3030",
        ),
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        redis_health_check_interval=int(os.getenv("REDIS_HEALTH_CHECK_INTERVAL", "30")),
        word_generation_queue=os.getenv("WORD_GENERATION_QUEUE", "word_generation_jobs"),
        outputs_dir=_path_env("OUTPUTS_DIR", "outputs", base_dir),
        temp_dir=_path_env("TEMP_DIR", "/tmp", base_dir),
        logs_dir=_path_env("LOGS_DIR", "logs", base_dir),
        cleanup_interval_seconds=int(os.getenv("CLEANUP_INTERVAL_SECONDS", "3600")),
        output_retention_days=int(os.getenv("OUTPUT_RETENTION_DAYS", "7")),
        max_upload_size=int(os.getenv("MAX_UPLOAD_SIZE", str(50 * 1024 * 1024 * 1024))),
        model_path=_path_env("MODEL_PATH", "models/detect_id_card.pt", base_dir),
        template_path=_path_env("TEMPLATE_PATH", "images/sift_template.jpg", base_dir),
        allowed_image_extensions=set(_csv_env("ALLOWED_IMAGE_EXTENSIONS", "jpg,jpeg,png,webp")),
        yolo_confidence=float(os.getenv("YOLO_CONFIDENCE", "0.8")),
        yolo_image_size=int(os.getenv("YOLO_IMAGE_SIZE", "640")),
        opencv_num_threads=int(os.getenv("OPENCV_NUM_THREADS", "4")),
        worker_max_workers=int(os.getenv("WORKER_MAX_WORKERS", "4")),
        student_queue_max_size=int(os.getenv("STUDENT_QUEUE_MAX_SIZE", "8")),
        websocket_pubsub_timeout_seconds=float(os.getenv("WEBSOCKET_PUBSUB_TIMEOUT_SECONDS", "1.0")),
        task_heartbeat_interval=int(os.getenv("TASK_HEARTBEAT_INTERVAL", "15")),
        task_stale_timeout=int(os.getenv("TASK_STALE_TIMEOUT", "60")),
        task_monitor_interval=int(os.getenv("TASK_MONITOR_INTERVAL", "60")),
        enable_dev_reset=_bool_env("ENABLE_DEV_RESET"),
    )
