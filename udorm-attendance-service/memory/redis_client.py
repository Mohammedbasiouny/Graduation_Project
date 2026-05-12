import redis
from utils.logger import logger
from config.settings import settings

def create_redis_client() -> redis.Redis:
    client = redis.from_url(
        settings.REDIS_URL,
        decode_responses=True,   
        socket_timeout=5,        
        socket_connect_timeout=5,
        retry_on_timeout=True,
    )

    try:
        client.ping()
        logger.info(f"Redis connected: {settings.REDIS_URL}")
    except redis.ConnectionError as e:
        logger.critical(f"Cannot connect to Redis at {settings.REDIS_URL}: {e}")
        raise

    return client


redis_client: redis.Redis = create_redis_client()