"""
Schemas: Historial de Lubricación
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class HistorialBase(BaseModel):
    plan_id: int
    cantidad_aplicada: float = Field(..., gt=0)
    tecnico: str = Field(..., min_length=1, max_length=100)

class HistorialCreate(HistorialBase):
    observaciones: Optional[str] = None
    fecha_ejecucion: Optional[datetime] = None

class HistorialResponse(HistorialBase):
    id: int
    fecha_ejecucion: datetime
    observaciones: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True