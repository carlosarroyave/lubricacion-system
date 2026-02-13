# Estructura del Proyecto

## Directorios Principales

### Backend (`/backend`)
- `app/core/` - Configuración y conexión a BD
- `app/models/` - Modelos SQLAlchemy
- `app/routes/` - Endpoints de API
- `app/schemas/` - Validación con Pydantic
- `app/services/` - Lógica de negocio
- `requirements.txt` - Dependencias Python
- `Dockerfile` - Imagen Docker

### Frontend (`/frontend`)
- `app.py` - Aplicación Streamlit
- `.streamlit/config.toml` - Configuración Streamlit
- `requirements.txt` - Dependencias
- `Dockerfile` - Imagen Docker

## Stack Tecnológico

### Backend
- FastAPI - Framework web
- SQLAlchemy - ORM
- Pydantic - Validación
- PostgreSQL - BD

### Frontend
- Streamlit - UI
- Pandas - Datos
- Requests - HTTP

## Flujo de Datos

```
Streamlit UI → FastAPI API → PostgreSQL
    ↓             ↓              ↓
  8501          8000           5432
```