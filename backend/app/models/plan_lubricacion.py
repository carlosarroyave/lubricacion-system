"""
Modelo: Planes de Lubricación
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

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
    
    # Relaciones
    equipo = relationship("Equipo", back_populates="planes")
    historial = relationship("Historial", back_populates="plan", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<PlanLubricacion {self.id}>"