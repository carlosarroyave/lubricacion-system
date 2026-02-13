"""
Aplicación Principal - Streamlit
"""
import streamlit as st
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional
import os

# API URL
API_URL = os.getenv("API_URL", "http://localhost:8000")

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
    </style>
    """, unsafe_allow_html=True)

# ==================== FUNCIONES API ====================
def get_health_check() -> bool:
    """Verificar conexión a API"""
    try:
        response = requests.get(f"{API_URL}/api/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def calcular_skf(diametro: float, ancho: float) -> Optional[float]:
    """Calcular cantidad según fórmula SKF"""
    if diametro and ancho:
        return 0.005 * diametro * ancho
    return None

# ==================== INTERFAZ ====================
st.title("🔧 Gestión Inteligente de Lubricación")

# Estado
col1, col2, col3 = st.columns([3, 1, 1])
with col1:
    st.markdown("### Sistema de Gestión de Lubricación Industrial")
with col2:
    connected = get_health_check()
    status = "🟢 Conectado" if connected else "🔴 Desconectado"
    st.write(f"**Estado:** {status}")
with col3:
    if st.button("🔄 Actualizar"):
        st.rerun()

st.markdown("---")

if not connected:
    st.error("❌ No se puede conectar con el servidor en " + API_URL)
else:
    # Tabs
    tab1, tab2, tab3 = st.tabs([
        "📋 Introducción",
        "🔧 Calculadora SKF",
        "⚙️ Configuración"
    ])
    
    with tab1:
        st.header("📋 Bienvenido al Sistema de Lubricación")
        st.write("""
        Sistema profesional de gestión de lubricación industrial.
        
        **Características:**
        - 🔧 Gestión de equipos
        - 📋 Plans de lubricación automáticos
        - 📊 Historial completo
        - 🧢 Calculadora SKF
        - 📊 Reportes y exportación
        
        **API Docs:** [Swagger UI](http://localhost:8000/api/docs)
        """)
    
    with tab2:
        st.subheader("🧢 Calculadora SKF")
        st.write("Fórmula: **G = 0.005 × D × B**")
        
        col1, col2 = st.columns(2)
        with col1:
            diametro = st.number_input("Diámetro (mm)", min_value=0.0, value=20.0)
        with col2:
            ancho = st.number_input("Ancho (mm)", min_value=0.0, value=10.0)
        
        if st.button("💰 Calcular"):
            cantidad = calcular_skf(diametro, ancho)
            if cantidad:
                st.success(f"**Cantidad recomendada: {cantidad:.2f}g**")
    
    with tab3:
        st.subheader(ℹ️ Información")
        st.write(f"**API URL:** {API_URL}")
        st.write(f"**Versión:** 1.0.0")
        st.write(f"**Fecha:** {datetime.now().strftime('%d/%m/%Y')}")

st.markdown("---")
st.caption("🔧 Gestión de Lubricación v1.0 | © 2026")