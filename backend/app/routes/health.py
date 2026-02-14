"""
Rutas: Health Check
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from datetime import datetime

router = APIRouter(
    prefix="/api/health",
    tags=["health"],
)

@router.get("")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        # Verificar conexión a BD
        db.execute("SELECT 1")
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "disconnected",
            "error": str(e)
        }
