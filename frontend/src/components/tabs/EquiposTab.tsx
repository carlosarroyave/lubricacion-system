'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { Equipo, EquipoCreate, EquipoUpdate, Criticidad, EstadoEquipo } from '@/types'
import { getEquipos, createEquipo, updateEquipo, deleteEquipo } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import {
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle,
  Filter,
} from 'lucide-react'

const CRITICIDAD_OPTIONS: Criticidad[] = ['A', 'B', 'C']
const ESTADO_OPTIONS: EstadoEquipo[] = ['ACTIVO', 'INACTIVO', 'MANTENIMIENTO']

const emptyForm: EquipoCreate = {
  nombre: '',
  componente: '',
  criticidad: 'B',
  ubicacion: '',
  modelo_rodamiento: '',
  tipo_lubricante: '',
  cantidad_gramos: 0,
  frecuencia_dias: 30,
}

export function EquiposTab() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<EstadoEquipo | 'TODOS'>('TODOS')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null)
  const [formData, setFormData] = useState<EquipoCreate>(emptyForm)
  const [formEstado, setFormEstado] = useState<EstadoEquipo>('ACTIVO')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  const fetchEquipos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEquipos(0, 100)
      setEquipos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar equipos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEquipos() }, [fetchEquipos])

  const filteredEquipos = equipos.filter((e) => {
    const matchSearch =
      e.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.componente || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.ubicacion || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchEstado = filtroEstado === 'TODOS' || e.estado === filtroEstado
    return matchSearch && matchEstado
  })

  const activos = equipos.filter((e) => e.estado === 'ACTIVO').length
  const mantenimiento = equipos.filter((e) => e.estado === 'MANTENIMIENTO').length
  const inactivos = equipos.filter((e) => e.estado === 'INACTIVO').length

  const openCreate = () => {
    setEditingEquipo(null)
    setFormData(emptyForm)
    setFormEstado('ACTIVO')
    setShowModal(true)
  }

  const openEdit = (eq: Equipo) => {
    setEditingEquipo(eq)
    setFormData({
      nombre: eq.nombre,
      componente: eq.componente,
      criticidad: eq.criticidad,
      ubicacion: eq.ubicacion,
      modelo_rodamiento: eq.modelo_rodamiento,
      tipo_lubricante: eq.tipo_lubricante,
      cantidad_gramos: eq.cantidad_gramos,
      frecuencia_dias: eq.frecuencia_dias,
    })
    setFormEstado(eq.estado)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) return
    setSubmitLoading(true)
    try {
      if (editingEquipo) {
        const updateData: EquipoUpdate = { ...formData, estado: formEstado }
        await updateEquipo(editingEquipo.id, updateData)
      } else {
        await createEquipo(formData)
      }
      setShowModal(false)
      fetchEquipos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar equipo')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desactivar este equipo?')) return
    setDeleteLoading(id)
    try {
      await deleteEquipo(id)
      fetchEquipos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar equipo')
    } finally {
      setDeleteLoading(null)
    }
  }

  const getCriticidadVariant = (c: Criticidad): 'danger' | 'warning' | 'info' => {
    if (c === 'A') return 'danger'
    if (c === 'B') return 'warning'
    return 'info'
  }

  const getEstadoVariant = (e: EstadoEquipo): 'success' | 'danger' | 'warning' => {
    if (e === 'ACTIVO') return 'success'
    if (e === 'MANTENIMIENTO') return 'warning'
    return 'danger'
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Equipos</p>
              <AnimatedCounter value={equipos.length} className="text-3xl font-bold text-white" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Activos</p>
              <AnimatedCounter value={activos} className="text-3xl font-bold text-green-400" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Mantenimiento</p>
              <AnimatedCounter value={mantenimiento} className="text-3xl font-bold text-yellow-400" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Inactivos</p>
              <AnimatedCounter value={inactivos} className="text-3xl font-bold text-red-400" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-400" />
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
                placeholder="Buscar equipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as EstadoEquipo | 'TODOS')}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500/60 focus:outline-none"
              >
                <option value="TODOS">Todos</option>
                <option value="ACTIVO">Activos</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
                <option value="INACTIVO">Inactivos</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchEquipos}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              Nuevo Equipo
            </motion.button>
          </div>
        </div>
      </GlassPanel>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
        </div>
      ) : error ? (
        <GlassPanel className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchEquipos} className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors text-sm">
            Reintentar
          </button>
        </GlassPanel>
      ) : filteredEquipos.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Sin equipos</h3>
          <p className="text-gray-400 mb-4">No se encontraron equipos con los filtros aplicados.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Crear primer equipo
          </motion.button>
        </GlassPanel>
      ) : (
        <GlassPanel>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Componente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Criticidad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Lubricante</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Frecuencia</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEquipos.map((eq, idx) => (
                  <motion.tr
                    key={eq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-orange-500/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white font-medium">{eq.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{eq.componente || '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={`Nivel ${eq.criticidad}`} variant={getCriticidadVariant(eq.criticidad)} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{eq.ubicacion || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {eq.tipo_lubricante || '—'}
                      {eq.cantidad_gramos ? ` (${eq.cantidad_gramos}g)` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{eq.frecuencia_dias}d</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={eq.estado} variant={getEstadoVariant(eq.estado)} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(eq)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-orange-400 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(eq.id)}
                          disabled={deleteLoading === eq.id}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Desactivar"
                        >
                          {deleteLoading === eq.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
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
              className="w-full max-w-lg rounded-2xl bg-dark-800/90 backdrop-blur-xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                    placeholder="Ej: Bomba centrífuga #1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Componente</label>
                    <input
                      type="text"
                      value={formData.componente || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, componente: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                      placeholder="Ej: Rodamiento principal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Criticidad</label>
                    <select
                      value={formData.criticidad}
                      onChange={(e) => setFormData(prev => ({ ...prev, criticidad: e.target.value as Criticidad }))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none"
                    >
                      {CRITICIDAD_OPTIONS.map(c => (
                        <option key={c} value={c}>Nivel {c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={formData.ubicacion || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                      placeholder="Ej: Planta A - Línea 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Modelo Rodamiento</label>
                    <input
                      type="text"
                      value={formData.modelo_rodamiento || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, modelo_rodamiento: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                      placeholder="Ej: SKF 6205-2Z"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tipo Lubricante</label>
                    <input
                      type="text"
                      value={formData.tipo_lubricante || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo_lubricante: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                      placeholder="Ej: LGMT 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cantidad (g)</label>
                    <input
                      type="number"
                      value={formData.cantidad_gramos || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, cantidad_gramos: Number(e.target.value) }))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                      min={0}
                      step={0.1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Frecuencia (días)</label>
                    <input
                      type="number"
                      value={formData.frecuencia_dias}
                      onChange={(e) => setFormData(prev => ({ ...prev, frecuencia_dias: Number(e.target.value) }))}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                      min={1}
                    />
                  </div>
                  {editingEquipo && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Estado</label>
                      <select
                        value={formEstado}
                        onChange={(e) => setFormEstado(e.target.value as EstadoEquipo)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-500/60 focus:outline-none"
                      >
                        {ESTADO_OPTIONS.map(e => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  )}
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
                  onClick={handleSubmit}
                  disabled={submitLoading || !formData.nombre.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                >
                  {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {editingEquipo ? 'Actualizar' : 'Crear Equipo'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
