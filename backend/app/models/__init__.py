"""
Importar todos los modelos
"""
from .equipo import Equipo
from .plan_lubricacion import PlanLubricacion
from .historial import Historial
from .usuario import Usuario

__all__ = ["Equipo", "PlanLubricacion", "Historial", "Usuario"]