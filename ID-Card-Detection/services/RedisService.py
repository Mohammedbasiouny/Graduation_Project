from typing import AsyncIterator

from redis.asyncio import Redis

class RedisService:
    def __init__(self, redis_url: str, health_check_interval: int = 30) -> None:
        self.redis_url = redis_url
        self.health_check_interval = health_check_interval
        self._client: Redis | None = None

    async def connect(self) -> None:
        if self._client is None:
            self._client = Redis.from_url(
                self.redis_url,
                decode_responses=True,
                health_check_interval=self.health_check_interval,
            )
        await self._client.ping()

    @property
    def client(self) -> Redis:
        if self._client is None:
            raise RuntimeError("Redis client is not connected")
        return self._client

    async def publish_json(self, channel: str, payload: str) -> None:
        await self.client.publish(channel, payload)

    async def scan_keys(self, pattern: str) -> AsyncIterator[str]:
        async for key in self.client.scan_iter(match=pattern):
            yield key

    async def close(self) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None
