from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Zariva Property Management API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "postgresql://zariva:zariva_password@localhost:5432/zariva_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS — comma-separated string, e.g. "https://app.vercel.app,http://localhost:3000"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
