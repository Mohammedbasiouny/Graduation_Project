from pydantic_settings import BaseSettings
from pydantic import Field, computed_field
from typing import List


class Settings(BaseSettings):
    APP_HOST: str = Field(default="0.0.0.0")
    APP_PORT: int = Field(default=8001)

    DATABASE_URL: str = Field(...)

    ALLOWED_ORIGINS: str = Field(default="http://localhost:3030")

    @computed_field
    @property
    def ALLOWED_ORIGINS_LIST(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    INSIGHTFACE_MODEL_PACK: str = Field(default="buffalo_l")
    INSIGHTFACE_CTX_ID: int = Field(default=-1) 

    DETECTION_THRESHOLD: float = Field(default=0.5)
    MAX_FACES_PER_FRAME: int = Field(default=5)

    RECOGNITION_THRESHOLD: float = Field(default=0.3)

    EXPECTED_ASPECT_RATIO_W: int = Field(default=4)
    EXPECTED_ASPECT_RATIO_H: int = Field(default=6)
    ASPECT_RATIO_TOLERANCE: float = Field(default=0.05)
    MIN_BACKGROUND_BRIGHTNESS: int = Field(default=180)

    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    REDIS_QUEUE_KEY: str = Field(default="attendance_queue")
    REDIS_LOGGED_KEY_PREFIX: str = Field(default="logged")

    CONSUMER_BATCH_SIZE: int = Field(default=50)
    CONSUMER_BATCH_WINDOW_MS: int = Field(default=1000)
    
    NESTJS_SERVICE_URL: str = Field(default="http://localhost:3000")
    INTERNAL_API_KEY:   str = Field(...)

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()