import asyncio
import shutil
import time
from pathlib import Path

from services.TaskService import ACTIVE_STATUSES, TaskService
from utils.setup_logger_utils import setup_logger


logger = setup_logger("cleanup_service_logger", "cleanup_service.log", console=True)


class CleanupService:
    def __init__(
        self,
        *,
        outputs_dir: str,
        base_dir: str,
        task_service: TaskService,
        retention_days: int = 7,
        interval_seconds: int = 3600,
    ) -> None:
        self.outputs_dir = Path(outputs_dir)
        self.base_dir = Path(base_dir)
        self.task_service = task_service
        self.retention_seconds = retention_days * 24 * 60 * 60
        self.interval_seconds = interval_seconds
        self._stop_event = asyncio.Event()

    async def run_forever(self) -> None:
        self.outputs_dir.mkdir(parents=True, exist_ok=True)
        while not self._stop_event.is_set():
            try:
                await self.cleanup_once()
            except Exception as exc:
                logger.error(f"Output cleanup failed: {exc}")

            try:
                await asyncio.wait_for(self._stop_event.wait(), timeout=self.interval_seconds)
            except asyncio.TimeoutError:
                continue

    def stop(self) -> None:
        self._stop_event.set()

    async def reset_outputs(self) -> int:
        deleted = 0
        self.outputs_dir.mkdir(parents=True, exist_ok=True)

        for path in list(self.outputs_dir.iterdir()):
            try:
                if path.is_dir():
                    await asyncio.to_thread(shutil.rmtree, path)
                    deleted += 1
                else:
                    await asyncio.to_thread(path.unlink)
                    deleted += 1
            except FileNotFoundError:
                continue
            except OSError as exc:
                logger.warning(f"Could not delete output path {path}: {exc}")

        self.outputs_dir.mkdir(parents=True, exist_ok=True)
        return deleted

    async def cleanup_once(self) -> None:
        now = time.time()
        active_paths = await self._active_output_paths()

        for path in self.outputs_dir.iterdir():
            if not path.is_file():
                continue

            try:
                resolved_path = str(path.resolve())
                if resolved_path in active_paths:
                    continue

                stat = path.stat()
                age_seconds = now - stat.st_mtime
                if age_seconds <= self.retention_seconds:
                    continue

                await asyncio.to_thread(path.unlink)
                logger.info(f"Deleted expired output file: {path}")
            except FileNotFoundError:
                continue
            except OSError as exc:
                logger.warning(f"Could not delete output file {path}: {exc}")

    async def _active_output_paths(self) -> set[str]:
        active_paths: set[str] = set()
        tasks = await self.task_service.get_all_tasks()
        for task in tasks.values():
            if task.get("status") not in ACTIVE_STATUSES:
                continue

            output_path = task.get("output_path")
            if not output_path:
                continue

            path = Path(str(output_path))
            if not path.is_absolute():
                path = self.base_dir / path
            try:
                active_paths.add(str(path.resolve()))
            except OSError:
                continue
        return active_paths
