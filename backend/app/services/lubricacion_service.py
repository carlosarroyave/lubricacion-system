"""
Servicio de Lubricación
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend.app.models.plan_lubricacion import PlanLubricacion
from backend.app.models.historial import Historial
from backend.app.models.equipo import Equipo
from backend.app.schemas.historial import HistorialCreate
import logging

logger = logging.getLogger(__name__)

class LubricacionService:
    
    @staticmethod
    def obtener_planes_proximos(db: Session, dias: int = 7, planta: str = None) -> list:
        """Obtener planes de lubricación próximos o vencidos"""
        fecha_limite = datetime.utcnow() + timedelta(days=dias)
        
        query = db.query(PlanLubricacion).filter(
            PlanLubricacion.proxima_fecha_lubricacion <= fecha_limite,
            PlanLubricacion.equipo.has(estado="ACTIVO")
        )
        if planta:
            query = query.filter(PlanLubricacion.equipo.has(Equipo.planta == planta))
        
        planes = query.all()
        
        return planes
    
    @staticmethod
    def registrar_ejecucion(db: Session, historial_data: HistorialCreate) -> Historial:
        """Registrar ejecución de lubricación y actualizar plan"""
        try:
            # Obtener plan
            plan = db.query(PlanLubricacion).filter(
                PlanLubricacion.id == historial_data.plan_id
            ).first()
            
            if not plan:
                raise ValueError(f"Plan {historial_data.plan_id} no existe")
            
            # Crear registro en historial
            historial = Historial(**historial_data.dict())
            db.add(historial)
            db.flush()
            
            # Actualizar plan
            plan.ultima_fecha_lubricacion = historial_data.fecha_ejecucion or datetime.utcnow()
            plan.proxima_fecha_lubricacion = plan.ultima_fecha_lubricacion + timedelta(
                days=plan.frecuencia_dias
            )
            
            db.commit()
            db.refresh(historial)
            
            logger.info(f"Lubricación registrada: Plan {plan.id}")
            return historial
        except Exception as e:
            db.rollback()
            logger.error(f"Error al registrar ejecución: {str(e)}")
            raise
    
    @staticmethod
    def obtener_historial(db: Session, plan_id: int = None, planta: str = None, limit: int = 50) -> list:
        """Obtener historial de lubricaciones"""
        query = db.query(Historial)
        
        if plan_id:
            query = query.filter(Historial.plan_id == plan_id)
        
        if planta:
            query = query.join(Historial.plan).join(PlanLubricacion.equipo).filter(Equipo.planta == planta)
        
        return query.order_by(Historial.fecha_ejecucion.desc()).limit(limit).all()
    
    @staticmethod
    def calcular_cantidad_skf(diametro_mm: float, ancho_mm: float) -> float:
        """
        Calcula cantidad de grasa usando fórmula SKF
        G = 0.005 × D × B
        """
        if diametro_mm and ancho_mm:
            return 0.005 * diametro_mm * ancho_mm
        return None