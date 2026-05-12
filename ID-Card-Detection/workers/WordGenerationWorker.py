import asyncio
import json
import os

from services.StudentWordService import StudentWordService
from services.TaskService import TaskService
from utils.setup_logger_utils import setup_logger


logger = setup_logger("word_generation_worker_logger", "word_generation_worker.log", console=True)


class WordGenerationWorker:
    def __init__(
        self,
        *,
        task_service: TaskService,
        student_word_service: StudentWordService,
        base_dir: str,
        outputs_dir: str,
        queue_name: str,
        heartbeat_interval_seconds: int,
    ) -> None:
        self.task_service = task_service
        self.student_word_service = student_word_service
        self.base_dir = base_dir
        self.outputs_dir = outputs_dir
        self.queue_name = queue_name
        self.heartbeat_interval_seconds = heartbeat_interval_seconds

    async def enqueue_generate_word(self, task_id: str, zip_temp_path: str) -> None:
        payload = json.dumps({"task_id": task_id, "zip_temp_path": zip_temp_path})
        await self.task_service.redis.client.rpush(self.queue_name, payload)
        await self.task_service.update_task(
            task_id,
            status="queued",
            progress=0,
            message="Task queued for worker",
        )

    async def run_forever(self) -> None:
        logger.info(f"Word worker started. Waiting on Redis queue: {self.queue_name}")
        while True:
            _, raw_job = await self.task_service.redis.client.brpop(self.queue_name)
            try:
                job = json.loads(raw_job)
                task_id = job["task_id"]
                zip_temp_path = job["zip_temp_path"]
            except (json.JSONDecodeError, KeyError, TypeError) as exc:
                logger.error(f"Invalid word generation job payload: {exc}")
                continue

            await self.process_generate_word(task_id, zip_temp_path)

    async def process_generate_word(self, task_id: str, zip_temp_path: str) -> None:
        heartbeat_task: asyncio.Task | None = None
        try:
            task = await self.task_service.mark_processing(task_id, "Preparing ZIP file")
            if task.get("status") != "processing":
                logger.warning(f"Skipping task {task_id}; current status is {task.get('status')}")
                return
            heartbeat_task = asyncio.create_task(self._heartbeat_until_done(task_id))

            async def progress_callback(progress: int, message: str) -> None:
                mapped_progress = 5 + int(progress * 0.90)
                await self.task_service.update_task(
                    task_id,
                    status="processing",
                    progress=mapped_progress,
                    message=message,
                )

            doc_stream = await self.student_word_service.process_zip_path(
                zip_temp_path,
                progress_callback=progress_callback,
            )

            task = await self.task_service.get_task(task_id)
            if not task or task.get("status") != "processing":
                logger.warning(
                    f"Task {task_id} completed locally after it was no longer active; skipping output write"
                )
                return

            output_path_fs = os.path.join(self.outputs_dir, f"{task_id}.docx")
            os.makedirs(self.outputs_dir, exist_ok=True)

            await asyncio.to_thread(self._write_docx, output_path_fs, doc_stream.getbuffer())
            task = await self.task_service.mark_finished(task_id, self._stored_output_path(output_path_fs))
            if task.get("status") == "finished":
                logger.info(f"Task {task_id} finished: {output_path_fs}")
            else:
                logger.warning(f"Task {task_id} output was written but task is already {task.get('status')}")
                try:
                    await asyncio.to_thread(os.remove, output_path_fs)
                except FileNotFoundError:
                    pass
                except OSError as exc:
                    logger.warning(f"Could not remove output for inactive task {task_id}: {exc}")

        except Exception as exc:
            await self.task_service.mark_failed(task_id, str(exc))
            logger.error(f"Task {task_id} failed: {exc}")

        finally:
            if heartbeat_task:
                heartbeat_task.cancel()
                try:
                    await heartbeat_task
                except asyncio.CancelledError:
                    pass
            try:
                if zip_temp_path and os.path.exists(zip_temp_path):
                    await asyncio.to_thread(os.remove, zip_temp_path)
            except OSError as exc:
                logger.warning(f"Could not remove temp ZIP {zip_temp_path}: {exc}")

    async def _heartbeat_until_done(self, task_id: str) -> None:
        while True:
            await asyncio.sleep(self.heartbeat_interval_seconds)
            task = await self.task_service.heartbeat(task_id)
            if not task or task.get("status") != "processing":
                return

    def _write_docx(self, output_path: str, data: memoryview) -> None:
        with open(output_path, "wb") as file:
            file.write(data)

    def _stored_output_path(self, output_path: str) -> str:
        try:
            return os.path.relpath(output_path, self.base_dir)
        except ValueError:
            return output_path
