"""
Servicio de Equipos
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend.app.models.equipo import Equipo
from backend.app.models.plan_lubricacion import PlanLubricacion
from backend.app.schemas.equipo import EquipoCreate, EquipoUpdate
import logging

logger = logging.getLogger(__name__)

class EquipoService:
    
    @staticmethod
    def crear_equipo(db: Session, equipo_data: EquipoCreate) -> Equipo:
        """Crear nuevo equipo y su plan de lubricación"""
        try:
            # Crear equipo
            equipo = Equipo(**equipo_data.dict())
            db.add(equipo)
            db.flush()
            
            # Crear plan de lubricación
            proxima_fecha = datetime.utcnow() + timedelta(days=equipo_data.frecuencia_dias)
            plan = PlanLubricacion(
                equipo_id=equipo.id,
                tipo_lubricante=equipo_data.tipo_lubricante,
                cantidad_gramos=equipo_data.cantidad_gramos,
                frecuencia_dias=equipo_data.frecuencia_dias,
                proxima_fecha_lubricacion=proxima_fecha
            )
            db.add(plan)
            db.commit()
            db.refresh(equipo)
            
            logger.info(f"Equipo creado: {equipo.nombre}")
            return equipo
        except Exception as e:
            db.rollback()
            logger.error(f"Error al crear equipo: {str(e)}")
            raise
    
    @staticmethod
    def obtener_equipos(db: Session, skip: int = 0, limit: int = 50) -> list:
        """Obtener lista de equipos activos"""
        return db.query(Equipo).filter(
            Equipo.estado == "ACTIVO"
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def obtener_equipo_por_id(db: Session, equipo_id: int) -> Equipo:
        """Obtener equipo por ID"""
        return db.query(Equipo).filter(Equipo.id == equipo_id).first()
    
    @staticmethod
    def actualizar_equipo(db: Session, equipo_id: int, equipo_data: EquipoUpdate) -> Equipo:
        """Actualizar datos del equipo"""
        try:
            equipo = db.query(Equipo).filter(Equipo.id == equipo_id).first()
            if not equipo:
                return None
            
            update_data = equipo_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(equipo, key, value)
            
            db.commit()
            db.refresh(equipo)
            
            logger.info(f"Equipo actualizado: {equipo.nombre}")
            return equipo
        except Exception as e:
            db.rollback()
            logger.error(f"Error al actualizar equipo: {str(e)}")
            raise
    
    @staticmethod
    def eliminar_equipo(db: Session, equipo_id: int) -> bool:
        """Eliminar (desactivar) equipo"""
        try:
            equipo = db.query(Equipo).filter(Equipo.id == equipo_id).first()
            if not equipo:
                return False
            
            equipo.estado = "INACTIVO"
            db.commit()
            
            logger.info(f"Equipo desactivado: {equipo.nombre}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Error al eliminar equipo: {str(e)}")
            raise
