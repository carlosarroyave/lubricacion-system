"""
Importar todos los schemas
"""
from .equipo import EquipoCreate, EquipoUpdate, EquipoResponse
from .plan import PlanCreate, PlanUpdate, PlanResponse
from .historial import HistorialCreate, HistorialResponse
from .usuario import UsuarioCreate, UsuarioResponse

__all__ = [
    "EquipoCreate", "EquipoUpdate", "EquipoResponse",
    "PlanCreate", "PlanUpdate", "PlanResponse",
    "HistorialCreate", "HistorialResponse",
    "UsuarioCreate", "UsuarioResponse",
]