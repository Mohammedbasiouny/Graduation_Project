import logging
import os

def setup_logger(
    name: str,
    log_file: str,
    level=logging.INFO,
    console: bool = False  # <-- Add this parameter to enable console logging
) -> logging.Logger:
    # Ensure logs folder exists
    logs_dir = os.getenv("LOGS_DIR", "logs")
    os.makedirs(logs_dir, exist_ok=True)

    # Full path to the log file
    log_file_path = os.path.join(logs_dir, log_file)

    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Avoid adding multiple handlers if logger already has them
    if not logger.handlers:
        # File handler
        file_handler = logging.FileHandler(log_file_path)
        file_formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s - %(message)s")
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)

        # Optional console handler
        if console:
            stream_handler = logging.StreamHandler()
            stream_formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s - %(message)s")
            stream_handler.setFormatter(stream_formatter)
            logger.addHandler(stream_handler)

    return logger
