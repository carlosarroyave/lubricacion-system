'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { PlanProximo } from '@/types'
import { getPlanesProximos, ejecutarLubricacion } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import {
  Droplets,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  MessageSquare,
  X,
} from 'lucide-react'

export function PlanesTab() {
  const [planes, setPlanes] = useState<PlanProximo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [diasFiltro, setDiasFiltro] = useState(7)
  const [ejecutandoPlan, setEjecutandoPlan] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanProximo | null>(null)
  const [formData, setFormData] = useState({ tecnico: '', cantidad_aplicada: 0, observaciones: '' })
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchPlanes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPlanesProximos(diasFiltro)
      setPlanes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes')
    } finally {
      setLoading(false)
    }
  }, [diasFiltro])

  useEffect(() => {
    fetchPlanes()
  }, [fetchPlanes])

  const vencidos = planes.filter(p => p.dias_restantes < 0)
  const hoy = planes.filter(p => p.dias_restantes >= 0 && p.dias_restantes <= 1)
  const proximos = planes.filter(p => p.dias_restantes > 1)

  const handleEjecutar = (plan: PlanProximo) => {
    setSelectedPlan(plan)
    setFormData({ tecnico: '', cantidad_aplicada: plan.cantidad_gramos || 0, observaciones: '' })
    setShowModal(true)
  }

  const handleSubmitEjecucion = async () => {
    if (!selectedPlan || !formData.tecnico.trim()) return
    setSubmitLoading(true)
    try {
      await ejecutarLubricacion(selectedPlan.id, {
        cantidad_aplicada: formData.cantidad_aplicada,
        tecnico: formData.tecnico,
        observaciones: formData.observaciones || null,
      })
      setShowModal(false)
      setSelectedPlan(null)
      fetchPlanes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ejecutar lubricación')
    } finally {
      setSubmitLoading(false)
    }
  }

  const getEstadoVariant = (estado: string): 'danger' | 'warning' | 'success' => {
    if (estado.includes('VENCIDO')) return 'danger'
    if (estado.includes('HOY') || estado.includes('MAÑANA')) return 'warning'
    return 'success'
  }

  const getCriticidadVariant = (c: string): 'danger' | 'warning' | 'info' => {
    if (c === 'A') return 'danger'
    if (c === 'B') return 'warning'
    return 'info'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Vencidos</p>
              <AnimatedCounter value={vencidos.length} className="text-3xl font-bold text-red-400" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Hoy / Mañana</p>
              <AnimatedCounter value={hoy.length} className="text-3xl font-bold text-yellow-400" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Próximos</p>
              <AnimatedCounter value={proximos.length} className="text-3xl font-bold text-green-400" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter controls */}
      <GlassPanel className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-300">Mostrar planes próximos en:</span>
            <div className="flex gap-2">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiasFiltro(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    diasFiltro === d
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {d} días
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={fetchPlanes}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </GlassPanel>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
        </div>
      ) : error ? (
        <GlassPanel className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchPlanes} className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors text-sm">
            Reintentar
          </button>
        </GlassPanel>
      ) : planes.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Droplets className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-white mb-2">Sin planes pendientes</h3>
          <p className="text-gray-400">No hay lubricaciones programadas en los próximos {diasFiltro} días.</p>
        </GlassPanel>
      ) : (
        <GlassPanel>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Equipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Criticidad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Lubricante</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Cantidad (g)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Próxima Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Días</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {planes.map((plan, idx) => (
                  <motion.tr
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-orange-500/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white font-medium">{plan.equipo_nombre}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={`Criticidad ${plan.criticidad}`} variant={getCriticidadVariant(plan.criticidad)} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{plan.tipo_lubricante || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{plan.cantidad_gramos ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {formatDate(plan.proxima_fecha)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${
                        plan.dias_restantes < 0 ? 'text-red-400' : plan.dias_restantes <= 1 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {plan.dias_restantes < 0 ? `${Math.abs(plan.dias_restantes)}d atraso` : `${plan.dias_restantes}d`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={plan.estado.replace(/[🔴🟡🟢]\s?/, '')}
                        variant={getEstadoVariant(plan.estado)}
                        animate={plan.dias_restantes < 0}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEjecutar(plan)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/40 transition-colors text-sm"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        Ejecutar
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      {/* Modal Ejecutar Lubricación */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-dark-800/90 backdrop-blur-xl border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Ejecutar Lubricación</h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400">Equipo</p>
                <p className="text-white font-medium">{selectedPlan.equipo_nombre}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPlan.tipo_lubricante} • {selectedPlan.cantidad_gramos}g recomendados
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Técnico *
                  </label>
                  <input
                    type="text"
                    value={formData.tecnico}
                    onChange={(e) => setFormData(prev => ({ ...prev, tecnico: e.target.value }))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                    placeholder="Nombre del técnico"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    <Droplets className="w-4 h-4 inline mr-1" />
                    Cantidad aplicada (g)
                  </label>
                  <input
                    type="number"
                    value={formData.cantidad_aplicada}
                    onChange={(e) => setFormData(prev => ({ ...prev, cantidad_aplicada: Number(e.target.value) }))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                    min={0}
                    step={0.1}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10 resize-none"
                    rows={3}
                    placeholder="Observaciones opcionales..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitEjecucion}
                  disabled={submitLoading || !formData.tecnico.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                >
                  {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Confirmar Ejecución
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
