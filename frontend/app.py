import streamlit as st
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional
import os

# ==================== CONFIG ====================
API_URL = os.getenv("API_URL", "http://localhost:8000")

# ==================== HELPERS ====================
def get_health_check():
    try:
        response = requests.get(f"{API_URL}/api/health", timeout=5)
        response.raise_for_status()
        return response.json().get("status") == "healthy"
    except Exception:
        return False

def obtener_equipos():
    try:
        response = requests.get(f"{API_URL}/api/equipos", timeout=10)
        response.raise_for_status()
        return response.json(), True
    except Exception as e:
        return None, False

def crear_equipo(data: dict) -> bool:
    try:
        response = requests.post(f"{API_URL}/api/equipos", json=data, timeout=10)
        response.raise_for_status()
        return True
    except Exception as e:
        st.error(f"Error al crear equipo: {str(e)}")
        return False

def eliminar_equipo(equipo_id: int) -> bool:
    try:
        response = requests.delete(f"{API_URL}/api/equipos/{equipo_id}", timeout=10)
        response.raise_for_status()
        return True
    except Exception as e:
        st.error(f"Error al eliminar equipo: {str(e)}")
        return False

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
        return None, False

def registrar_ejecucion(plan_id: int, tecnico: str, cantidad: float, observaciones: str = "") -> bool:
    try:
        response = requests.post(
            f"{API_URL}/api/lubricacion/ejecutar/{plan_id}",
            json={
                "tecnico": tecnico,
                "cantidad_aplicada": cantidad,
                "observaciones": observaciones
            },
            timeout=10
        )
        response.raise_for_status()
        return True
    except Exception as e:
        st.error(f"Error al registrar: {str(e)}")
        return False

def obtener_historial():
    try:
        response = requests.get(f"{API_URL}/api/lubricacion/historial", timeout=10)
        response.raise_for_status()
        return response.json(), True
    except Exception:
        return None, False

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
            
            # Resumen
            st.write(f"🔴 Criticos: {len(criticos)} | 🟡 Medios: {len(medios)} | 🟢 Bajos: {len(bajos)}")
            
            # Mostrar planes
            for idx, plan in enumerate(planes_data):
                with st.expander(f"{plan['equipo_nombre']} - {plan['proxima_fecha_lubricacion']}"):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"**Equipo:** {plan['equipo_nombre']}")
                        st.write(f"**Ubicación:** {plan['equipo_ubicacion']}")
                        st.write(f"**Componente:** {plan['equipo_componente']}")
                        st.write(f"**Criticidad:** {plan['criticidad']}")
                    with col2:
                        st.write(f"**Tipo Lubricante:** {plan['tipo_lubricante']}")
                        st.write(f"**Cantidad (g):** {plan['cantidad_gramos']}")
                        st.write(f"**Frecuencia (días):** {plan['frecuencia_dias']}")
                        st.write(f"**Última lubricación:** {plan['ultima_fecha_lubricacion']}")
                    
                    st.subheader("📝 Registrar Ejecución")
                    tecnico = st.text_input("Técnico", key=f"tecnico_{idx}")
                    cantidad = st.number_input("Cantidad aplicada (g)", min_value=0.0, value=plan['cantidad_gramos'], key=f"cantidad_{idx}")
                    observaciones = st.text_area("Observaciones", key=f"obs_{idx}")
                    
                    if st.button("✅ Registrar", key=f"btn_{idx}"):
                        if tecnico:
                            if registrar_ejecucion(plan['id'], tecnico, cantidad, observaciones):
                                st.success("✅ Ejecución registrada")
                                st.rerun()
                        else:
                            st.warning("⚠️ Ingrese el nombre del técnico")

    # ==================== TAB 2: NUEVO EQUIPO ====================
    with tab2:
        st.header("➕ Registrar Nuevo Equipo")
        
        with st.form("nuevo_equipo"):
            col1, col2 = st.columns(2)
            with col1:
                nombre = st.text_input("Nombre del equipo")
                componente = st.text_input("Componente")
                ubicacion = st.text_input("Ubicación")
                criticidad = st.selectbox("Criticidad", ["A", "B", "C"])
            with col2:
                modelo_rodamiento = st.text_input("Modelo de Rodamiento")
                tipo_lubricante = st.text_input("Tipo de Lubricante")
                cantidad = st.number_input("Cantidad (g)", min_value=0.0, value=10.0)
                frecuencia = st.number_input("Frecuencia (días)", min_value=1, value=30)
            
            submitted = st.form_submit_button("Guardar")
            if submitted:
                data = {
                    "nombre": nombre,
                    "componente": componente,
                    "ubicacion": ubicacion,
                    "criticidad": criticidad,
                    "modelo_rodamiento": modelo_rodamiento,
                    "tipo_lubricante": tipo_lubricante,
                    "cantidad_gramos": cantidad,
                    "frecuencia_dias": frecuencia
                }
                if crear_equipo(data):
                    st.success("✅ Equipo creado correctamente")

    # ==================== TAB 3: INVENTARIO ====================
    with tab3:
        st.header("📦 Inventario de Equipos")
        equipos = obtener_equipos()
        if equipos:
            equipos_data = equipos[0]
            if len(equipos_data) == 0:
                st.info("No hay equipos registrados.")
            else:
                df = pd.DataFrame(equipos_data)
                st.dataframe(df)
                
                st.subheader("🗑 Eliminar Equipo")
                equipo_id = st.number_input("ID del Equipo", min_value=1, value=1)
                if st.button("Eliminar"):
                    if eliminar_equipo(equipo_id):
                        st.success("✅ Equipo eliminado")
                        st.rerun()

    # ==================== TAB 4: HISTORIAL ====================
    with tab4:
        st.header("📈 Historial de Lubricación")
        historial = obtener_historial()
        if historial:
            hist_data = historial[0]
            if len(hist_data) == 0:
                st.info("No hay registros de historial.")
            else:
                df = pd.DataFrame(hist_data)
                st.dataframe(df)
                st.download_button(
                    "📥 Descargar CSV",
                    data=df.to_csv(index=False).encode("utf-8"),
                    file_name="historial_lubricacion.csv",
                    mime="text/csv"
                )

    # ==================== TAB 5: HERRAMIENTAS ====================
    with tab5:
        st.header("⚙️ Herramientas de Cálculo")
        
        sub1, sub2 = st.tabs(["🧮 Calculadora SKF", "ℹ️ Información"])
        
        with sub1:
            st.subheader("🧮 Calculadora SKF")
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
