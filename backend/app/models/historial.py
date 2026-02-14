"""
Modelo: Historial de Lubricación
"""
from sqlalchemy import Column, Integer, Float, DateTime, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Historial(Base):
    __tablename__ = "historial_lubricacion"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("planes_lubricacion.id", ondelete="CASCADE"), nullable=False, index=True)
    fecha_ejecucion = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    cantidad_aplicada = Column(Float, nullable=False)
    tecnico = Column(String(100), nullable=False)
    observaciones = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relaciones
    plan = relationship("PlanLubricacion", back_populates="historial")
    
    def __repr__(self):
        return f"<Historial {self.id}>"
