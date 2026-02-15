'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { Historial } from '@/types'
import { getHistorial } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import {
  History,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Search,
  ClipboardList,
  User,
  Calendar,
  Droplets,
  FileText,
} from 'lucide-react'

export function HistorialTab() {
  const [historial, setHistorial] = useState<Historial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(50)

  const fetchHistorial = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistorial(undefined, limit)
      setHistorial(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar historial')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => { fetchHistorial() }, [fetchHistorial])

  const filtered = historial.filter((h) => {
    const q = searchQuery.toLowerCase()
    return (
      h.tecnico.toLowerCase().includes(q) ||
      (h.observaciones || '').toLowerCase().includes(q) ||
      String(h.plan_id).includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Registros</p>
              <AnimatedCounter value={historial.length} className="text-3xl font-bold text-white" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Técnicos Únicos</p>
              <AnimatedCounter
                value={new Set(historial.map(h => h.tecnico)).size}
                className="text-3xl font-bold text-blue-400"
              />
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Grasa Total Aplicada</p>
              <AnimatedCounter
                value={Math.round(historial.reduce((sum, h) => sum + h.cantidad_aplicada, 0))}
                suffix="g"
                className="text-3xl font-bold text-green-400"
              />
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Toolbar */}
      <GlassPanel className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por técnico u observaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
              />
            </div>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500/60 focus:outline-none"
            >
              <option value={20}>20 registros</option>
              <option value={50}>50 registros</option>
              <option value={100}>100 registros</option>
            </select>
          </div>
          <button
            onClick={fetchHistorial}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors text-sm"
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
          <button onClick={fetchHistorial} className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors text-sm">
            Reintentar
          </button>
        </GlassPanel>
      ) : filtered.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Sin registros</h3>
          <p className="text-gray-400">No se encontraron registros de lubricación.</p>
        </GlassPanel>
      ) : (
        <GlassPanel>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Plan ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Técnico</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Cantidad (g)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Fecha Ejecución</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((h, idx) => (
                  <motion.tr
                    key={h.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-orange-500/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{h.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">Plan #{h.plan_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                          {h.tecnico.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-white">{h.tecnico}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <span className="inline-flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        {h.cantidad_aplicada}g
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(h.fecha_ejecucion)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                      {h.observaciones ? (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                          {h.observaciones}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
