'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Equipo, PlanProximo, Historial } from '@/types'
import { getEquipos, getPlanesProximos, getHistorial } from '@/lib/api'
import {
  LayoutDashboard,
  Settings,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Clock,
  Loader2,
  TrendingUp,
  Users,
  Activity,
  RefreshCw,
} from 'lucide-react'

export function DashboardTab() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [planes, setPlanes] = useState<PlanProximo[]>([])
  const [historial, setHistorial] = useState<Historial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [eqs, pls, hist] = await Promise.all([
        getEquipos(0, 100),
        getPlanesProximos(30),
        getHistorial(undefined, 100),
      ])
      setEquipos(eqs)
      setPlanes(pls)
      setHistorial(hist)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const activos = equipos.filter(e => e.estado === 'ACTIVO').length
  const enMantenimiento = equipos.filter(e => e.estado === 'MANTENIMIENTO').length
  const vencidos = planes.filter(p => p.dias_restantes < 0).length
  const proximosHoy = planes.filter(p => p.dias_restantes >= 0 && p.dias_restantes <= 1).length
  const criticosA = equipos.filter(e => e.criticidad === 'A').length
  const totalGrasaAplicada = Math.round(historial.reduce((s, h) => s + h.cantidad_aplicada, 0))
  const tecnicosUnicos = new Set(historial.map(h => h.tecnico)).size

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <GlassPanel className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchAll} className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors text-sm">
          Reintentar
        </button>
      </GlassPanel>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard</h2>
            <p className="text-sm text-gray-400">Resumen general del sistema</p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Settings className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-500">equipos</span>
          </div>
          <AnimatedCounter value={equipos.length} className="text-3xl font-bold text-white" />
          <p className="text-sm text-gray-400 mt-1">Total Equipos</p>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-500">operativos</span>
          </div>
          <AnimatedCounter value={activos} className="text-3xl font-bold text-green-400" />
          <p className="text-sm text-gray-400 mt-1">Equipos Activos</p>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-500">atención</span>
          </div>
          <AnimatedCounter value={vencidos} className="text-3xl font-bold text-red-400" />
          <p className="text-sm text-gray-400 mt-1">Planes Vencidos</p>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-500">gramos</span>
          </div>
          <AnimatedCounter value={totalGrasaAplicada} suffix="g" className="text-3xl font-bold text-blue-400" />
          <p className="text-sm text-gray-400 mt-1">Grasa Aplicada</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: More stats */}
        <div className="space-y-4">
          <GlassPanel className="p-6">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">Resumen Operativo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">En Mantenimiento</span>
                </div>
                <span className="text-sm font-bold text-yellow-400">{enMantenimiento}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-gray-300">Hoy/Mañana</span>
                </div>
                <span className="text-sm font-bold text-orange-400">{proximosHoy}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-300">Criticidad A</span>
                </div>
                <span className="text-sm font-bold text-red-400">{criticosA}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Técnicos Activos</span>
                </div>
                <span className="text-sm font-bold text-blue-400">{tecnicosUnicos}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Ejecuciones</span>
                </div>
                <span className="text-sm font-bold text-green-400">{historial.length}</span>
              </div>
            </div>
          </GlassPanel>

          {/* Criticidad breakdown */}
          <GlassPanel className="p-6">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">Distribución Criticidad</h3>
            <div className="space-y-3">
              {(['A', 'B', 'C'] as const).map(crit => {
                const count = equipos.filter(e => e.criticidad === crit).length
                const pct = equipos.length ? Math.round((count / equipos.length) * 100) : 0
                const color = crit === 'A' ? 'bg-red-500' : crit === 'B' ? 'bg-yellow-500' : 'bg-blue-500'
                const textColor = crit === 'A' ? 'text-red-400' : crit === 'B' ? 'text-yellow-400' : 'text-blue-400'
                return (
                  <div key={crit}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={textColor}>Nivel {crit}</span>
                      <span className="text-gray-400">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${color}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassPanel>
        </div>

        {/* Center & Right: Planes vencidos list */}
        <div className="lg:col-span-2">
          <GlassPanel>
            <div className="p-6 border-b border-white/10">
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">
                Planes Próximos ({planes.length})
              </h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {planes.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-400">Todos los planes están al día</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {planes.slice(0, 15).map((plan, idx) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="p-4 hover:bg-orange-500/5 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          plan.dias_restantes < 0 ? 'bg-red-500 animate-pulse' : plan.dias_restantes <= 1 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="min-w-0">
                          <p className="text-sm text-white font-medium truncate">{plan.equipo_nombre}</p>
                          <p className="text-xs text-gray-500">
                            {plan.tipo_lubricante || 'Sin lubricante'} • {plan.cantidad_gramos || 0}g
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge
                          status={`Nivel ${plan.criticidad}`}
                          variant={plan.criticidad === 'A' ? 'danger' : plan.criticidad === 'B' ? 'warning' : 'info'}
                        />
                        <span className={`text-sm font-bold ${
                          plan.dias_restantes < 0 ? 'text-red-400' : plan.dias_restantes <= 1 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {plan.dias_restantes < 0 ? `${Math.abs(plan.dias_restantes)}d atraso` : `${plan.dias_restantes}d`}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
