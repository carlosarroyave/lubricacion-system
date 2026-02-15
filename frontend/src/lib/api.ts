import {
  Equipo,
  EquipoCreate,
  EquipoUpdate,
  PlanProximo,
  Historial,
  HistorialCreate,
  SKFResult,
  HealthCheck,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail || `Error ${res.status}`)
  }

  return res.json()
}

// ==================== EQUIPOS ====================

export async function getEquipos(skip = 0, limit = 50): Promise<Equipo[]> {
  return fetchAPI<Equipo[]>(`/api/equipos?skip=${skip}&limit=${limit}`)
}

export async function getEquipo(id: number): Promise<Equipo> {
  return fetchAPI<Equipo>(`/api/equipos/${id}`)
}

export async function createEquipo(data: EquipoCreate): Promise<Equipo> {
  return fetchAPI<Equipo>('/api/equipos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateEquipo(id: number, data: EquipoUpdate): Promise<Equipo> {
  return fetchAPI<Equipo>(`/api/equipos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteEquipo(id: number): Promise<void> {
  await fetchAPI(`/api/equipos/${id}`, { method: 'DELETE' })
}

export async function getHistorialEquipo(equipoId: number): Promise<Historial[]> {
  return fetchAPI<Historial[]>(`/api/equipos/${equipoId}/historial`)
}

// ==================== PLANES DE LUBRICACIÓN ====================

export async function getPlanesProximos(dias = 7): Promise<PlanProximo[]> {
  return fetchAPI<PlanProximo[]>(`/api/lubricacion/planes/proximos?dias=${dias}`)
}

// ==================== EJECUCIÓN / HISTORIAL ====================

export async function ejecutarLubricacion(planId: number, data: Omit<HistorialCreate, 'plan_id'>): Promise<Historial> {
  return fetchAPI<Historial>(`/api/lubricacion/ejecutar/${planId}`, {
    method: 'POST',
    body: JSON.stringify({ ...data, plan_id: planId }),
  })
}

export async function getHistorial(planId?: number, limit = 50): Promise<Historial[]> {
  const params = new URLSearchParams({ limit: String(limit) })
  if (planId) params.set('plan_id', String(planId))
  return fetchAPI<Historial[]>(`/api/lubricacion/historial?${params}`)
}

// ==================== HERRAMIENTAS ====================

export async function calcularSKF(diametroMm: number, anchoMm: number): Promise<SKFResult> {
  return fetchAPI<SKFResult>(
    `/api/lubricacion/calcular-skf?diametro_mm=${diametroMm}&ancho_mm=${anchoMm}`
  )
}

// ==================== HEALTH ====================

export async function getHealth(): Promise<HealthCheck> {
  return fetchAPI<HealthCheck>('/api/health')
}
