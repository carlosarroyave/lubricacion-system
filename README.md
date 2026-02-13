# 🔧 Sistema de Gestión de Lubricación Industrial

Sistema profesional y escalable de gestión de lubricación para equipos industriales, construido con tecnología moderna y arquitectura de microservicios.

## 🎯 Características

- **Gestión de Equipos**: Registrar, editar y monitorear equipos de lubricación
- **Planes Automáticos**: Generación automática de planes de lubricación basados en criticidad
- **Historial Completo**: Registro detallado de todas las lubricaciones realizadas
- **Calculadora SKF**: Cálculo automático de cantidades según norma SKF
- **Alertas Inteligentes**: Sistema de alertas para lubricaciones vencidas o próximas
- **Reportes**: Exportación de datos en CSV
- **Interfaz Moderna**: Frontend intuitivo con Streamlit
- **API RESTful**: Backend profesional con FastAPI

## 🏗️ Arquitectura

Microservicios con separación clara de responsabilidades:
- Backend FastAPI (Puerto 8000)
- Frontend Streamlit (Puerto 8501)
- PostgreSQL (Puerto 5432)

## 🚀 Inicio Rápido

### Con Docker (Recomendado)

```bash
git clone https://github.com/carlosarroyave/lubricacion-system.git
cd lubricacion-system
cp .env.example .env
docker-compose up
```

Accede a:
- Frontend: http://localhost:8501
- API Docs: http://localhost:8000/api/docs

### Instalación Manual

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

## 📊 Endpoints de API

- `GET /api/equipos` - Listar equipos
- `POST /api/equipos` - Crear equipo
- `GET /api/lubricacion/planes/proximos` - Planes próximos
- `POST /api/lubricacion/ejecutar/{plan_id}` - Registrar ejecución
- `GET /api/lubricacion/calcular-skf` - Calcular SKF

## 📋 Requisitos

- Python 3.11+
- PostgreSQL 16+
- Docker & Docker Compose

## 📄 Licencia

MIT License - Ver LICENSE

## 👤 Autor

**Carlos Arroyave**
- GitHub: [@carlosarroyave](https://github.com/carlosarroyave)

**Versión:** 1.0.0