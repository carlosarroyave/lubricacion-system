"""
Configuración central de la aplicación
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database - Variables separadas para mejor compatibilidad en Render
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "5432"))
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "password")
    DB_NAME: str = os.getenv("DB_NAME", "postgres")
    
    @property
    def DATABASE_URL(self) -> str:
        """Construye la URL de conexión a partir de variables separadas"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?sslmode=require"
    
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
