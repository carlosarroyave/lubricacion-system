"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCalcularSKF } from "@/lib/hooks";

export default function HerramientasPage() {
  const [diametro, setDiametro] = useState(20);
  const [ancho, setAncho] = useState(10);
  const [enabled, setEnabled] = useState(false);

  const { data: resultado } = useCalcularSKF(
    enabled ? diametro : 0,
    enabled ? ancho : 0
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">⚙️ Herramientas</h1>

      <GlassCard>
        <h2 className="text-xl font-bold mb-4">📐 Calculadora SKF</h2>
        <p className="text-sm text-gray-600 mb-6">
          Calcula la cantidad de grasa según la fórmula SKF
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Diámetro (mm)"
              value={diametro}
              onChange={(e) => setDiametro(parseFloat(e.target.value) || 0)}
            />
            <Input
              type="number"
              label="Ancho (mm)"
              value={ancho}
              onChange={(e) => setAncho(parseFloat(e.target.value) || 0)}
            />
          </div>

          <Button
            onClick={() => setEnabled(true)}
            disabled={diametro <= 0 || ancho <= 0}
          >
            📐 Calcular
          </Button>

          {resultado && (
            <GlassCard className="mt-6 bg-blue-500/10 border-blue-500/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {resultado.cantidad_gramos.toFixed(2)}g
                </div>
                <div className="text-sm text-gray-600">
                  Fórmula: {resultado.formula}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Diámetro: {resultado.diametro_mm}mm × Ancho:{" "}
                  {resultado.ancho_mm}mm
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
