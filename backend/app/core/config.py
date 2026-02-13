"""
Configuración central de la aplicación
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database - USA CONNECTION_STRING de Supabase (IPv4 compatible)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://user:password@localhost:5432/postgres"
    )
    
    # API
    API_TITLE: str = "Gestión de Lubricación API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Sistema profesional de gestión de lubricación industrial"
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:8501",
        "http://localhost:8000",
        "http://127.0.0.1:8501",
        "http://127.0.0.1:8000",
        "https://*.streamlit.app",  # Streamlit Cloud
        "https://streamlit.app",
    ]
    
    # JWT
    ALGORITHM: str = "HS256"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
