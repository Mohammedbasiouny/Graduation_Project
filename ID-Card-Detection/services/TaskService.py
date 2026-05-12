import json
from datetime import datetime, timezone
from typing import Any

from redis.exceptions import WatchError

from services.RedisService import RedisService


TERMINAL_STATUSES = {"finished", "failed", "cancelled"}
ACTIVE_STATUSES = {"queued", "processing"}
PROCESSING_TASKS_SET = "tasks:processing"
STALE_TASK_ERROR = "Worker crashed or heartbeat timeout"


class TaskService:
    def __init__(self, redis_service: RedisService, task_ttl_seconds: int | None = None) -> None:
        self.redis = redis_service
        self.task_ttl_seconds = task_ttl_seconds

    def _task_key(self, task_id: str) -> str:
        return f"task:{task_id}"

    @property
    def processing_tasks_key(self) -> str:
        return PROCESSING_TASKS_SET

    def task_channel(self, task_id: str) -> str:
        return f"task_updates:{task_id}"

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    async def create_task(self, task_id: str) -> dict[str, Any]:
        now = self._now_iso()
        task = {
            "id": task_id,
            "status": "queued",
            "progress": 0,
            "message": "Task queued",
            "created_at": now,
            "updated_at": now,
            "last_heartbeat": None,
            "output_path": None,
            "error": None,
        }
        return await self._save_and_publish(task)

    async def get_task(self, task_id: str) -> dict[str, Any] | None:
        raw = await self.redis.client.get(self._task_key(task_id))
        if not raw:
            return None

        try:
            task = json.loads(raw)
        except json.JSONDecodeError:
            return None

        return task if isinstance(task, dict) else None

    async def get_all_tasks(self) -> dict[str, dict[str, Any]]:
        tasks: dict[str, dict[str, Any]] = {}
        async for key in self.redis.scan_keys("task:*"):
            raw = await self.redis.client.get(key)
            if not raw:
                continue
            try:
                task = json.loads(raw)
            except json.JSONDecodeError:
                continue
            if isinstance(task, dict) and task.get("id"):
                tasks[str(task["id"])] = task
        return tasks

    async def update_task(
        self,
        task_id: str,
        *,
        status: str | None = None,
        progress: int | None = None,
        message: str | None = None,
        output_path: str | None = None,
        error: str | None = None,
    ) -> dict[str, Any]:
        now = self._now_iso()
        task = await self.get_task(task_id)
        if not task:
            return {
                "id": task_id,
                "status": "missing",
                "progress": 100,
                "message": "Task no longer exists",
                "created_at": now,
                "updated_at": now,
                "last_heartbeat": None,
                "output_path": None,
                "error": "Task no longer exists",
            }

        current_status = task.get("status")
        if current_status in TERMINAL_STATUSES:
            return task

        if status is not None:
            task["status"] = status
        if progress is not None:
            task["progress"] = max(0, min(100, int(progress)))
        if message is not None:
            task["message"] = message
        if output_path is not None:
            task["output_path"] = output_path
        if error is not None:
            task["error"] = error
        elif status not in {"failed"}:
            task["error"] = None

        task["updated_at"] = now
        if task.get("status") == "processing":
            task["last_heartbeat"] = now
        return await self._save_and_publish(task)

    async def mark_processing(self, task_id: str, message: str = "Processing started") -> dict[str, Any]:
        return await self.update_task(task_id, status="processing", progress=1, message=message)

    async def heartbeat(self, task_id: str) -> dict[str, Any] | None:
        now = self._now_iso()
        task = await self.get_task(task_id)
        if not task or task.get("status") != "processing":
            return task

        task["last_heartbeat"] = now
        task["updated_at"] = now
        return await self._save_and_publish(task)

    async def mark_finished(self, task_id: str, output_path: str) -> dict[str, Any]:
        return await self.update_task(
            task_id,
            status="finished",
            progress=100,
            message="Task finished",
            output_path=output_path,
            error=None,
        )

    async def mark_failed(self, task_id: str, error: str) -> dict[str, Any]:
        return await self.update_task(
            task_id,
            status="failed",
            progress=100,
            message="Task failed",
            error=error,
        )

    async def mark_cancelled(self, task_id: str, reason: str) -> dict[str, Any]:
        return await self.update_task(
            task_id,
            status="cancelled",
            progress=100,
            message="Task cancelled",
            error=reason,
        )

    async def cancel_active_tasks(self, reason: str) -> int:
        cancelled = 0
        tasks = await self.get_all_tasks()
        for task in tasks.values():
            if task.get("status") not in ACTIVE_STATUSES:
                continue
            task_id = str(task["id"])
            updated = await self.mark_cancelled(task_id, reason)
            if updated.get("status") == "cancelled":
                cancelled += 1
        return cancelled

    async def get_processing_task_ids(self) -> list[str]:
        task_ids = await self.redis.client.smembers(self.processing_tasks_key)
        return [str(task_id) for task_id in task_ids]

    async def rebuild_processing_index(self) -> int:
        indexed = 0
        async for key in self.redis.scan_keys("task:*"):
            raw = await self.redis.client.get(key)
            if not raw:
                continue
            try:
                task = json.loads(raw)
            except json.JSONDecodeError:
                continue
            if not isinstance(task, dict) or not task.get("id"):
                continue
            task_id = str(task["id"])
            if task.get("status") == "processing":
                await self.redis.client.sadd(self.processing_tasks_key, task_id)
                indexed += 1
            else:
                await self.redis.client.srem(self.processing_tasks_key, task_id)
        return indexed

    async def clear_runtime_state(self, queue_names: list[str]) -> int:
        keys_to_delete: list[str] = [self.processing_tasks_key, *queue_names]
        async for key in self.redis.scan_keys("task:*"):
            keys_to_delete.append(key)

        deleted = 0
        for index in range(0, len(keys_to_delete), 500):
            chunk = keys_to_delete[index:index + 500]
            if chunk:
                deleted += await self.redis.client.delete(*chunk)
        return deleted

    async def mark_stale_failed(
        self,
        task_id: str,
        *,
        stale_timeout_seconds: int,
        error: str = STALE_TASK_ERROR,
    ) -> dict[str, Any] | None:
        key = self._task_key(task_id)

        async with self.redis.client.pipeline(transaction=True) as pipe:
            while True:
                try:
                    await pipe.watch(key)
                    raw = await pipe.get(key)
                    if not raw:
                        await pipe.unwatch()
                        await self.redis.client.srem(self.processing_tasks_key, task_id)
                        return None

                    task = json.loads(raw)
                    if not isinstance(task, dict) or task.get("status") != "processing":
                        await pipe.unwatch()
                        await self.redis.client.srem(self.processing_tasks_key, task_id)
                        return task if isinstance(task, dict) else None

                    last_heartbeat = self._parse_iso(task.get("last_heartbeat"))
                    if last_heartbeat is None:
                        last_heartbeat = self._parse_iso(task.get("updated_at"))

                    now_dt = datetime.now(timezone.utc)
                    if last_heartbeat is not None:
                        age_seconds = (now_dt - last_heartbeat).total_seconds()
                        if age_seconds <= stale_timeout_seconds:
                            await pipe.unwatch()
                            return task

                    now = now_dt.isoformat()
                    task["status"] = "failed"
                    task["progress"] = 100
                    task["message"] = "Task failed"
                    task["error"] = error
                    task["updated_at"] = now

                    payload = json.dumps(task, ensure_ascii=False)
                    pipe.multi()
                    if self.task_ttl_seconds:
                        pipe.set(key, payload, ex=self.task_ttl_seconds)
                    else:
                        pipe.set(key, payload)
                    pipe.srem(self.processing_tasks_key, task_id)
                    pipe.publish(self.task_channel(task_id), payload)
                    await pipe.execute()
                    return task

                except json.JSONDecodeError:
                    await pipe.unwatch()
                    await self.redis.client.srem(self.processing_tasks_key, task_id)
                    return None
                except WatchError:
                    continue

    async def _save_and_publish(self, task: dict[str, Any]) -> dict[str, Any]:
        payload = json.dumps(task, ensure_ascii=False)
        key = self._task_key(str(task["id"]))
        saved_payload = await self.redis.client.eval(
            """
            local current = redis.call("GET", KEYS[1])
            local incoming = cjson.decode(ARGV[1])

            if current then
                local existing = cjson.decode(current)
                if existing["status"] == "finished"
                    or existing["status"] == "failed"
                    or existing["status"] == "cancelled" then
                    return current
                end
            end

            if tonumber(ARGV[3]) and tonumber(ARGV[3]) > 0 then
                redis.call("SET", KEYS[1], ARGV[1], "EX", tonumber(ARGV[3]))
            else
                redis.call("SET", KEYS[1], ARGV[1])
            end

            if incoming["status"] == "processing" then
                redis.call("SADD", KEYS[2], ARGV[2])
            else
                redis.call("SREM", KEYS[2], ARGV[2])
            end

            redis.call("PUBLISH", KEYS[3], ARGV[1])
            return ARGV[1]
            """,
            3,
            key,
            self.processing_tasks_key,
            self.task_channel(str(task["id"])),
            payload,
            str(task["id"]),
            str(self.task_ttl_seconds or 0),
        )
        try:
            saved_task = json.loads(saved_payload)
        except (TypeError, json.JSONDecodeError):
            return task
        return saved_task if isinstance(saved_task, dict) else task

    def _parse_iso(self, value: Any) -> datetime | None:
        if not isinstance(value, str) or not value:
            return None
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
