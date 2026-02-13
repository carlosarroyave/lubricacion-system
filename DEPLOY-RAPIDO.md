# 🚀 INSTRUCCIONES RÁPIDAS - Despliegue en la Nube

## ✅ Paso 1: Supabase (BD PostgreSQL Gratis)

**1.1** Ve a https://supabase.com/ y haz Sign Up

**1.2** Crea un nuevo proyecto:
- Proyecto: `lubricacion`
- Contraseña: `lubricacion_2026` (o la que quieras, apunta)
- Región: La más cercana a ti

**1.3** Obtén tu DATABASE_URL:
- Menú lateral: Settings → Database → Connection String
- Copia la URL: `postgresql://postgres.xxxxx:password@xxxxx.supabase.co:5432/postgres`
- Ahora tendrás algo como: `DATABASE_URL = postgresql://postgres.xxxxxx...`

---

## ✅ Paso 2: Deploy Backend (Render.com)

**2.1** Ve a https://render.com

**2.2** Sign Up (recomendado con GitHub)

**2.3** Click en "+New" → "Web Service"

**2.4** Conecta tu repositorio:
- Busca: `lubricacion-system`
- Selecciona

**2.5** Configuración:
- **Name:** `lubricacion-api`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `bash start.sh`
- **Plan:** Free (sin crédito)

**2.6** Environmental Variables (muy importante):
- Click "Advanced"
- Add: `DATABASE_URL` = `postgresql://postgres.xxxxx:...` (la de Supabase)
- Add: `SECRET_KEY` = `prod-secret-2026`

**2.7** Click "Create Web Service" y espera 5 minutos

**2.8** Cuando termine, copia tu URL (algo como: `https://lubricacion-api.onrender.com`)

---

## ✅ Paso 3: Deploy Frontend (Streamlit Cloud)

**3.1** Ve a https://streamlit.io/cloud

**3.2** Sign Up / Login (con GitHub es lo más fácil)

**3.3** Click "New app"

**3.4** Selecciona:
- Repository: `carlosarroyave/lubricacion-system`
- Branch: `main`
- Main file path: `frontend/app.py`

**3.5** Click "Deploy" y espera 2-3 minutos

**3.6** Configura URL del Backend:
- En tu app de Streamlit Cloud, click en ⚙️ arriba a la derecha
- Settings → Secrets
- Pega:
```
API_URL="https://lubricacion-api.onrender.com"
```
- Click "Save"

**3.7** Tu app se reiniciará automáticamente

---

## 🎉 ¡Listo!

Tus URLs:
- 🎨 **Frontend:** `https://your-username-lubricacion-system.streamlit.app`
- 📚 **API Docs:** `https://lubricacion-api.onrender.com/api/docs`
- 🗄️ **BD:** Supabase (automática)

---

## 🧪 Prueba que funciona

En tu navegador:
```
https://lubricacion-api.onrender.com/api/health
```

Debe devolver:
```json
{"status":"healthy","timestamp":"...","database":"connected"}
```

Si aparece `"database":"disconnected"`, verifica el DATABASE_URL en Render.

---

## 📝 Notas Importantes

- **Render.com:** El servidor free se "duerme" si no lo usas. Primera carga tarda 50 seg.
- **Streamlit Cloud:** Free pero con límites de recursos
- **Supabase:** DB free de 500 MB (suficiente para pruebas)

Para producción con tráfico alto, usa planes pagos.

---

## ❓ Si algo no funciona

1. Verifica DATABASE_URL en Render
2. Comprueba que Supabase BD esté creada
3. Mira los logs en Render.com
4. Mira los logs en Streamlit Cloud (click en "Manage app")