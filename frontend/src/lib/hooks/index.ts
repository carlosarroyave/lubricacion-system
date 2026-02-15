"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import type {
  HealthResponse,
  EquipoResponse,
  EquipoCreate,
  EquipoUpdate,
  PlanProximo,
  HistorialResponse,
  HistorialCreate,
  SKFResult,
} from "../types";
import { toast } from "sonner";

// Health
export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: api.health,
    refetchInterval: 30000,
    retry: 1,
  });
}

// Equipos
export function useEquipos(skip: number = 0, limit: number = 50) {
  return useQuery<EquipoResponse[]>({
    queryKey: ["equipos", skip, limit],
    queryFn: () => api.getEquipos(skip, limit),
  });
}

export function useEquipo(id: number) {
  return useQuery<EquipoResponse>({
    queryKey: ["equipo", id],
    queryFn: () => api.getEquipo(id),
    enabled: !!id,
  });
}

export function useCreateEquipo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EquipoCreate) => api.createEquipo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipos"] });
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      toast.success("✅ Equipo creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`❌ Error: ${error.message}`);
    },
  });
}

export function useUpdateEquipo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EquipoUpdate }) =>
      api.updateEquipo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipos"] });
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      toast.success("✅ Equipo actualizado");
    },
    onError: (error: Error) => {
      toast.error(`❌ Error: ${error.message}`);
    },
  });
}

export function useDeleteEquipo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deleteEquipo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipos"] });
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      toast.success("✅ Equipo eliminado");
    },
    onError: (error: Error) => {
      toast.error(`❌ Error: ${error.message}`);
    },
  });
}

// Planes
export function usePlanesProximos(dias: number = 7) {
  return useQuery<PlanProximo[]>({
    queryKey: ["planes", dias],
    queryFn: () => api.getPlanesProximos(dias),
  });
}

// Historial
export function useHistorial(planId?: number, limit: number = 50) {
  return useQuery<HistorialResponse[]>({
    queryKey: ["historial", planId, limit],
    queryFn: () => api.getHistorial(planId, limit),
  });
}

export function useRegistrarLubricacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, data }: { planId: number; data: HistorialCreate }) =>
      api.registrarLubricacion(planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      queryClient.invalidateQueries({ queryKey: ["historial"] });
      toast.success("✅ Lubricación registrada");
    },
    onError: (error: Error) => {
      toast.error(`❌ Error: ${error.message}`);
    },
  });
}

// SKF Calculator
export function useCalcularSKF(diametro: number, ancho: number) {
  return useQuery<SKFResult>({
    queryKey: ["skf", diametro, ancho],
    queryFn: () => api.calcularSKF(diametro, ancho),
    enabled: diametro > 0 && ancho > 0,
  });
}
