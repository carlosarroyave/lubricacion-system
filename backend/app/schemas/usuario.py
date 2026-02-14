"""
Schemas: Usuarios
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    rol: str = Field("tecnico", regex="^(admin|supervisor|tecnico)$")

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)

class UsuarioResponse(UsuarioBase):
    id: int
    activo: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True