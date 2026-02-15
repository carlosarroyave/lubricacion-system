import { z } from "zod";

export const equipoCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(150),
  componente: z.string().max(150).optional().nullable(),
  criticidad: z.enum(["A", "B", "C"]),
  ubicacion: z.string().max(200).optional().nullable(),
  modelo_rodamiento: z.string().max(100).optional().nullable(),
  tipo_lubricante: z.string().max(100).optional().nullable(),
  cantidad_gramos: z.number().min(0).optional().nullable(),
  frecuencia_dias: z.number().int().min(1),
});

export const equipoUpdateSchema = z.object({
  nombre: z.string().min(1).max(150).optional().nullable(),
  componente: z.string().max(150).optional().nullable(),
  criticidad: z.enum(["A", "B", "C"]).optional().nullable(),
  ubicacion: z.string().max(200).optional().nullable(),
  modelo_rodamiento: z.string().max(100).optional().nullable(),
  tipo_lubricante: z.string().max(100).optional().nullable(),
  cantidad_gramos: z.number().min(0).optional().nullable(),
  frecuencia_dias: z.number().int().min(1).optional().nullable(),
  estado: z.string().optional().nullable(),
});

export const historialCreateSchema = z.object({
  plan_id: z.number().int(),
  cantidad_aplicada: z.number().positive("La cantidad debe ser mayor a 0"),
  tecnico: z.string().min(1, "El técnico es requerido").max(100),
  observaciones: z.string().optional().nullable(),
  fecha_ejecucion: z.string().optional().nullable(),
});

export const skfCalculateSchema = z.object({
  diametro_mm: z.number().positive("El diámetro debe ser mayor a 0"),
  ancho_mm: z.number().positive("El ancho debe ser mayor a 0"),
});

export type EquipoCreateInput = z.infer<typeof equipoCreateSchema>;
export type EquipoUpdateInput = z.infer<typeof equipoUpdateSchema>;
export type HistorialCreateInput = z.infer<typeof historialCreateSchema>;
export type SKFCalculateInput = z.infer<typeof skfCalculateSchema>;
