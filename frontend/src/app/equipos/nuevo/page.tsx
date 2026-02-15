"use client";

import { useCreateEquipo } from "@/lib/hooks";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipoCreateSchema, type EquipoCreateInput } from "@/lib/validations";

export default function NuevoEquipoPage() {
  const { mutate: createEquipo, isPending } = useCreateEquipo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipoCreateInput>({
    resolver: zodResolver(equipoCreateSchema),
    defaultValues: {
      criticidad: "B",
      frecuencia_dias: 30,
      cantidad_gramos: 15,
    },
  });

  const onSubmit = (data: EquipoCreateInput) => {
    createEquipo(data as any, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">➕ Nuevo Equipo</h1>

      <GlassCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" {...register("nombre")} />
            <Input label="Componente" {...register("componente")} />

            <div>
              <label className="text-sm font-medium text-gray-700">
                Criticidad
              </label>
              <select
                {...register("criticidad")}
                className="flex h-10 w-full glass-input px-3 py-2 text-sm mt-2"
              >
                <option value="A">A - Crítica</option>
                <option value="B">B - Media</option>
                <option value="C">C - Baja</option>
              </select>
            </div>

            <Input label="Ubicación" {...register("ubicacion")} />
            <Input
              label="Modelo Rodamiento"
              {...register("modelo_rodamiento")}
            />
            <Input
              label="Tipo Lubricante"
              {...register("tipo_lubricante")}
            />

            <Input
              type="number"
              label="Cantidad (g)"
              step="0.1"
              {...register("cantidad_gramos", { valueAsNumber: true })}
            />
            <Input
              type="number"
              label="Frecuencia (días)"
              {...register("frecuencia_dias", { valueAsNumber: true })}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "✅ Registrar Equipo"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => reset()}>
              🔄 Limpiar
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
