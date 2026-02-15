'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { SKFResult } from '@/types'
import { calcularSKF, getHealth } from '@/lib/api'
import {
  Wrench,
  Calculator,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Database,
  Server,
  Droplets,
  Info,
} from 'lucide-react'

export function HerramientasTab() {
  // SKF Calculator
  const [diametro, setDiametro] = useState('')
  const [ancho, setAncho] = useState('')
  const [skfResult, setSkfResult] = useState<SKFResult | null>(null)
  const [skfLoading, setSkfLoading] = useState(false)
  const [skfError, setSkfError] = useState<string | null>(null)

  // Health Check
  const [health, setHealth] = useState<{ status: string; database: string; timestamp: string } | null>(null)
  const [healthLoading, setHealthLoading] = useState(false)

  const handleCalcularSKF = async () => {
    const d = parseFloat(diametro)
    const b = parseFloat(ancho)
    if (isNaN(d) || isNaN(b) || d <= 0 || b <= 0) {
      setSkfError('Ingrese valores numéricos válidos mayores a 0')
      return
    }
    setSkfLoading(true)
    setSkfError(null)
    setSkfResult(null)
    try {
      const result = await calcularSKF(d, b)
      setSkfResult(result)
    } catch (err) {
      setSkfError(err instanceof Error ? err.message : 'Error al calcular')
    } finally {
      setSkfLoading(false)
    }
  }

  const handleHealthCheck = async () => {
    setHealthLoading(true)
    try {
      const result = await getHealth()
      setHealth(result)
    } catch {
      setHealth({ status: 'unhealthy', database: 'disconnected', timestamp: new Date().toISOString() })
    } finally {
      setHealthLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Herramientas</h2>
          <p className="text-sm text-gray-400">Calculadora SKF y diagnóstico del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SKF Calculator */}
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Calculadora SKF</h3>
              <p className="text-xs text-gray-400">Cantidad de grasa para rodamientos</p>
            </div>
          </div>

          {/* Formula info */}
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300 font-medium">Fórmula SKF</p>
                <p className="text-lg text-white font-mono mt-1">G = 0.005 × D × B</p>
                <p className="text-xs text-gray-400 mt-2">
                  G = cantidad de grasa (gramos), D = diámetro exterior (mm), B = ancho del rodamiento (mm)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Diámetro exterior (mm)</label>
              <input
                type="number"
                value={diametro}
                onChange={(e) => setDiametro(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                placeholder="Ej: 52"
                min={0}
                step={0.1}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Ancho del rodamiento (mm)</label>
              <input
                type="number"
                value={ancho}
                onChange={(e) => setAncho(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                placeholder="Ej: 15"
                min={0}
                step={0.1}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalcularSKF}
              disabled={skfLoading || !diametro || !ancho}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {skfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4" />
              )}
              Calcular Cantidad de Grasa
            </motion.button>
          </div>

          {skfError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{skfError}</span>
            </motion.div>
          )}

          {skfResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20"
            >
              <div className="text-center">
                <Droplets className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Cantidad de grasa recomendada</p>
                <p className="text-4xl font-bold text-orange-400 mt-1">
                  {skfResult.cantidad_gramos} <span className="text-lg text-gray-400">gramos</span>
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Diámetro</p>
                    <p className="text-white font-medium">{skfResult.diametro_mm} mm</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ancho</p>
                    <p className="text-white font-medium">{skfResult.ancho_mm} mm</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 font-mono">{skfResult.formula}</p>
              </div>
            </motion.div>
          )}
        </GlassPanel>

        {/* System Health */}
        <div className="space-y-6">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Estado del Sistema</h3>
                <p className="text-xs text-gray-400">Diagnóstico de la conexión</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHealthCheck}
              disabled={healthLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors text-sm mb-6"
            >
              {healthLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Server className="w-4 h-4" />
              )}
              Verificar Estado
            </motion.button>

            {health && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">API Backend</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${
                    health.status === 'healthy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {health.status === 'healthy' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {health.status === 'healthy' ? 'Conectado' : 'Desconectado'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Base de Datos</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${
                    health.database === 'connected' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {health.database === 'connected' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {health.database === 'connected' ? 'Conectada' : 'Desconectada'}
                  </div>
                </div>

                <p className="text-xs text-gray-600 text-center mt-2">
                  Última verificación: {new Date(health.timestamp).toLocaleString('es-CO')}
                </p>
              </motion.div>
            )}
          </GlassPanel>

          {/* Quick reference cards */}
          <GlassCard hover={false} className="p-6">
            <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">Referencia Rápida</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-gray-500">Criticidad A</p>
                <p className="text-sm text-red-400">Alta prioridad — Lubricación inmediata</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-gray-500">Criticidad B</p>
                <p className="text-sm text-yellow-400">Prioridad media — Programar pronto</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-gray-500">Criticidad C</p>
                <p className="text-sm text-blue-400">Baja prioridad — Según programa</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
