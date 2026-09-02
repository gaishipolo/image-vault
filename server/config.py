"""Application configuration loaded from environment variables (.env)."""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

# 确保从 config.py 所在目录加载 .env
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)


class Config:
    """Base configuration."""

    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")

    # 请求体大小限制 (50MB)
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024

    # SQLAlchemy / MySQL
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URI",
        "mysql+pymysql://root:password@localhost:3306/image_vault?charset=utf8mb4",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_recycle": 280,
        "pool_pre_ping": True,
    }

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600"))
    )
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")

    # Rate-limiting
    RATELIMIT_DEFAULT = os.getenv("RATELIMIT_DEFAULT", "200/hour")
    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")


class DevelopmentConfig(Config):
    """Development overrides."""

    DEBUG = True


class ProductionConfig(Config):
    """Production overrides."""

    DEBUG = False

    def __init__(self):
        super().__init__()
        if self.SECRET_KEY.startswith("change-me"):
            raise RuntimeError("SECRET_KEY must be set in production!")
        if self.JWT_SECRET_KEY.startswith("change-me"):
            raise RuntimeError("JWT_SECRET_KEY must be set in production!")


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
