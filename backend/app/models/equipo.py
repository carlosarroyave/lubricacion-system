"""
Modelo: Equipos
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from backend.app.core.database import Base

class CriticidadEnum(str, enum.Enum):
    CRITICA = "A"
    MEDIA = "B"
    BAJA = "C"

class EstadoEnum(str, enum.Enum):
    ACTIVO = "ACTIVO"
    INACTIVO = "INACTIVO"
    MANTENIMIENTO = "MANTENIMIENTO"

class Equipo(Base):
    __tablename__ = "equipos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), unique=True, nullable=False, index=True)
    componente = Column(String(150), nullable=True)
    criticidad = Column(Enum(CriticidadEnum), default=CriticidadEnum.BAJA, nullable=False)
    ubicacion = Column(String(200), nullable=True)
    modelo_rodamiento = Column(String(100), nullable=True)
    tipo_lubricante = Column(String(100), nullable=True)
    cantidad_gramos = Column(Float, nullable=True)
    frecuencia_dias = Column(Integer, default=30, nullable=False)
    estado = Column(Enum(EstadoEnum), default=EstadoEnum.ACTIVO, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relaciones
    planes = relationship("PlanLubricacion", back_populates="equipo", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Equipo {self.nombre}>"
