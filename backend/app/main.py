"""
Aplicación principal FastAPI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.database import init_db
from app.routes import health

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Eventos de inicio y cierre
@app.on_event("startup")
async def startup_event():
    """Inicializar base de datos al iniciar"""
    logger.info("Inicializando aplicación...")
    try:
        init_db()
        logger.info("Base de datos inicializada correctamente")
    except Exception as e:
        logger.error(f"Error al inicializar base de datos: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Evento de cierre"""
    logger.info("Cerrando aplicación...")

# Incluir routers
app.include_router(health.router)
try:
    from app.routes import equipos, lubricacion
    app.include_router(equipos.router)
    app.include_router(lubricacion.router)
except Exception as e:
    logger.error("Error cargando rutas de equipos/lubricacion", exc_info=True)

# Root endpoint
@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "Gestión de Lubricación API",
        "version": settings.API_VERSION,
        "docs": "/api/docs"
    }

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Error no manejado: {str(exc)}")
    return {
        "error": "Error interno del servidor",
        "detail": str(exc)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
