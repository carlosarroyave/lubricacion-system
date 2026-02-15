"use client";

import { useHistorial } from "@/lib/hooks";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { generateCSV, formatDateTime } from "@/lib/utils";

export default function HistorialPage() {
  const { data: historial, isLoading } = useHistorial();

  const handleExport = () => {
    if (historial) {
      generateCSV(
        historial.map((h) => ({
          ID: h.id,
          Plan: h.plan_id,
          Fecha: formatDateTime(h.fecha_ejecucion),
          Cantidad: h.cantidad_aplicada,
          Tecnico: h.tecnico,
          Observaciones: h.observaciones || "",
        })),
        `historial_${new Date().toISOString().split("T")[0]}.csv`
      );
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📈 Historial de Lubricación</h1>
        <Button onClick={handleExport}>📥 Exportar CSV</Button>
      </div>

      <div className="space-y-4">
        {historial?.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-gray-600">No hay registros en el historial</p>
          </GlassCard>
        ) : (
          historial?.map((record) => (
            <GlassCard key={record.id}>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Fecha:</span>
                  <div className="font-medium">
                    {formatDateTime(record.fecha_ejecucion)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Técnico:</span>
                  <div className="font-medium">{record.tecnico}</div>
                </div>
                <div>
                  <span className="text-gray-600">Cantidad:</span>
                  <div className="font-medium">{record.cantidad_aplicada}g</div>
                </div>
                <div>
                  <span className="text-gray-600">Observaciones:</span>
                  <div className="font-medium">
                    {record.observaciones || "—"}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
