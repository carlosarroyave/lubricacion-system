// ========== Enums ==========
export type Criticidad = "A" | "B" | "C";
export type EstadoEquipo = "ACTIVO" | "INACTIVO" | "MANTENIMIENTO";
export type EstadoPlan = "🔴 VENCIDO" | "🟡 HOY/MAÑANA" | "🟢 PRÓXIMOS";
export type Rol = "admin" | "supervisor" | "tecnico";

// ========== Equipo ==========
export interface EquipoCreate {
  nombre: string;
  componente?: string | null;
  criticidad: Criticidad;
  ubicacion?: string | null;
  modelo_rodamiento?: string | null;
  tipo_lubricante?: string | null;
  cantidad_gramos?: number | null;
  frecuencia_dias: number;
}

export interface EquipoUpdate {
  nombre?: string | null;
  componente?: string | null;
  criticidad?: Criticidad | null;
  ubicacion?: string | null;
  modelo_rodamiento?: string | null;
  tipo_lubricante?: string | null;
  cantidad_gramos?: number | null;
  frecuencia_dias?: number | null;
  estado?: string | null;
}

export interface EquipoResponse extends EquipoCreate {
  id: number;
  estado: EstadoEquipo;
  created_at: string;
  updated_at: string;
}

// ========== Historial ==========
export interface HistorialCreate {
  plan_id: number;
  cantidad_aplicada: number;
  tecnico: string;
  observaciones?: string | null;
  fecha_ejecucion?: string | null;
}

export interface HistorialResponse {
  id: number;
  plan_id: number;
  cantidad_aplicada: number;
  tecnico: string;
  fecha_ejecucion: string;
  observaciones?: string | null;
  created_at: string;
}

// ========== Plan ==========
export interface PlanResponse {
  id: number;
  equipo_id: number;
  tipo_lubricante?: string | null;
  cantidad_gramos?: number | null;
  frecuencia_dias: number;
  ultima_fecha_lubricacion: string;
  proxima_fecha_lubricacion: string;
  created_at: string;
  updated_at: string;
}

export interface PlanProximo {
  id: number;
  equipo_id: number;
  equipo_nombre: string;
  criticidad: Criticidad;
  tipo_lubricante: string;
  cantidad_gramos: number;
  proxima_fecha: string;
  dias_restantes: number;
  estado: EstadoPlan;
}

// ========== SKF Result ==========
export interface SKFResult {
  diametro_mm: number;
  ancho_mm: number;
  cantidad_gramos: number;
  formula: string;
}

// ========== Health ==========
export interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  database: "connected" | "disconnected";
  error?: string;
}

// ========== Usuario ==========
export interface UsuarioCreate {
  nombre: string;
  email: string;
  rol: Rol;
  password: string;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}
