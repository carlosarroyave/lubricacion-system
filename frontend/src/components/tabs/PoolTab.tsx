'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { DataTable } from '@/components/ui/DataTable'
import { LubricationPoint } from '@/types'
import { Plus, Edit, MoreVertical, Droplets, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

const stats = [
  { label: 'Puntos Activos', value: 1247, change: '+12%', icon: Droplets, color: 'green' },
  { label: 'Próximos a Vencer', value: 23, change: 'Urgente', icon: Clock, color: 'orange' },
  { label: 'Completados Hoy', value: 856, change: '98%', icon: CheckCircle2, color: 'purple' },
  { label: 'Alertas Críticas', value: 5, change: 'Atención', icon: AlertTriangle, color: 'red' },
]

const poolData: LubricationPoint[] = [
  { id: 'LUB-001', equipment: 'Compresor A-101', lubricantType: 'ISO VG 68', frequency: 'Semanal', lastDate: '2026-02-12', nextDate: '2026-02-19', status: 'active' },
  { id: 'LUB-002', equipment: 'Bomba Centrífuga B-205', lubricantType: 'ISO VG 46', frequency: 'Mensual', lastDate: '2026-01-15', nextDate: '2026-02-15', status: 'expired' },
  { id: 'LUB-003', equipment: 'Motor Eléctrico M-450', lubricantType: 'Grasa NLGI 2', frequency: 'Trimestral', lastDate: '2025-11-10', nextDate: '2026-02-10', status: 'upcoming' },
  { id: 'LUB-004', equipment: 'Reductor R-120', lubricantType: 'ISO VG 220', frequency: 'Semestral', lastDate: '2025-12-05', nextDate: '2026-06-05', status: 'scheduled' },
  { id: 'LUB-005', equipment: 'Ventilador V-88', lubricantType: 'ISO VG 32', frequency: 'Quincenal', lastDate: '2026-02-01', nextDate: '2026-02-15', status: 'active' },
]

const colorMap: Record<string, { bg: string; text: string; bgLight: string }> = {
  green: { bg: 'bg-green-500', text: 'text-green-400', bgLight: 'bg-green-500/20' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', bgLight: 'bg-orange-500/20' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', bgLight: 'bg-purple-500/20' },
  red: { bg: 'bg-red-500', text: 'text-red-400', bgLight: 'bg-red-500/20' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
}

export function PoolTab() {
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'active': return 'success' as const
      case 'expired': return 'danger' as const
      case 'upcoming': return 'warning' as const
      case 'scheduled': return 'info' as const
      default: return 'neutral' as const
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Activo'
      case 'expired': return 'Vencido'
      case 'upcoming': return 'Próximo'
      case 'scheduled': return 'Programado'
      default: return status
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2">Pool de Lubricación</h1>
        <p className="text-gray-400">Gestión centralizada de puntos de lubricación activos</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const colors = colorMap[stat.color]
          const Icon = stat.icon
          return (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bgLight} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <span className={`text-xs font-medium ${colors.text} ${colors.bgLight} px-2 py-1 rounded-full`}>
                  {stat.change}
                </span>
              </div>
              <AnimatedCounter value={stat.value} className="text-2xl font-bold text-white" />
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </GlassCard>
          )
        })}
      </motion.div>

      {/* Data Table */}
      <motion.div variants={itemVariants}>
        <DataTable
          title="Listado de Puntos de Lubricación"
          searchPlaceholder="Buscar punto..."
          data={poolData}
          keyExtractor={(item) => item.id}
          actions={
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Punto
            </button>
          }
          columns={[
            { key: 'id', header: 'ID Punto', render: (item) => <span className="font-medium text-white">{item.id}</span> },
            { key: 'equipment', header: 'Equipo', render: (item) => <span className="text-gray-300">{item.equipment}</span> },
            { key: 'lubricantType', header: 'Tipo Lubricante', render: (item) => <span className="text-gray-300">{item.lubricantType}</span> },
            { key: 'frequency', header: 'Frecuencia', render: (item) => <span className="text-gray-300">{item.frequency}</span> },
            { key: 'lastDate', header: 'Última Fecha', render: (item) => <span className="text-gray-400">{item.lastDate}</span> },
            { 
              key: 'nextDate', 
              header: 'Próxima Fecha',
              render: (item) => (
                <span className={item.status === 'expired' ? 'text-red-400 font-medium' : 'text-orange-400 font-medium'}>
                  {item.nextDate}
                </span>
              )
            },
            { 
              key: 'status', 
              header: 'Estado',
              render: (item) => (
                <StatusBadge 
                  status={getStatusLabel(item.status)} 
                  variant={getStatusVariant(item.status)}
                  animate={item.status === 'expired'}
                />
              )
            },
            {
              key: 'actions',
              header: '',
              render: () => (
                <div className="flex justify-end gap-2">
                  <button className="p-1 text-orange-400 hover:text-orange-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              )
            },
          ]}
        />
      </motion.div>
    </motion.div>
  )
}
