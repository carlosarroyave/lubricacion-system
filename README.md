# LubeTrack Pro — Sistema de Gestión de Lubricación Industrial

Sistema de gestión y seguimiento de lubricación para equipos industriales. Permite planificar, ejecutar y registrar lubricaciones según estándares de mantenimiento predictivo.

## Funcionalidades

- **Planes de Lubricación** — Visualización de planes próximos y vencidos, con ejecución desde la interfaz.
- **Gestión de Equipos** — CRUD completo de equipos con criticidad (A/B/C), ubicación, modelo de rodamiento y parámetros de lubricación.
- **Historial** — Registro detallado de todas las lubricaciones ejecutadas (técnico, cantidad, observaciones).
- **Calculadora SKF** — Cálculo automático de cantidad de grasa según fórmula SKF (`G = 0.005 × D × B`).
- **Dashboard** — Resumen operativo: equipos activos, planes vencidos, distribución de criticidad, grasa total aplicada.
- **Diagnóstico del sistema** — Verificación de estado de la API y la base de datos.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | FastAPI · SQLAlchemy · Pydantic · PostgreSQL |
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS · Framer Motion |
| **Base de datos** | PostgreSQL (Supabase) |

## Estructura del Proyecto

```
lubricacion-system/
├── backend/
│   ├── app/
│   │   ├── core/          # config.py, database.py
│   │   ├── models/        # equipo, plan_lubricacion, historial, usuario
│   │   ├── routes/        # equipos, lubricacion, health
│   │   ├── schemas/       # validación Pydantic
│   │   ├── services/      # lógica de negocio
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/           # layout, page, globals.css
│   │   ├── components/    # UI, layout, tabs
│   │   ├── lib/           # api.ts, utils.ts
│   │   └── types/         # index.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

## API Endpoints

```
GET    /api/equipos                         Listar equipos
POST   /api/equipos                         Crear equipo
GET    /api/equipos/{id}                    Obtener equipo
PUT    /api/equipos/{id}                    Actualizar equipo
DELETE /api/equipos/{id}                    Desactivar equipo
GET    /api/equipos/{id}/historial          Historial de un equipo

GET    /api/lubricacion/planes/proximos     Planes próximos a vencer
POST   /api/lubricacion/ejecutar/{plan_id}  Registrar ejecución
GET    /api/lubricacion/historial           Historial de lubricaciones
GET    /api/lubricacion/calcular-skf        Calculadora SKF

GET    /api/health                          Estado del sistema
```

## Desarrollo Local

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

Variables de entorno necesarias:

- `DATABASE_URL` — URI de conexión a PostgreSQL
- `SECRET_KEY` — Clave secreta para la API
- `NEXT_PUBLIC_API_URL` — URL del backend (en frontend/.env.local)

## Licencia

MIT — ver [LICENSE](LICENSE)

## Autor

**Carlos Arroyave**
