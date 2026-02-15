'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { 
  TrendingUp, 
  Activity, 
  Droplets, 
  AlertTriangle
} from 'lucide-react'

const stats = [
  { label: 'Eficiencia del Programa', value: 98.5, suffix: '%', icon: TrendingUp, color: 'from-orange-400 to-orange-600', change: '' },
  { label: 'Puntos Monitoreados', value: 1247, suffix: '', icon: Activity, color: 'from-blue-400 to-blue-600', change: '+12 nuevos' },
  { label: 'Litros Consumidos (Mes)', value: 45, suffix: '', icon: Droplets, color: 'from-purple-400 to-purple-600', change: '-5% vs mes anterior' },
  { label: 'Fallos por Lubricación', value: 0, suffix: '', icon: AlertTriangle, color: 'from-green-400 to-green-600', change: 'Meta alcanzada' },
]

const consumptionData = [
  { name: 'ISO VG 68', percentage: 45, color: 'bg-orange-500' },
  { name: 'ISO VG 46', percentage: 30, color: 'bg-orange-400' },
  { name: 'Grasa NLGI 2', percentage: 15, color: 'bg-yellow-500' },
  { name: 'ISO VG 220', percentage: 10, color: 'bg-red-500' },
]

const upcomingActivities = [
  { id: 'LUB-002', equipment: 'Bomba B-205', status: 'urgent', message: 'Vencido - Requiere atención inmediata', border: 'border-red-500' },
  { id: 'LUB-015', equipment: 'Compresor A-105', status: 'upcoming', message: 'Vence en 2 días', border: 'border-yellow-500' },
  { id: 'LUB-042', equipment: 'Motor M-460', status: 'scheduled', message: 'Programado para mañana', border: 'border-blue-500' },
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

export function DashboardTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard General</h1>
        <p className="text-gray-400">Métricas y análisis del sistema de lubricación</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <GlassCard key={index} className="p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-gray-400 mb-4">{stat.label}</p>
              {stat.change ? (
                <div className="text-xs text-gray-500">{stat.change}</div>
              ) : (
                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  />
                </div>
              )}
            </GlassCard>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption Chart */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Consumo por Tipo de Lubricante</h3>
            <div className="space-y-5">
              {consumptionData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-orange-400 font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Upcoming Activities */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Próximas Actividades</h3>
            <div className="space-y-3">
              {upcomingActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`flex items-center justify-between p-4 rounded-lg bg-white/5 border-l-4 ${activity.border} hover:bg-white/10 cursor-pointer transition-all duration-300`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{activity.id} - {activity.equipment}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.message}</p>
                  </div>
                  <button className={`text-xs px-3 py-1 rounded border ${
                    activity.status === 'urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    activity.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {activity.status === 'urgent' ? 'Urgente' : activity.status === 'upcoming' ? 'Próximo' : 'Programado'}
                  </button>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
