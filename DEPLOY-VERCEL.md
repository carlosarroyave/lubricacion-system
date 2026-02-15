# 🚀 Deploy del Frontend en Vercel

## Prerequisitos

- Repositorio en GitHub: `https://github.com/carlosarroyave/lubricacion-system`
- Backend desplegado en Render.com (o URL pública del backend FastAPI)
- Cuenta en Vercel (gratis)

---

## Paso 1: Crear cuenta en Vercel

1. Ve a **https://vercel.com**
2. Click en **"Sign Up"**
3. Selecciona **"Continue with GitHub"** (recomendado para mejor integración)
4. Autoriza a Vercel a acceder a tus repositorios

---

## Paso 2: Importar el proyecto

1. Una vez dentro del dashboard de Vercel, click en **"Add New Project"**
2. En la lista de repositorios, busca **`lubricacion-system`**
3. Click en **"Import"**

---

## Paso 3: Configurar el proyecto

En la pantalla de configuración del proyecto:

### Framework Preset
- **Framework:** Next.js (detectado automáticamente)

### Build & Output Settings
- **Root Directory:** `frontend` ⚠️ **IMPORTANTE: Cambiar del default**
  - Click en **"Edit"** next al campo Root Directory
  - Escribe: `frontend`
  - Esto le dice a Vercel que el proyecto Next.js está en la carpeta `frontend/`

- **Build Command:** `npm run build` (automático)
- **Output Directory:** `.next` (automático)
- **Install Command:** `npm install` (automático)

### Environment Variables

Click en **"Environment Variables"** y agrega:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://lubricacion-api.onrender.com` |

⚠️ **IMPORTANTE:** Reemplaza `https://lubricacion-api.onrender.com` con la URL real de tu backend desplegado en Render.com.

**Scope:** Production, Preview, Development (selecciona los 3)

---

## Paso 4: Deploy

1. Click en **"Deploy"**
2. Vercel comenzará a construir y desplegar tu aplicación
3. Esto tomará aproximadamente **2-3 minutos**

Verás un progreso en tiempo real:
- ✅ Cloning repository
- ✅ Installing dependencies
- ✅ Building application
- ✅ Deploying to production

---

## Paso 5: Verificar el despliegue

Una vez completado, Vercel te mostrará:

1. **Production URL:** `https://lubricacion-system.vercel.app` (o similar)
2. Click en **"Visit"** para abrir tu aplicación

### Verificaciones:

- ✅ La página carga con el diseño Glassmorphism
- ✅ El sidebar muestra las 5 secciones
- ✅ El indicador de conexión (abajo en sidebar) está **verde** (Conectado)
- ✅ La página "Pool de Lubricación" carga datos del backend
- ✅ Puedes navegar entre todas las páginas

### Si el indicador de conexión está en rojo:

1. Verifica que la variable de entorno `NEXT_PUBLIC_API_URL` esté correcta
2. Ve a **Settings → Environment Variables** en tu proyecto de Vercel
3. Edita `NEXT_PUBLIC_API_URL` con la URL correcta del backend
4. Click en **"Redeploy"** desde el dashboard

---

## Paso 6: Configurar dominio personalizado (Opcional)

Si tienes un dominio propio:

1. En el dashboard del proyecto, ve a **Settings → Domains**
2. Click en **"Add"**
3. Ingresa tu dominio (ej: `lubricacion.tuempresa.com`)
4. Sigue las instrucciones para configurar DNS

Vercel provee automáticamente:
- ✅ HTTPS/SSL
- ✅ CDN global
- ✅ Automatic deployments on git push

---

## Deployments Automáticos

Cada vez que hagas `git push` a GitHub:
- **Branch `main`:** Se despliega automáticamente a **Production**
- **Otras branches:** Se crean **Preview deployments** con URLs únicas

### Para desactivar auto-deploy:
1. **Settings → Git**
2. Desactiva "Automatically deploy new commits"

---

## URLs Finales

Después del despliegue, tendrás:

| Servicio | URL | Propósito |
|----------|-----|-----------|
| **Frontend** | `https://lubricacion-system.vercel.app` | Interfaz web Glassmorphism |
| **Backend API** | `https://lubricacion-api.onrender.com` | API FastAPI |
| **API Docs** | `https://lubricacion-api.onrender.com/api/docs` | Swagger UI |
| **Database** | Supabase Dashboard | PostgreSQL |
| **Repo** | `https://github.com/carlosarroyave/lubricacion-system` | Código fuente |

---

## Troubleshooting

### Error: "Module not found"
- Verifica que el **Root Directory** esté configurado como `frontend`
- Redeploy desde el dashboard

### Error: "Failed to compile"
- Revisa los logs de build en Vercel dashboard
- Verifica que `npm run build` funcione localmente en `frontend/`

### API no conecta
- Verifica `NEXT_PUBLIC_API_URL` en Environment Variables
- Asegúrate que el backend en Render esté activo (primera request tarda ~50s)
- Verifica CORS en `backend/app/core/config.py` (debe permitir el dominio de Vercel)

### Cambios no se reflejan
- Verifica que el commit se haya pusheado a GitHub
- Espera ~2 min para que Vercel detecte y despliegue
- Manualmente: Dashboard → **"Redeploy"**

---

## Costos

**Plan Free de Vercel incluye:**
- ✅ 100 GB bandwidth/mes
- ✅ Deployments ilimitados
- ✅ Preview deployments
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Serverless functions (100 GB-hours/mes)

**Para aplicaciones en producción con más tráfico:**
- **Pro Plan:** $20/mes — 1TB bandwidth, analytics avanzado
- **Enterprise:** Custom pricing

---

## Comandos útiles locales

```bash
# Desarrollo local
cd frontend
npm run dev
# → http://localhost:3000

# Build de producción (verificar antes de deploy)
npm run build

# Previsualizar build localmente
npm run start
```

---

## Recursos

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Dashboard Vercel:** https://vercel.com/dashboard

---

**Tiempo total estimado:** 5-10 minutos  
**Costo:** $0 (plan free)  
**Resultado:** Tu frontend Next.js con Glassmorphism en vivo en Internet 🎉
