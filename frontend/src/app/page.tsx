"use client";

import { usePlanesProximos } from "@/lib/hooks";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { OilDropAnimation } from "@/components/illustrations/OilDropAnimation";
import { getCriticidadColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const { data: planes, isLoading } = usePlanesProximos(7);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  if (isLoading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  const criticos = planes?.filter((p) => p.criticidad === "A") || [];
  const medios = planes?.filter((p) => p.criticidad === "B") || [];
  const bajos = planes?.filter((p) => p.criticidad === "C") || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <OilDropAnimation className="w-16 h-16 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Pool de Lubricación</h1>
          <p className="text-gray-600">
            Equipos pendientes de lubricar en los próximos 7 días
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="text-center">
          <div className="text-4xl font-bold text-red-500">
            {criticos.length}
          </div>
          <div className="text-sm text-gray-600 mt-2">🔴 Críticos</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-4xl font-bold text-yellow-500">
            {medios.length}
          </div>
          <div className="text-sm text-gray-600 mt-2">🟡 Medios</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-4xl font-bold text-green-500">
            {bajos.length}
          </div>
          <div className="text-sm text-gray-600 mt-2">🟢 Bajos</div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        {planes?.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-gray-600">
              ✅ No hay equipos pendientes de lubricar
            </p>
          </GlassCard>
        ) : (
          planes?.map((plan, index) => {
            const color = getCriticidadColor(plan.criticidad);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard
                  className="hover:scale-[1.01] transition-transform"
                  style={{
                    borderColor: color.border,
                    background: `linear-gradient(135deg, ${color.bg}, rgba(255,255,255,0.1))`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {plan.equipo_nombre}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <div>
                          Criticidad:{" "}
                          <span
                            className="font-medium"
                            style={{ color: color.text }}
                          >
                            {color.label}
                          </span>
                        </div>
                        <div>Lubricante: {plan.tipo_lubricante || "N/A"}</div>
                        <div>Cantidad: {plan.cantidad_gramos}g</div>
                        <div
                          className="font-medium"
                          style={{
                            color:
                              plan.dias_restantes < 0
                                ? "#EF4444"
                                : plan.dias_restantes <= 1
                                  ? "#F59E0B"
                                  : "#10B981",
                          }}
                        >
                          {plan.estado} ({plan.dias_restantes} días)
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedPlan(plan.id)}>
                      ✅ Registrar
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
