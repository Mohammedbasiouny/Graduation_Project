import sys
from loguru import logger

logger.remove()

logger.add(
    sys.stdout,
    level     = "INFO",
    colorize  = True,
    format    = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    ),
)

logger.add(
    "logs/system.log",
    level     = "DEBUG",
    rotation  = "00:00",
    retention = "7 days",
    compression = "zip",
    format    = (
        "{time:YYYY-MM-DD HH:mm:ss} | "
        "{level: <8} | "
        "{name}:{line} | "
        "{message}"
    ),
    enqueue   = True,
)