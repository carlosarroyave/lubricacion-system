# 🎯 PRÓXIMOS PASOS - Despliegue en 20 Minutos

Tu sistema está **100% listo**. Solo falta desplegar en la nube. Sigue estos 3 pasos:

---

## 📋 CHECKLIST FINAL

- [x] Proyecto GitHub creado
- [x] Backend completo (FastAPI)
- [x] Frontend completo (Streamlit)
- [x] Código en GitHub
- [ ] **Despliegue en Supabase (TÚ AQUÍ)**
- [ ] Despliegue en Render.com
- [ ] Despliegue en Streamlit Cloud

---

## 🚀 PASO 1: Crear BD en Supabase (5 minutos)

### 1.1 Ir a Supabase
```
https://supabase.com
```

### 1.2 Sign Up
- Usa tu email o GitHub
- Completa el formulario

### 1.3 Crear Proyecto
- Click "New Project"
- Nombre: `lubricacion`
- Contraseña: `lubricacion_2026`
- Región: La más cercana
- Click "Create new project"
- Espera 2 minutos...

### 1.4 IMPORTANTE: Copiar Connection String
1. En el panel, ve a **Settings** (⚙️ abajo a izquierda)
2. Click en **Database**
3. Copiar la URI (Connection String)
4. Debe parecer: `postgresql://postgres.xxxxx:yyyyyy@...`
5. **Guárdalo en un lugar seguro** 📋

---

## 🚀 PASO 2: Desplegar Backend en Render.com (10 minutos)

### 2.1 Ir a Render
```
https://render.com
```

### 2.2 Sign Up / Login
- Recomendado: Click "Login with GitHub"
- Autoriza Render

### 2.3 Crear Web Service
1. Click **"+  New"** (arriba derecha)
2. Selecciona **"Web Service"**
3. Te pedirá conectar repositorio GitHub
   - Busca: `lubricacion-system`
   - Selecciona y click "Connect"

### 2.4 Configuración del Servicio
```
Name:              lubricacion-api
Environment:       Python 3
Build Command:     pip install -r requirements.txt
Start Command:     uvicorn app.main:app --host 0.0.0.0 --port 8000
Plan:              Free (sin usar crédito)
```

### 2.5 Variables de Entorno (CRÍTICO)
1. En la misma pantalla, scroll hacia abajo
2. Click en **"Advanced"**
3. Click **"Add Environment Variable"**
4. Agrega **DOS variables:**

**Variable 1:**
```
Key:   DATABASE_URL
Value: [Pega aquí tu Connection String de Supabase]
```

**Variable 2:**
```
Key:   SECRET_KEY
Value: prod-secret-2026
```

### 2.6 Deploy
- Click **"Create Web Service"**
- Espera 5-10 minutos a que termine
- Recibirás una URL como: `https://lubricacion-api.onrender.com`
- **COPIA ESTA URL** 📋

---

## 🚀 PASO 3: Desplegar Frontend en Streamlit Cloud (5 minutos)

### 3.1 Ir a Streamlit Cloud
```
https://streamlit.io/cloud
```

### 3.2 Sign In / Sign Up
- Click "Sign in"
- Login con GitHub

### 3.3 Deploy Nueva App
1. Click **"New app"**
2. Selecciona:
   ```
   Repository:   carlosarroyave/lubricacion-system
   Branch:       main
   Main file:    frontend/app.py
   ```
3. Click **"Deploy!"**
4. Espera 2-3 minutos...

### 3.4 Configurar API URL (IMPORTANTE)
1. Cuando termine, ve a tu app (URL en la esquina superior)
2. Click en ⚙️ **Settings** (arriba derecha)
3. Click en **"Secrets"** (en el menú izquierdo)
4. Pega esto:
   ```
   API_URL="https://lubricacion-api.onrender.com"
   ```
   (Reemplaza con la URL que copiaste en Render)

5. Click **"Save"**
6. Tu app se reiniciará automáticamente

---

## ✅ ¡LISTO!

Tus URLs:
- 🎨 **Frontend:** `https://[your-username]-lubricacion-system.streamlit.app`
- 📚 **API Docs:** `https://lubricacion-api.onrender.com/api/docs`
- 🗄️ **Base de Datos:** Supabase (automática)

---

## 🧪 Verificar que Funciona

### Test 1: Verificar API
En tu navegador:
```
https://lubricacion-api.onrender.com/api/health
```

Debe mostrar:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T...",
  "database": "connected"
}
```

Si muestra `"database": "disconnected"`:
- Verifica que DATABASE_URL esté bien en Render
- Espera 30 segundos más
- Recarga la página

### Test 2: Abrir tu App
```
https://[your-app-name].streamlit.app
```

Debe cargar la interfaz de lubricación.

---

## ⚠️ Notas Importantes

### Primer Acceso Puede Tardar
- **Render.com:** El servidor "duerme" después de inactividad. Primer acceso tarda 50 segundos
- **Streamlit Cloud:** La primera carga puede tardar un poco
- Esto es normal en planes free

### Límites de Recursos
- **Supabase:** 500 MB (más que suficiente para pruebas)
- **Render.com:** 0.5 GB RAM (más que suficiente para la API)
- **Streamlit Cloud:** Recursos compartidos (suficiente para prototipos)

### Para Producción Real
Si necesitas:
- ✅ Más usuarios
- ✅ Más datos
- ✅ Mayor disponibilidad
- ✅ Mejor rendimiento

Actualiza a planes pagos:
- Supabase: $5-50/mes según uso
- Render.com: Similar
- Streamlit Cloud: $5+/mes

---

## 🂦 Si Algo Falla

### "API no se conecta"
1. Revisa DATABASE_URL en Render.com
2. Verifica que Supabase BD esté activa
3. Replica exactamente el Connection String

### "Frontend no carga"
1. Verifica API_URL en Secrets de Streamlit
2. Sin "https://" o sin la URL completa causa error
3. Debe ser exactamente: `https://lubricacion-api.onrender.com`

### "BD no responde"
1. Ve a Supabase Dashboard
2. Verifica estado del proyecto
3. Si está offline, reinicia desde Supabase

---

## 📚 Documentación Completa

- **DEPLOY-RAPIDO.md** - Guía expandida
- **ACCESO-SERVICIOS.md** - Cómo manejar cada servicio
- **README.md** - Documentación general
- **API Docs:** `/api/docs` en tu backend

---

## ✨ Después del Deploy

**Funcionalidades disponibles:**
- ✅ Crear equipos
- ✅ Ver pool de lubricación
- ✅ Registrar lubricaciones
- ✅ Ver historial
- ✅ Calculadora SKF
- ✅ Exportar reportes CSV

---

**⏱️ Tiempo estimado:** 20 minutos  
**Costo:** $0 (planes free)  
**Resultado:** Tu app en vivo en Internet  

¡Vamos! 🚀

---

*Si tienes dudas, revisa la documentación o abre un issue en GitHub*