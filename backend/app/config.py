import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AICTE Curriculum Intelligence & Standardization Portal (CISP)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "aicte_cisp_national_secret_key_2026_super_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # DB settings (PostgreSQL supported, SQLite fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cisp.db")
    
    # Dynamic storage location (use /tmp on Vercel / serverless)
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    STORAGE_DIR: str = "/tmp/storage" if (os.getenv("VERCEL") or not os.access(BASE_DIR, os.W_OK)) else os.path.join(BASE_DIR, "storage")
    UPLOAD_DIR: str = os.path.join(STORAGE_DIR, "uploads")
    EXTRACTED_DIR: str = os.path.join(STORAGE_DIR, "extracted")
    REPORTS_DIR: str = os.path.join(STORAGE_DIR, "reports")
    
    # Scoring weights defaults
    DEFAULT_WEIGHT_SUBJECT: float = 0.25
    DEFAULT_WEIGHT_TOPIC: float = 0.25
    DEFAULT_WEIGHT_CREDIT: float = 0.15
    DEFAULT_WEIGHT_PRACTICAL: float = 0.15
    DEFAULT_WEIGHT_CO: float = 0.10
    DEFAULT_WEIGHT_EMERGING_TECH: float = 0.10

    class Config:
        case_sensitive = True

settings = Settings()

try:
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.EXTRACTED_DIR, exist_ok=True)
    os.makedirs(settings.REPORTS_DIR, exist_ok=True)
except Exception:
    pass
