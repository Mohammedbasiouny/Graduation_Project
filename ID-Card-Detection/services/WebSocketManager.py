import asyncio
import json
from typing import Any

from fastapi import WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState

from services.TaskService import TaskService
from utils.setup_logger_utils import setup_logger


logger = setup_logger("websocket_manager_logger", "websocket_manager.log", console=True)


class WebSocketManager:
    def __init__(self, task_service: TaskService, pubsub_timeout_seconds: float = 1.0) -> None:
        self.task_service = task_service
        self.pubsub_timeout_seconds = pubsub_timeout_seconds

    async def stream_task(self, websocket: WebSocket, task_id: str) -> None:
        disconnect_event = asyncio.Event()
        receiver_task: asyncio.Task | None = None
        pubsub = None
        channel = self.task_service.task_channel(task_id)
        subscribed = False

        try:
            await websocket.accept()
            logger.info(f"WebSocket connected for task {task_id}")

            task = await self.task_service.get_task(task_id)
            if not task:
                await self._safe_send_json(
                    websocket,
                    {"type": "error", "detail": "Task not found"},
                    task_id,
                )
                return

            if not await self._safe_send_json(websocket, task, task_id):
                return

            pubsub = self.task_service.redis.client.pubsub()
            await pubsub.subscribe(channel)
            subscribed = True
            logger.info(f"WebSocket subscribed to Redis channel {channel}")

            receiver_task = asyncio.create_task(
                self._watch_disconnect(websocket, task_id, disconnect_event)
            )

            while not disconnect_event.is_set():
                message = await pubsub.get_message(
                    ignore_subscribe_messages=True,
                    timeout=self.pubsub_timeout_seconds,
                )
                if disconnect_event.is_set():
                    break

                if message and message.get("type") == "message":
                    data = message.get("data")
                    try:
                        payload = json.loads(data)
                    except (TypeError, json.JSONDecodeError):
                        logger.warning(f"Invalid Pub/Sub payload for task {task_id}")
                        continue

                    if not await self._safe_send_json(websocket, payload, task_id):
                        disconnect_event.set()
                        break

                await asyncio.sleep(0)

        except WebSocketDisconnect:
            logger.info(f"WebSocket disconnected for task {task_id}")
        except RuntimeError as exc:
            logger.warning(f"WebSocket runtime error for task {task_id}: {exc}")
        except Exception as exc:
            logger.error(f"WebSocket stream failed for task {task_id}: {exc}")
        finally:
            disconnect_event.set()

            if receiver_task and not receiver_task.done():
                receiver_task.cancel()
                try:
                    await receiver_task
                except asyncio.CancelledError:
                    pass

            if pubsub is not None:
                if subscribed:
                    try:
                        await pubsub.unsubscribe(channel)
                        logger.info(f"WebSocket unsubscribed from Redis channel {channel}")
                    except Exception as exc:
                        logger.warning(f"Could not unsubscribe Redis channel {channel}: {exc}")
                try:
                    await pubsub.aclose()
                    logger.info(f"WebSocket Pub/Sub closed for task {task_id}")
                except Exception as exc:
                    logger.warning(f"Could not close Pub/Sub for task {task_id}: {exc}")

            await self._safe_close(websocket, task_id)

    async def _watch_disconnect(
        self,
        websocket: WebSocket,
        task_id: str,
        disconnect_event: asyncio.Event,
    ) -> None:
        try:
            while not disconnect_event.is_set():
                await websocket.receive_text()
        except WebSocketDisconnect:
            logger.info(f"WebSocket client disconnected for task {task_id}")
        except RuntimeError as exc:
            logger.info(f"WebSocket receive stopped for task {task_id}: {exc}")
        except Exception as exc:
            logger.warning(f"WebSocket receive error for task {task_id}: {exc}")
        finally:
            disconnect_event.set()

    async def _safe_send_json(self, websocket: WebSocket, payload: Any, task_id: str) -> bool:
        if (
            websocket.application_state != WebSocketState.CONNECTED
            or websocket.client_state != WebSocketState.CONNECTED
        ):
            logger.info(f"Skipping WebSocket send for task {task_id}; socket is not connected")
            return False

        try:
            await websocket.send_json(payload)
            return True
        except WebSocketDisconnect:
            logger.info(f"WebSocket disconnected while sending task {task_id}")
        except RuntimeError as exc:
            logger.warning(f"WebSocket send failed for task {task_id}: {exc}")
        except Exception as exc:
            logger.error(f"Unexpected WebSocket send error for task {task_id}: {exc}")
        return False

    async def _safe_close(self, websocket: WebSocket, task_id: str) -> None:
        if (
            websocket.application_state != WebSocketState.CONNECTED
            or websocket.client_state != WebSocketState.CONNECTED
        ):
            logger.info(f"WebSocket cleanup complete for task {task_id}; socket already closed")
            return

        try:
            await websocket.close()
            logger.info(f"WebSocket closed for task {task_id}")
        except RuntimeError:
            logger.info(f"WebSocket already closed for task {task_id}")
        except Exception as exc:
            logger.warning(f"Could not close WebSocket for task {task_id}: {exc}")
