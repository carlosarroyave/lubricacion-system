const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const DEFAULT_TIMEOUT = 10000;
const HEALTH_TIMEOUT = 5000;

import type {
  HealthResponse,
  EquipoResponse,
  EquipoCreate, 
  EquipoUpdate,
  PlanProximo,
  HistorialResponse,
  HistorialCreate,
  SKFResult,
} from "./types";

class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if ((error as Error).name === "AbortError") {
      throw new APIError("Tiempo de espera agotado");
    }
    throw error;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
      throw new APIError(errorMessage, response.status, errorData);
    } catch (e) {
      if (e instanceof APIError) throw e;
      throw new APIError(errorMessage, response.status);
    }
  }

  return response.json();
}

export const api = {
  // Health check
  health: async (): Promise<HealthResponse> => {
    const response = await fetchWithTimeout(
      `${API_URL}/api/health`,
      {},
      HEALTH_TIMEOUT
    );
    return handleResponse<HealthResponse>(response);
  },

  // Equipos
  getEquipos: async (skip: number = 0, limit: number = 50): Promise<EquipoResponse[]> => {
    const response = await fetchWithTimeout(
      `${API_URL}/api/equipos?skip=${skip}&limit=${limit}`
    );
    return handleResponse<EquipoResponse[]>(response);
  },

  getEquipo: async (id: number): Promise<EquipoResponse> => {
    const response = await fetchWithTimeout(`${API_URL}/api/equipos/${id}`);
    return handleResponse<EquipoResponse>(response);
  },

  createEquipo: async (data: EquipoCreate): Promise<EquipoResponse> => {
    const response = await fetchWithTimeout(`${API_URL}/api/equipos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<EquipoResponse>(response);
  },

  updateEquipo: async (id: number, data: EquipoUpdate): Promise<EquipoResponse> => {
    const response = await fetchWithTimeout(`${API_URL}/api/equipos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<EquipoResponse>(response);
  },

  deleteEquipo: async (id: number): Promise<void> => {
    const response = await fetchWithTimeout(`${API_URL}/api/equipos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new APIError(`Failed to delete equipo ${id}`, response.status);
    }
  },

  // Lubricación
  getPlanesProximos: async (dias: number = 7): Promise<PlanProximo[]> => {
    const response = await fetchWithTimeout(
      `${API_URL}/api/lubricacion/planes/proximos?dias=${dias}`
    );
    return handleResponse<PlanProximo[]>(response);
  },

  registrarLubricacion: async (planId: number, data: HistorialCreate): Promise<HistorialResponse> => {
    const response = await fetchWithTimeout(
      `${API_URL}/api/lubricacion/ejecutar/${planId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return handleResponse<HistorialResponse>(response);
  },

  getHistorial: async (planId?: number, limit: number = 50): Promise<HistorialResponse[]> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (planId) params.append("plan_id", planId.toString());
    const response = await fetchWithTimeout(
      `${API_URL}/api/lubricacion/historial?${params}`
    );
    return handleResponse<HistorialResponse[]>(response);
  },

  calcularSKF: async (diametroMm: number, anchoMm: number): Promise<SKFResult> => {
    const response = await fetchWithTimeout(
      `${API_URL}/api/lubricacion/calcular-skf?diametro_mm=${diametroMm}&ancho_mm=${anchoMm}`
    );
    return handleResponse<SKFResult>(response);
  },
};

export { APIError };
export { API_URL };
