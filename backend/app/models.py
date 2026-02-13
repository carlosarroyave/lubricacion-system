"""
Modelos de la aplicación
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

# ==================== ENUMS ====================
class CriticidadEnum(str, enum.Enum):
    CRITICA = "A"
    MEDIA = "B"
    BAJA = "C"

class EstadoEnum(str, enum.Enum):
    ACTIVO = "ACTIVO"
    INACTIVO = "INACTIVO"
    MANTENIMIENTO = "MANTENIMIENTO"

# ==================== MODELO: EQUIPO ====================
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
    
    planes = relationship("PlanLubricacion", back_populates="equipo", cascade="all, delete-orphan")

# ==================== MODELO: PLAN ====================
class PlanLubricacion(Base):
    __tablename__ = "planes_lubricacion"
    
    id = Column(Integer, primary_key=True, index=True)
    equipo_id = Column(Integer, ForeignKey("equipos.id", ondelete="CASCADE"), nullable=False, index=True)
    tipo_lubricante = Column(String(100), nullable=True)
    cantidad_gramos = Column(Float, nullable=True)
    frecuencia_dias = Column(Integer, default=30, nullable=False)
    ultima_fecha_lubricacion = Column(DateTime, default=datetime.utcnow, nullable=False)
    proxima_fecha_lubricacion = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    equipo = relationship("Equipo", back_populates="planes")
    historial = relationship("Historial", back_populates="plan", cascade="all, delete-orphan")

# ==================== MODELO: HISTORIAL ====================
class Historial(Base):
    __tablename__ = "historial_lubricacion"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("planes_lubricacion.id", ondelete="CASCADE"), nullable=False, index=True)
    fecha_ejecucion = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    cantidad_aplicada = Column(Float, nullable=False)
    tecnico = Column(String(100), nullable=False)
    observaciones = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    plan = relationship("PlanLubricacion", back_populates="historial")

# ==================== MODELO: USUARIO ====================
class Usuario(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(50), default="tecnico", nullable=False)
    activo = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)