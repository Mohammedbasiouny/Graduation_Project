import asyncio

from services.TaskService import STALE_TASK_ERROR, TaskService
from utils.setup_logger_utils import setup_logger


logger = setup_logger("stale_task_monitor_logger", "stale_task_monitor.log", console=True)


class StaleTaskMonitorService:
    def __init__(
        self,
        *,
        task_service: TaskService,
        stale_timeout_seconds: int = 60,
        interval_seconds: int = 60,
    ) -> None:
        self.task_service = task_service
        self.stale_timeout_seconds = stale_timeout_seconds
        self.interval_seconds = interval_seconds
        self._stop_event = asyncio.Event()

    async def run_forever(self) -> None:
        logger.info(
            "Stale task monitor started. interval=%ss timeout=%ss",
            self.interval_seconds,
            self.stale_timeout_seconds,
        )
        indexed = await self.task_service.rebuild_processing_index()
        logger.info(f"Rebuilt processing task index with {indexed} active task(s)")

        while not self._stop_event.is_set():
            try:
                await self.check_once()
            except Exception as exc:
                logger.error(f"Stale task monitor check failed: {exc}")

            try:
                await asyncio.wait_for(self._stop_event.wait(), timeout=self.interval_seconds)
            except asyncio.TimeoutError:
                continue

    def stop(self) -> None:
        self._stop_event.set()

    async def check_once(self) -> int:
        recovered = 0
        task_ids = await self.task_service.get_processing_task_ids()

        for task_id in task_ids:
            task = await self.task_service.mark_stale_failed(
                task_id,
                stale_timeout_seconds=self.stale_timeout_seconds,
                error=STALE_TASK_ERROR,
            )
            if task and task.get("status") == "failed" and task.get("error") == STALE_TASK_ERROR:
                recovered += 1
                logger.warning(f"Marked stale task as failed: {task_id}")

        return recovered
