'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Equipment } from '@/types'
import { 
  Cog, 
  Waves, 
  Zap, 
  Wind, 
  ChevronRight, 
  Plus,
  Settings
} from 'lucide-react'

const equipmentData: Equipment[] = [
  { id: '1', name: 'Compresor A-101', area: 'Producción', type: 'Rotativo', status: 'operational', icon: 'wind' },
  { id: '2', name: 'Bomba Centrífuga B-205', area: 'Procesos', type: 'Industrial', status: 'maintenance', icon: 'waves' },
  { id: '3', name: 'Motor Eléctrico M-450', area: 'Energía', type: 'AC Inducción', status: 'operational', icon: 'zap' },
  { id: '4', name: 'Reductor R-120', area: 'Mantenimiento', type: 'Engranajes', status: 'operational', icon: 'cog' },
]

const areas = [
  { name: 'Producción', count: 12 },
  { name: 'Mantenimiento', count: 8 },
  { name: 'Procesos', count: 15 },
  { name: 'Energía', count: 6 },
]

const iconMap: Record<string, React.ElementType> = {
  wind: Wind,
  waves: Waves,
  zap: Zap,
  cog: Cog,
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

export function EquiposTab() {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'operational': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'operational': return 'Operativo'
      case 'maintenance': return 'Mantenimiento'
      case 'offline': return 'Fuera de servicio'
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
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Equipos</h1>
        <p className="text-gray-400">Registro y mantenimiento de maquinaria industrial</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Catálogo de Equipos</h3>
              <button className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1 transition-colors">
                Ver todos <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {equipmentData.map((equipment, index) => {
                const Icon = iconMap[equipment.icon] || Settings
                return (
                  <motion.div
                    key={equipment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/30 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                        equipment.status === 'operational' ? 'from-blue-500 to-blue-600' :
                        equipment.status === 'maintenance' ? 'from-purple-500 to-purple-600' :
                        'from-red-500 to-red-600'
                      } flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium group-hover:text-orange-400 transition-colors">{equipment.name}</h4>
                        <p className="text-sm text-gray-400">Área: {equipment.area} | Tipo: {equipment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(equipment.status)}`}>
                        {getStatusLabel(equipment.status)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-6">Resumen por Área</h3>
            <div className="space-y-3">
              {areas.map((area, index) => (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-orange-500/20 cursor-pointer transition-all"
                >
                  <span className="text-gray-300 font-medium">{area.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400 font-bold">{area.count} equipos</span>
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Equipo
            </motion.button>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
