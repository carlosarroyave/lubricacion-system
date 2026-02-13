# 👤 Guía de Acceso a Servicios Cloud

Después de desplegar tu sistema, tendrás acceso a varios servicios. Aquí está cómo acceder a cada uno.

## 🎨 Tu Aplicación (Streamlit Cloud)

**URL:** `https://your-username-lubricacion-system.streamlit.app`

### Características:
- Dashboard de lubricación
- Gestión de equipos
- Historial de lubricaciones
- Calculadora SKF
- Exportación de reportes

### Credenciales:
- Sin contraseña (acceso público)
- Compatible con cualquier navegador

---

## 📚 API Documentation

**URL:** `https://lubricacion-api.onrender.com/api/docs`

### Características:
- Documentación interactiva (Swagger UI)
- Prueba los endpoints directamente
- Ver respuestas de ejemplo
- Explorar la estructura de datos

### Endpoints clave:

```
GET  /api/health                            # Verificar estado
GET  /api/equipos                           # Listar equipos
POST /api/equipos                           # Crear equipo
GET  /api/lubricacion/planes/proximos       # Próximos vencimientos
POST /api/lubricacion/ejecutar/{plan_id}    # Registrar lubricación
GET  /api/lubricacion/calcular-skf          # Calcular cantidad
```

---

## 🗄️ Base de Datos (Supabase)

**URL:** `https://supabase.com/`

### Acceso:
1. Ve a https://supabase.com/
2. Login con tu email/GitHub
3. Selecciona proyecto: `lubricacion`
4. En el menú izquierdo, puedes ver:
   - **Tables:** Equipos, Planes, Historial
   - **SQL Editor:** Ejecutar consultas personalizadas
   - **Database:** Settings, backups, etc.

### Tablas principales:
- `equipos` - Listado de equipos
- `planes_lubricacion` - Planes y programas
- `historial_lubricacion` - Registro de lubricaciones
- `usuarios` - Usuarios del sistema

### Backups automáticos:
- Diarios (retención 7 días)
- Semanales (retención 4 semanas)
- Accesibles desde Settings → Database → Backups

---

## ⚙️ Backend (Render.com)

**URL:** `https://render.com/dashboard`

### Acceso:
1. Login en Render.com
2. Selecciona servicio: `lubricacion-api`
3. Puedes ver:
   - **Logs:** Actividad en tiempo real
   - **Deployments:** Historial de deploy
   - **Environment:** Variables de entorno
   - **Monitoring:** CPU, memoria, etc.

### Monitoreo:
- Los logs muestran errores y actividad
- Uptime: generalmente 99.9%
- Reinicio automático en caso de fallo

### Redeploy (si necesitas actualizar):
1. Ve al Dashboard
2. Click en `lubricacion-api`
3. Botón "Manual Deploy" → "Deploy latest commit"
4. Espera 5 minutos

---

## 🔄 Flujo de Datos

```
🎨 Frontend (Streamlit Cloud)
        ↓ API Requests
📚 Backend (Render.com)
        ↓ SQL Queries
🗄️ Database (Supabase)
```

---

## 📊 Monitoreo en Tiempo Real

### Frontend (Streamlit):
- Click ⚙️ en la esquina superior derecha
- "Manage app" → Ver logs

### Backend (Render):
- Dashboard → Logs (actualización en vivo)
- Puedes filtrar por nivel: error, warning, info

### Database (Supabase):
- Realtime → Ver cambios en vivo
- SQL Editor → Ejecutar queries

---

## 🆘 Solucionar Problemas

### La app no carga:
1. Verifica en Streamlit Cloud Logs
2. Revisa que API_URL sea correcto en Secrets
3. Prueba: `https://lubricacion-api.onrender.com/api/health`

### API retorna error:
1. Revisa Render.com Logs
2. Verifica DATABASE_URL
3. Prueba conexión a Supabase

### BD no responde:
1. Ve a Supabase Dashboard
2. Verifica estado en Monitoring
3. Mira si hay queries lentas en Query Performance

---

## 📞 Contacto y Soporte

- **GitHub Issues:** Reporta bugs
- **Email:** Tu email
- **Documentación:** README.md

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026