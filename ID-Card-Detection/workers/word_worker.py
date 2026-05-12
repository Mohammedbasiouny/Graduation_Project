import asyncio

from config import get_settings
from services.IDCardService import IDCardService
from services.RedisService import RedisService
from services.StudentWordService import StudentWordService
from services.TaskService import TaskService
from workers.WordGenerationWorker import WordGenerationWorker


async def main() -> None:
    settings = get_settings()
    redis_service = RedisService(
        settings.redis_url,
        health_check_interval=settings.redis_health_check_interval,
    )
    await redis_service.connect()

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
    task_service = TaskService(redis_service)
    worker = WordGenerationWorker(
        task_service=task_service,
        student_word_service=student_word_service,
        base_dir=settings.base_dir,
        outputs_dir=settings.outputs_dir,
        queue_name=settings.word_generation_queue,
        heartbeat_interval_seconds=settings.task_heartbeat_interval,
    )

    try:
        await worker.run_forever()
    finally:
        await redis_service.close()


if __name__ == "__main__":
    asyncio.run(main())
