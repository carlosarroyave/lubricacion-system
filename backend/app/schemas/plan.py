"""
Schemas: Planes de Lubricación
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PlanBase(BaseModel):
    equipo_id: int
    tipo_lubricante: Optional[str] = None
    cantidad_gramos: Optional[float] = None
    frecuencia_dias: int = Field(30, ge=1)

class PlanCreate(PlanBase):
    proxima_fecha_lubricacion: datetime

class PlanUpdate(BaseModel):
    tipo_lubricante: Optional[str] = None
    cantidad_gramos: Optional[float] = None
    frecuencia_dias: Optional[int] = None
    proxima_fecha_lubricacion: Optional[datetime] = None

class PlanResponse(PlanBase):
    id: int
    ultima_fecha_lubricacion: datetime
    proxima_fecha_lubricacion: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True