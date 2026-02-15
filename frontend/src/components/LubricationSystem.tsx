'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './layout/Navbar'
import { BackgroundOrbs } from './layout/BackgroundOrbs'
import { PoolTab } from './tabs/PoolTab'
import { EquiposTab } from './tabs/EquiposTab'
import { InventarioTab } from './tabs/InventarioTab'
import { HistorialTab } from './tabs/HistorialTab'
import { DashboardTab } from './tabs/DashboardTab'
import { TabType } from '@/types'

const tabComponents: Record<TabType, React.ComponentType> = {
  pool: PoolTab,
  equipos: EquiposTab,
  inventario: InventarioTab,
  historial: HistorialTab,
  dashboard: DashboardTab,
}

export function LubricationSystem() {
  const [activeTab, setActiveTab] = useState<TabType>('pool')

  const ActiveComponent = tabComponents[activeTab]

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans antialiased overflow-x-hidden">
      <BackgroundOrbs />
      
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
