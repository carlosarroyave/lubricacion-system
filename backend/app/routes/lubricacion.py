"""
Rutas: Lubricación
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from backend.app.core.database import get_db
from backend.app.services.lubricacion_service import LubricacionService
from backend.app.schemas.historial import HistorialCreate, HistorialResponse

router = APIRouter(
    prefix="/api/lubricacion",
    tags=["lubricacion"],
    responses={404: {"description": "No encontrado"}}
)

@router.get("/planes/todos")
def obtener_todos_los_planes(
    planta: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    """Obtener todos los planes de lubricación (para ejecución manual)"""
    planes = LubricacionService.obtener_todos_planes(db, planta=planta)
    
    resultado = []
    for plan in planes:
        dias_restantes = (plan.proxima_fecha_lubricacion - datetime.utcnow()).days
        nombre = plan.equipo.nombre
        if search and search.lower() not in nombre.lower():
            continue
        resultado.append({
            "id": plan.id,
            "equipo_id": plan.equipo_id,
            "equipo_nombre": nombre,
            "equipo_planta": plan.equipo.planta,
            "criticidad": plan.equipo.criticidad,
            "tipo_lubricante": plan.tipo_lubricante,
            "cantidad_gramos": plan.cantidad_gramos,
            "frecuencia_dias": plan.frecuencia_dias,
            "proxima_fecha": plan.proxima_fecha_lubricacion,
            "ultima_fecha": plan.ultima_fecha_lubricacion,
            "dias_restantes": dias_restantes,
            "estado": "🔴 VENCIDO" if dias_restantes < 0 else "🟡 HOY/MAÑANA" if dias_restantes <= 1 else "🟢 AL DÍA"
        })
    
    return sorted(resultado, key=lambda x: x["equipo_nombre"])

@router.get("/planes/proximos")
def obtener_planes_proximos(
    dias: int = Query(7, ge=1, le=30),
    planta: str = Query(None),
    db: Session = Depends(get_db)
):
    """Obtener planes próximos a vencer"""
    planes = LubricacionService.obtener_planes_proximos(db, dias=dias, planta=planta)
    
    resultado = []
    for plan in planes:
        dias_restantes = (plan.proxima_fecha_lubricacion - datetime.utcnow()).days
        resultado.append({
            "id": plan.id,
            "equipo_id": plan.equipo_id,
            "equipo_nombre": plan.equipo.nombre,
            "equipo_planta": plan.equipo.planta,
            "criticidad": plan.equipo.criticidad,
            "tipo_lubricante": plan.tipo_lubricante,
            "cantidad_gramos": plan.cantidad_gramos,
            "proxima_fecha": plan.proxima_fecha_lubricacion,
            "dias_restantes": dias_restantes,
            "estado": "🔴 VENCIDO" if dias_restantes < 0 else "🟡 HOY/MAÑANA" if dias_restantes <= 1 else "🟢 PRÓXIMOS"
        })
    
    return sorted(resultado, key=lambda x: x["proxima_fecha"])

@router.post("/ejecutar/{plan_id}", response_model=HistorialResponse)
def ejecutar_lubricacion(
    plan_id: int,
    ejecucion: HistorialCreate,
    db: Session = Depends(get_db)
):
    """Registrar ejecución de lubricación"""
    try:
        ejecucion.plan_id = plan_id
        return LubricacionService.registrar_ejecucion(db, ejecucion)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/historial")
def obtener_historial(
    plan_id: int = Query(None),
    planta: str = Query(None),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener historial de lubricaciones"""
    historial = LubricacionService.obtener_historial(db, plan_id=plan_id, planta=planta, limit=limit)
    return historial

@router.get("/calcular-skf")
def calcular_skf(
    diametro_mm: float = Query(..., gt=0),
    ancho_mm: float = Query(..., gt=0)
):
    """Calcular cantidad de grasa según fórmula SKF"""
    cantidad = LubricacionService.calcular_cantidad_skf(diametro_mm, ancho_mm)
    return {
        "diametro_mm": diametro_mm,
        "ancho_mm": ancho_mm,
        "cantidad_gramos": round(cantidad, 2),
        "formula": "G = 0.005 × D × B"
    }