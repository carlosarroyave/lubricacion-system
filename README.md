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

## 🏗️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para bases de datos
- **Pydantic** - Validación de datos
- **PostgreSQL** - Base de datos relacional (via Supabase)

### Frontend
- **Streamlit** - Framework UI interactivo
- **Pandas** - Análisis de datos
- **Requests** - Cliente HTTP

### Cloud
- **Supabase** - PostgreSQL cloud (GRATIS)
- **Render.com** - Backend API hosting (GRATIS)
- **Streamlit Cloud** - Frontend hosting (GRATIS)

## 🚀 Inicio Rápido - Deploy en la Nube

### Opción 1: Deploy Automático (Recomendado)

👉 **Ver:** [DEPLOY-RAPIDO.md](DEPLOY-RAPIDO.md) para instrucciones paso a paso

**Resumen:**
1. Crear BD en **Supabase** (5 min)
2. Deploy backend en **Render.com** (10 min)
3. Deploy frontend en **Streamlit Cloud** (5 min)
4. ¡Listo! Tu app está en vivo

### Opción 2: Local con Docker

```bash
git clone https://github.com/carlosarroyave/lubricacion-system.git
cd lubricacion-system
cp .env.example .env
docker-compose up
```

Accede a:
- Frontend: http://localhost:8501
- API Docs: http://localhost:8000/api/docs

### Opción 3: Local sin Docker

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (en otro terminal)
cd frontend
pip install -r requirements.txt
streamlit run app.py
```

## 📊 Endpoints de API

```
GET  /api/equipos              # Listar equipos
POST /api/equipos              # Crear equipo
GET  /api/equipos/{id}         # Obtener equipo
PUT  /api/equipos/{id}         # Actualizar equipo
DELETE /api/equipos/{id}       # Eliminar equipo

GET  /api/lubricacion/planes/proximos        # Planes próximos
POST /api/lubricacion/ejecutar/{plan_id}     # Registrar ejecución
GET  /api/lubricacion/historial              # Historial
GET  /api/lubricacion/calcular-skf           # Calcular SKF

GET  /api/health               # Health check
```

Documentación interactiva: `/api/docs` (Swagger UI)

## 📁 Estructura del Proyecto

```
lubricacion-system/
├── backend/                 # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── core/           # Database, Config
│   │   ├── models.py       # Modelos ORM
│   │   ├── main.py         # Aplicación
│   │   └── __init__.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Streamlit
│   ├── app.py             # Aplicación principal
│   ├── requirements.txt
│   └── .streamlit/config.toml
├── docker-compose.yml      # Orquestación
├── DEPLOY-RAPIDO.md       # ⭐ GUÍA DE DEPLOY
└── README.md
```

## 🔐 Configuración de Seguridad

### Variables de Entorno (`.env`)

```env
# Base de datos
DATABASE_URL=postgresql://...

# API
SECRET_KEY=your-secret-key-2026
API_TITLE=Gestión de Lubricación API
API_VERSION=1.0.0
```

### En Producción
- ✅ Cambiar SECRET_KEY
- ✅ Usar HTTPS
- ✅ Configurar CORS específicamente
- ✅ Backups regulares de BD
- ✅ Variables sensibles en secrets/environment

## 🐛 Desarrollo

### Crear rama de feature
```bash
git checkout -b feature/mi-feature
```

### Testing
```bash
cd backend
pytest
```

### Commit
```bash
git commit -m "feat: descripción del cambio"
git push origin feature/mi-feature
```

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE)

## 👤 Autor

**Carlos Arroyave**
- GitHub: [@carlosarroyave](https://github.com/carlosarroyave)
- Sistema de Lubricación Industrial v1.0

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor sigue estas reglas:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte o reportar bugs, abre un issue en GitHub.

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026  
**Estado:** ✅ Listo para producción