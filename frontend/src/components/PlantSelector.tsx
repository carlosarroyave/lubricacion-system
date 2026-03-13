'use client'

import { motion } from 'framer-motion'
import { Planta, PLANTA_LABELS } from '@/types'
import { Factory, Droplets, ChevronRight } from 'lucide-react'
import { BackgroundOrbs } from '@/components/layout/BackgroundOrbs'

interface PlantSelectorProps {
  onSelect: (planta: Planta) => void
}

const plantas: { id: Planta; description: string; color: string }[] = [
  {
    id: 'TREN_1',
    description: 'Equipos y planes de lubricación del Tren 1',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'TREN_2',
    description: 'Equipos y planes de lubricación del Tren 2',
    color: 'from-blue-500 to-cyan-600',
  },
]

export function PlantSelector({ onSelect }: PlantSelectorProps) {
  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden flex items-center justify-center">
      <BackgroundOrbs />
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30"
          >
            <Droplets className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Lube<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Track</span> Pro
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Seleccione la planta para continuar</p>
        </motion.div>

        {/* Plant Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plantas.map((planta, idx) => (
            <motion.button
              key={planta.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.15 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(planta.id)}
              className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${planta.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${planta.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Factory className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {PLANTA_LABELS[planta.id]}
                </h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {planta.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                  <span>Ingresar</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            Creado por <span className="text-orange-400 font-medium">Carlos Arroyave</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
