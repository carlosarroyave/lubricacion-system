"use client";

import { useEquipos, useDeleteEquipo } from "@/lib/hooks";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { generateCSV, formatDate } from "@/lib/utils";

export default function InventarioPage() {
  const { data: equipos, isLoading } = useEquipos();
  const { mutate: deleteEquipo } = useDeleteEquipo();

  const handleExport = () => {
    if (equipos) {
      generateCSV(
        equipos.map((e) => ({
          ID: e.id,
          Nombre: e.nombre,
          Componente: e.componente || "",
          Criticidad: e.criticidad,
          Ubicacion: e.ubicacion || "",
          Estado: e.estado,
          Creado: formatDate(e.created_at),
        })),
        `equipos_${new Date().toISOString().split("T")[0]}.csv`
      );
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📦 Inventario de Equipos</h1>
        <Button onClick={handleExport}>📥 Exportar CSV</Button>
      </div>

      <div className="space-y-4">
        {equipos?.map((equipo) => (
          <GlassCard key={equipo.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{equipo.nombre}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <span>ID: {equipo.id}</span>
                  <span className="ml-4">
                    Criticidad: {equipo.criticidad}
                  </span>
                  <span className="ml-4">Estado: {equipo.estado}</span>
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm("¿Eliminar este equipo?")) {
                    deleteEquipo(equipo.id);
                  }
                }}
              >
                ❌ Eliminar
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
