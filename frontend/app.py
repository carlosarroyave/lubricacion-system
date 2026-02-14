"""
Aplicación Principal - Streamlit
"""
import streamlit as st
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional
import os

# ==================== CONFIGURACIÓN ====================
# En Streamlit Cloud, usar secrets. En local, usar env
try:
    API_URL = st.secrets.get("API_URL", "").strip()
    if not API_URL:
        raise ValueError("API_URL vacío en secrets")
except Exception as e:
    API_URL = os.getenv("API_URL", "https://lubricacion-api.onrender.com")

# Debug: mostrar URL en desarrollo
if os.getenv("STREAMLIT_ENV") == "dev":
    st.sidebar.write(f"🔗 API URL: {API_URL}")
st.set_page_config(
    page_title="Gestión Lubricación",
    page_icon="🔧",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==================== ESTILOS ====================
st.markdown("""
    <style>
    .main {
        padding: 2rem 1rem;
    }
    .stMetric {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
    }
    </style>
    """, unsafe_allow_html=True)

# ==================== FUNCIONES DE API ====================
def get_health_check() -> bool:
    """Verificar conexión a API"""
    try:
        url = f"{API_URL}/api/health"
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except Exception as e:
        st.sidebar.error(f"❌ Error de conexión: {str(e)}\n🔗 URL: {API_URL}/api/health")
        return False

def get_equipos():
    """Obtener lista de equipos"""
    try:
        response = requests.get(f"{API_URL}/api/equipos", timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"Error al obtener equipos: {str(e)}")
        return []

def crear_equipo(equipo_data: dict):
    """Crear nuevo equipo"""
    try:
        response = requests.post(
            f"{API_URL}/api/equipos",
            json=equipo_data,
            timeout=10
        )
        response.raise_for_status()
        return response.json(), True
    except Exception as e:
        return None, False

def obtener_planes_proximos(dias: int = 7):
    """Obtener planes de lubricación próximos"""
    try:
        response = requests.get(
            f"{API_URL}/api/lubricacion/planes/proximos",
            params={"dias": dias},
            timeout=10
        )
        response.raise_for_status()
        return response.json(), True
    except Exception as e:
        st.error(f"Error al obtener planes: {str(e)}")
        return [], False

def registrar_lubricacion(plan_id: int, data: dict):
    """Registrar ejecución de lubricación"""
    try:
        response = requests.post(
            f"{API_URL}/api/lubricacion/ejecutar/{plan_id}",
            json=data,
            timeout=10
        )
        response.raise_for_status()
        return response.json(), True
    except Exception as e:
        return None, False

def actualizar_equipo(equipo_id: int, equipo_data: dict):
    """Actualizar equipo existente"""
    try:
        response = requests.put(
            f"{API_URL}/api/equipos/{equipo_id}",
            json=equipo_data,
            timeout=10
        )
        response.raise_for_status()
        return response.json(), True
    except Exception as e:
        return None, False

def eliminar_equipo(equipo_id: int):
    """Eliminar (desactivar) equipo"""
    try:
        response = requests.delete(
            f"{API_URL}/api/equipos/{equipo_id}",
            timeout=10
        )
        response.raise_for_status()
        return True
    except Exception as e:
        return False

def calcular_skf(diametro: float, ancho: float) -> Optional[float]:
    """Calcular cantidad según fórmula SKF"""
    try:
        response = requests.get(
            f"{API_URL}/api/lubricacion/calcular-skf",
            params={"diametro_mm": diametro, "ancho_mm": ancho},
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"Error en cálculo: {str(e)}")
        return None

# ==================== INICIALIZACIÓN ====================
if "connected" not in st.session_state:
    st.session_state.connected = get_health_check()

# ==================== INTERFAZ PRINCIPAL ====================
st.title("🔧 Gestión Inteligente de Lubricación")

# Barra de estado
col1, col2, col3 = st.columns([3, 1, 1])
with col1:
    st.markdown("### Sistema de Gestión de Lubricación Industrial")
with col2:
    status = "🟢 Conectado" if st.session_state.connected else "🔴 Desconectado"
    st.write(f"**Estado:** {status}")
with col3:
    if st.button("🔄 Actualizar"):
        st.session_state.connected = get_health_check()
        st.rerun()

st.markdown("---")

if not st.session_state.connected:
    st.error("❌ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en " + API_URL)
else:
    # Crear tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📊 Pool de Lubricación",
        "➕ Nuevo Equipo",
        "📦 Inventario",
        "📈 Historial",
        "⚙️ Herramientas"
    ])
    
    # ==================== TAB 1: POOL ====================
    with tab1:
        st.header("📅 Pool de Lubricación - Pendientes")
        
        planes_data, ok = obtener_planes_proximos(dias=7)
        
        if not ok or not planes_data:
            st.info("✅ No hay equipos pendientes de lubricar")
        else:
            st.write(f"**{len(planes_data)} equipo(s) requieren atención**")
            
            # Agrupar por criticidad
            criticos = [p for p in planes_data if p['criticidad'] == 'A']
            medios = [p for p in planes_data if p['criticidad'] == 'B']
            bajos = [p for p in planes_data if p['criticidad'] == 'C']
            
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("🔴 Críticos", len(criticos))
            with col2:
                st.metric("🟡 Medios", len(medios))
            with col3:
                st.metric("🟢 Bajos", len(bajos))
            
            st.markdown("---")
            
            # Mostrar planes
            for idx, plan in enumerate(planes_data):
                with st.container():
                    col1, col2, col3, col4 = st.columns([2, 2, 1.5, 1], gap="small")
                    
                    with col1:
                        st.markdown(f"### {plan['equipo_nombre']}")
                        st.caption(f"Plan ID: {plan['id']}")
                    
                    with col2:
                        st.markdown(f"**Lubricante:** {plan['tipo_lubricante']}")
                        st.caption(f"**Cantidad:** {plan['cantidad_gramos']}g")
                    
                    with col3:
                        st.metric("Próxima", plan['proxima_fecha'][:10])
                        st.caption(f"Días: {plan['dias_restantes']}")
                    
                    with col4:
                        estado_emoji = plan['estado']
                        st.subheader(estado_emoji)
                    
                    if st.button("✅ Registrar", key=f"btn_{plan['id']}"):
                        st.session_state[f"modal_{plan['id']}"] = True
                
                # Modal
                if st.session_state.get(f"modal_{plan['id']}", False):
                    st.markdown("---")
                    st.subheader("📝 Registrar Ejecución")
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        fecha = st.date_input("Fecha", datetime.now(), key=f"fecha_{plan['id']}")
                    with col2:
                        cantidad = st.number_input(
                            "Cantidad aplicada (g)",
                            value=float(plan['cantidad_gramos']),
                            min_value=0.0,
                            key=f"cant_{plan['id']}"
                        )
                    
                    tecnico = st.text_input("Técnico", key=f"tech_{plan['id']}")
                    obs = st.text_area("Observaciones", key=f"obs_{plan['id']}")
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        if st.button("💾 Guardar", key=f"save_{plan['id']}"):
                            data = {
                                "plan_id": plan['id'],
                                "cantidad_aplicada": cantidad,
                                "tecnico": tecnico,
                                "observaciones": obs,
                                "fecha_ejecucion": fecha.isoformat()
                            }
                            result, success = registrar_lubricacion(plan['id'], data)
                            if success:
                                st.success("✅ Lubricación registrada")
                                st.session_state[f"modal_{plan['id']}"] = False
                                st.rerun()
                            else:
                                st.error("Error al guardar")
                    
                    with col2:
                        if st.button("❌ Cancelar", key=f"cancel_{plan['id']}"):
                            st.session_state[f"modal_{plan['id']}"] = False
                            st.rerun()
                    
                    st.markdown("---")
    
    # ==================== TAB 2: NUEVO EQUIPO ====================
    with tab2:
        st.header("➕ Registrar Nuevo Equipo")
        
        # Inicializar session state para los campos
        if "nombre_eq" not in st.session_state:
            st.session_state.nombre_eq = ""
            st.session_state.componente_eq = ""
            st.session_state.critico_eq = "B"
            st.session_state.ubicacion_eq = ""
            st.session_state.modelo_eq = ""
            st.session_state.tipo_lub_eq = ""
            st.session_state.cantidad_eq = 15.0
            st.session_state.frec_eq = 30
        
        col1, col2 = st.columns(2)
        
        with col1:
            nombre = st.text_input("Nombre del equipo", value=st.session_state.nombre_eq, key="nombre_input")
            critico = st.selectbox("Criticidad", ["A", "B", "C"], index=["A", "B", "C"].index(st.session_state.critico_eq), key="critico_input")
            tipo_lub = st.text_input("Tipo lubricante", value=st.session_state.tipo_lub_eq, key="tipo_input")
            frec = st.number_input("Frecuencia (días)", min_value=1, value=st.session_state.frec_eq, key="frec_input")
        
        with col2:
            componente = st.text_input("Componente", value=st.session_state.componente_eq, key="comp_input")
            ubicacion = st.text_input("Ubicación", value=st.session_state.ubicacion_eq, key="ubi_input")
            modelo = st.text_input("Modelo rodamiento", value=st.session_state.modelo_eq, key="modelo_input")
            cantidad = st.number_input("Cantidad (g)", min_value=0.0, value=st.session_state.cantidad_eq, key="cant_input")
        
        col_btn1, col_btn2 = st.columns(2)
        
        with col_btn1:
            if st.button("✅ Registrar Equipo", use_container_width=True):
                if not nombre.strip():
                    st.error("❌ El nombre del equipo es obligatorio")
                else:
                    data = {
                        "nombre": nombre,
                        "componente": componente,
                        "criticidad": critico,
                        "ubicacion": ubicacion,
                        "modelo_rodamiento": modelo,
                        "tipo_lubricante": tipo_lub,
                        "cantidad_gramos": cantidad,
                        "frecuencia_dias": frec
                    }
                    result, success = crear_equipo(data)
                    if success:
                        st.success(f"✅ Equipo '{nombre}' registrado exitosamente")
                        # Limpiar campos
                        st.session_state.nombre_eq = ""
                        st.session_state.componente_eq = ""
                        st.session_state.critico_eq = "B"
                        st.session_state.ubicacion_eq = ""
                        st.session_state.modelo_eq = ""
                        st.session_state.tipo_lub_eq = ""
                        st.session_state.cantidad_eq = 15.0
                        st.session_state.frec_eq = 30
                        st.balloons()
                        st.rerun()
                    else:
                        st.error(f"❌ Error al registrar el equipo")
        
        with col_btn2:
            if st.button("🔄 Limpiar Campos", use_container_width=True):
                st.session_state.nombre_eq = ""
                st.session_state.componente_eq = ""
                st.session_state.critico_eq = "B"
                st.session_state.ubicacion_eq = ""
                st.session_state.modelo_eq = ""
                st.session_state.tipo_lub_eq = ""
                st.session_state.cantidad_eq = 15.0
                st.session_state.frec_eq = 30
                st.rerun()
    
    # ==================== TAB 3: INVENTARIO ====================
    with tab3:
        st.header("📦 Inventario de Equipos")
        
        equipos = get_equipos()
        if equipos:
            # Opción para editar
            st.subheader("Editar Equipo")
            col_e1, col_e2 = st.columns([2, 2])
            
            with col_e1:
                equipo_para_editar = st.selectbox(
                    "Selecciona equipo a editar",
                    options=[f"{e['id']} - {e['nombre']}" for e in equipos],
                    key="equipo_select"
                )
            
            if equipo_para_editar:
                eq_id = int(equipo_para_editar.split(" - ")[0])
                equipo_actual = next((e for e in equipos if e['id'] == eq_id), None)
                
                if equipo_actual:
                    st.markdown("---")
                    st.write(f"**Editando:** {equipo_actual['nombre']}")
                    
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        nombre_edit = st.text_input("Nombre", value=equipo_actual['nombre'], key="nombre_edit")
                        criticidad_edit = st.selectbox("Criticidad", ["A", "B", "C"], index=["A", "B", "C"].index(equipo_actual['criticidad']), key="critico_edit")
                        tipo_lub_edit = st.text_input("Tipo lubricante", value=equipo_actual.get('tipo_lubricante', ''), key="tipo_edit")
                        frec_edit = st.number_input("Frecuencia (días)", min_value=1, value=equipo_actual.get('frecuencia_dias', 30), key="frec_edit")
                    
                    with col2:
                        componente_edit = st.text_input("Componente", value=equipo_actual.get('componente', ''), key="comp_edit")
                        ubicacion_edit = st.text_input("Ubicación", value=equipo_actual.get('ubicacion', ''), key="ubi_edit")
                        modelo_edit = st.text_input("Modelo rodamiento", value=equipo_actual.get('modelo_rodamiento', ''), key="modelo_edit")
                        cantidad_edit = st.number_input("Cantidad (g)", min_value=0.0, value=float(equipo_actual.get('cantidad_gramos', 15)), key="cant_edit")
                    
                    col_upd1, col_upd2, col_upd3 = st.columns(3)
                    
                    with col_upd1:
                        if st.button("💾 Guardar Cambios", use_container_width=True):
                            data_update = {
                                "nombre": nombre_edit,
                                "componente": componente_edit,
                                "criticidad": criticidad_edit,
                                "ubicacion": ubicacion_edit,
                                "modelo_rodamiento": modelo_edit,
                                "tipo_lubricante": tipo_lub_edit,
                                "cantidad_gramos": cantidad_edit,
                                "frecuencia_dias": frec_edit
                            }
                            result, success = actualizar_equipo(eq_id, data_update)
                            if success:
                                st.success(f"✅ Equipo actualizado")
                                st.rerun()
                            else:
                                st.error("❌ Error al actualizar")
                    
                    with col_upd2:
                        if st.button("❌ Eliminar", use_container_width=True, help="Desactivará el equipo"):
                            if eliminar_equipo(eq_id):
                                st.success(f"✅ Equipo desactivado")
                                st.rerun()
                            else:
                                st.error("❌ Error al eliminar")
                    
                    with col_upd3:
                        if st.button("🔄 Cancelar", use_container_width=True):
                            st.rerun()
            
            st.markdown("---")
            st.subheader("Listado completo")
            
            df = pd.DataFrame(equipos)
            st.dataframe(
                df[['id', 'nombre', 'componente', 'criticidad', 'ubicacion', 'estado']],
                use_container_width=True,
                hide_index=True
            )
            
            st.download_button(
                "📥 Descargar CSV",
                data=df.to_csv(index=False),
                file_name=f"equipos_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
            )
        else:
            st.info("No hay equipos registrados")
    
    # ==================== TAB 4: HISTORIAL ====================
    with tab4:
        st.header("📈 Historial de Lubricación")
        
        try:
            response = requests.get(f"{API_URL}/api/lubricacion/historial", timeout=10)
            response.raise_for_status()
            historial = response.json()
            
            if historial:
                df = pd.DataFrame(historial)
                st.dataframe(df, use_container_width=True, hide_index=True)
                
                st.download_button(
                    "📥 Descargar CSV",
                    data=df.to_csv(index=False),
                    file_name=f"historial_{datetime.now().strftime('%Y%m%d')}.csv",
                    mime="text/csv"
                )
            else:
                st.info("No hay registros en el historial")
        except Exception as e:
            st.error(f"Error: {str(e)}")
    
    # ==================== TAB 5: HERRAMIENTAS ====================
    with tab5:
        st.header("⚙️ Herramientas")
        
        sub1, sub2 = st.tabs(["Calculadora SKF", "Información"])
        
        with sub1:
            st.subheader("🧮 Calculadora SKF")
            st.write("Fórmula: **G = 0.005 × D × B**")
            
            col1, col2 = st.columns(2)
            with col1:
                diametro = st.number_input("Diámetro (mm)", min_value=0.0, value=20.0)
            with col2:
                ancho = st.number_input("Ancho (mm)", min_value=0.0, value=10.0)
            
            if st.button("📐 Calcular"):
                result = calcular_skf(diametro, ancho)
                if result:
                    st.success(f"**Cantidad recomendada: {result['cantidad_gramos']}g**")
        
        with sub2:
            st.subheader("Informacion del Sistema")
            st.write(f"**Version API:** v1.0.0")
            st.write(f"**Conectado a:** {API_URL}")
            st.write(f"**Fecha:** {datetime.now().strftime('%d/%m/%Y %H:%M')}")

st.markdown("---")
st.caption("🔧 Gestión de Lubricación v1.0 | © 2026 | Sistema Profesional")
