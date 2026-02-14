"""
Rutas: Equipos
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.equipo_service import EquipoService
from backend.app.schemas.equipo import EquipoCreate, EquipoUpdate, EquipoResponse

router = APIRouter(
    prefix="/api/equipos",
    tags=["equipos"],
    responses={404: {"description": "No encontrado"}}
)

@router.get("", response_model=list[EquipoResponse])
def listar_equipos(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Listar todos los equipos activos"""
    equipos = EquipoService.obtener_equipos(db, skip=skip, limit=limit)
    return equipos

@router.get("/{equipo_id}", response_model=EquipoResponse)
def obtener_equipo(equipo_id: int, db: Session = Depends(get_db)):
    """Obtener equipo por ID"""
    equipo = EquipoService.obtener_equipo_por_id(db, equipo_id)
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return equipo

@router.post("", response_model=EquipoResponse, status_code=201)
def crear_equipo(equipo: EquipoCreate, db: Session = Depends(get_db)):
    """Crear nuevo equipo"""
    try:
        return EquipoService.crear_equipo(db, equipo)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{equipo_id}", response_model=EquipoResponse)
def actualizar_equipo(
    equipo_id: int,
    equipo: EquipoUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar equipo"""
    resultado = EquipoService.actualizar_equipo(db, equipo_id, equipo)
    if not resultado:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return resultado

@router.delete("/{equipo_id}")
def eliminar_equipo(equipo_id: int, db: Session = Depends(get_db)):
    """Eliminar (desactivar) equipo"""
    if not EquipoService.eliminar_equipo(db, equipo_id):
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return {"message": "Equipo desactivado"}

@router.get("/{equipo_id}/historial")
def obtener_historial_equipo(equipo_id: int, db: Session = Depends(get_db)):
    """Obtener historial de lubricación de un equipo"""
    equipo = EquipoService.obtener_equipo_por_id(db, equipo_id)
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    from backend.app.services.lubricacion_service import LubricacionService
    historial = LubricacionService.obtener_historial(db, limit=100)
    
    # Filtrar por equipos del plan
    equipo_historial = [h for h in historial if h.plan.equipo_id == equipo_id]
    return equipo_historial