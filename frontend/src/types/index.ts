// Types matching backend database models

// Enums matching backend
export type Criticidad = 'A' | 'B' | 'C'
export type EstadoEquipo = 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO'
export type Planta = 'TREN_1' | 'TREN_2'
export type TabType = 'planes' | 'equipos' | 'historial' | 'herramientas' | 'dashboard'

export const PLANTA_LABELS: Record<Planta, string> = {
  TREN_1: 'Tren 1',
  TREN_2: 'Tren 2',
}

// Equipo - matches backend Equipo model & EquipoResponse schema
export interface Equipo {
  id: number
  nombre: string
  planta: Planta
  componente: string | null
  criticidad: Criticidad
  ubicacion: string | null
  modelo_rodamiento: string | null
  tipo_lubricante: string | null
  cantidad_gramos: number | null
  frecuencia_dias: number
  estado: EstadoEquipo
  created_at: string
  updated_at: string
}

// Create/Update payloads matching backend schemas
export interface EquipoCreate {
  nombre: string
  planta: Planta
  componente?: string | null
  criticidad?: Criticidad
  ubicacion?: string | null
  modelo_rodamiento?: string | null
  tipo_lubricante?: string | null
  cantidad_gramos?: number | null
  frecuencia_dias?: number
}

export interface EquipoUpdate {
  nombre?: string
  planta?: Planta
  componente?: string | null
  criticidad?: Criticidad
  ubicacion?: string | null
  modelo_rodamiento?: string | null
  tipo_lubricante?: string | null
  cantidad_gramos?: number | null
  frecuencia_dias?: number
  estado?: EstadoEquipo
}

// PlanLubricacion - matches backend PlanLubricacion model
export interface PlanLubricacion {
  id: number
  equipo_id: number
  tipo_lubricante: string | null
  cantidad_gramos: number | null
  frecuencia_dias: number
  ultima_fecha_lubricacion: string
  proxima_fecha_lubricacion: string
  created_at: string
  updated_at: string
}

// Plan próximo - matches the response from /api/lubricacion/planes/proximos
export interface PlanProximo {
  id: number
  equipo_id: number
  equipo_nombre: string
  equipo_planta: Planta
  criticidad: Criticidad
  tipo_lubricante: string | null
  cantidad_gramos: number | null
  proxima_fecha: string
  dias_restantes: number
  estado: string
}

// Historial - matches backend Historial model & HistorialResponse schema
export interface Historial {
  id: number
  plan_id: number
  cantidad_aplicada: number
  tecnico: string
  fecha_ejecucion: string
  observaciones: string | null
  created_at: string
}

// Create payload
export interface HistorialCreate {
  plan_id: number
  cantidad_aplicada: number
  tecnico: string
  observaciones?: string | null
  fecha_ejecucion?: string | null
}

// SKF Calculation response
export interface SKFResult {
  diametro_mm: number
  ancho_mm: number
  cantidad_gramos: number
  formula: string
}

// Health check response  
export interface HealthCheck {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  database: 'connected' | 'disconnected'
  error?: string
}

// Dashboard stats (computed from API data)
export interface DashboardStats {
  totalEquipos: number
  equiposActivos: number
  equiposMantenimiento: number
  planesVencidos: number
  planesProximos: number
  totalEjecuciones: number
}
