"""
Schemas: Equipos
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class CriticidadEnum(str, Enum):
    CRITICA = "A"
    MEDIA = "B"
    BAJA = "C"

class PlantaEnum(str, Enum):
    TREN_1 = "TREN_1"
    TREN_2 = "TREN_2"

class EquipoBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=150)
    planta: PlantaEnum = PlantaEnum.TREN_1
    componente: Optional[str] = None
    criticidad: CriticidadEnum = CriticidadEnum.BAJA
    ubicacion: Optional[str] = None
    modelo_rodamiento: Optional[str] = None
    tipo_lubricante: Optional[str] = None
    cantidad_gramos: Optional[float] = None
    frecuencia_dias: int = Field(30, ge=1)

class EquipoCreate(EquipoBase):
    pass

class EquipoUpdate(BaseModel):
    nombre: Optional[str] = None
    planta: Optional[PlantaEnum] = None
    componente: Optional[str] = None
    criticidad: Optional[CriticidadEnum] = None
    ubicacion: Optional[str] = None
    modelo_rodamiento: Optional[str] = None
    tipo_lubricante: Optional[str] = None
    cantidad_gramos: Optional[float] = None
    frecuencia_dias: Optional[int] = None
    estado: Optional[str] = None

class EquipoResponse(EquipoBase):
    id: int
    estado: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True