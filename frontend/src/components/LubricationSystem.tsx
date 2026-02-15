'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundOrbs } from '@/components/layout/BackgroundOrbs'
import { PlanesTab } from '@/components/tabs/PlanesTab'
import { EquiposTab } from '@/components/tabs/EquiposTab'
import { HistorialTab } from '@/components/tabs/HistorialTab'
import { HerramientasTab } from '@/components/tabs/HerramientasTab'
import { DashboardTab } from '@/components/tabs/DashboardTab'
import { TabType } from '@/types'

const tabComponents: Record<TabType, React.ComponentType> = {
  planes: PlanesTab,
  equipos: EquiposTab,
  historial: HistorialTab,
  herramientas: HerramientasTab,
  dashboard: DashboardTab,
}

export function LubricationSystem() {
  const [activeTab, setActiveTab] = useState<TabType>('planes')
  const ActiveComponent = tabComponents[activeTab]

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      <BackgroundOrbs />
      <div className="relative z-10">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <p className="text-sm text-gray-500">
              Creado por <span className="text-orange-400 font-medium">Carlos Arroyave</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
