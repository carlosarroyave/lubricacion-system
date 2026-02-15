'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { HistoryEntry } from '@/types'
import { 
  CheckCircle2, 
  Clock, 
  Eye, 
  User, 
  ClipboardCheck,
  Filter
} from 'lucide-react'

const historyData: HistoryEntry[] = [
  {
    id: '1',
    timestamp: 'Hoy, 14:30',
    title: 'Lubricación Programada Completada',
    description: 'Equipo: Compresor A-101 | Punto: LUB-001 | Lubricante: ISO VG 68',
    technician: 'Juan Pérez',
    status: 'completed',
    type: 'routine'
  },
  {
    id: '2',
    timestamp: 'Hoy, 11:15',
    title: 'Cambio de Lubricante',
    description: 'Equipo: Reductor R-120 | Tipo: ISO VG 220 | Motivo: Contaminación',
    technician: 'Carlos López',
    status: 'in-progress',
    type: 'change'
  },
  {
    id: '3',
    timestamp: 'Ayer, 16:45',
    title: 'Inspección Visual',
    description: 'Equipo: Bomba Centrífuga B-205 | Estado: Normal | Nivel: OK',
    technician: 'Ana García',
    status: 'registered',
    type: 'inspection'
  },
]

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

export function HistorialTab() {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'completed':
        return { color: 'green', icon: CheckCircle2, label: 'Completado' }
      case 'in-progress':
        return { color: 'blue', icon: Clock, label: 'En Proceso' }
      case 'registered':
        return { color: 'gray', icon: Eye, label: 'Registrado' }
      default:
        return { color: 'gray', icon: Eye, label: status }
    }
  }

  const getTypeConfig = (type: string) => {
    switch(type) {
      case 'routine':
        return { color: 'bg-green-500', label: 'Programada' }
      case 'change':
        return { color: 'bg-blue-500', label: 'Cambio' }
      case 'inspection':
        return { color: 'bg-gray-500', label: 'Inspección' }
      default:
        return { color: 'bg-gray-500', label: type }
    }
  }

  const statusColorMap: Record<string, { text: string; bg: string; border: string }> = {
    green: { text: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    gray: { text: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2">Historial de Lubricación</h1>
        <p className="text-gray-400">Registro completo de actividades de mantenimiento lubricante</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex gap-2">
              <input
                type="date"
                className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-orange-500/60 focus:outline-none"
              />
              <span className="text-gray-400 self-center">a</span>
              <input
                type="date"
                className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-orange-500/60 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-orange-500/60 focus:outline-none">
                <option>Todos los técnicos</option>
                <option>Juan Pérez</option>
                <option>Carlos López</option>
                <option>Ana García</option>
              </select>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all">
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
            </div>
          </div>

          <div className="relative border-l-2 border-orange-500/30 ml-4 space-y-8">
            {historyData.map((entry, index) => {
              const statusConfig = getStatusConfig(entry.status)
              const typeConfig = getTypeConfig(entry.type)
              const StatusIcon = statusConfig.icon
              const colors = statusColorMap[statusConfig.color] || statusColorMap.gray
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative pl-8 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className={`absolute -left-2 top-0 w-4 h-4 rounded-full ${typeConfig.color} border-4 border-dark-900 shadow-lg`}
                  />
                  
                  <GlassCard className="p-5 hover:border-orange-500/40 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`${colors.text} text-sm font-medium`}>{entry.timestamp}</span>
                        <h4 className="text-white font-medium mt-1 text-lg">{entry.title}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{entry.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Técnico: {entry.technician}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClipboardCheck className="w-3 h-3" />
                        {entry.type === 'change' ? 'Análisis: Requerido' : 'Observaciones: Sin novedad'}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
