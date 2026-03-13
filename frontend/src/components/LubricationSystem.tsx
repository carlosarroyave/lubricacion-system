'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundOrbs } from '@/components/layout/BackgroundOrbs'
import { PlantSelector } from '@/components/PlantSelector'
import { PlanesTab } from '@/components/tabs/PlanesTab'
import { EquiposTab } from '@/components/tabs/EquiposTab'
import { HistorialTab } from '@/components/tabs/HistorialTab'
import { HerramientasTab } from '@/components/tabs/HerramientasTab'
import { DashboardTab } from '@/components/tabs/DashboardTab'
import { TabType, Planta } from '@/types'

export function LubricationSystem() {
  const [activeTab, setActiveTab] = useState<TabType>('planes')
  const [selectedPlanta, setSelectedPlanta] = useState<Planta | null>(null)

  const handleSelectPlanta = (planta: Planta) => {
    setSelectedPlanta(planta)
    setActiveTab('planes')
  }

  const handleChangePlanta = () => {
    setSelectedPlanta(null)
  }

  // Show plant selector if no plant selected
  if (!selectedPlanta) {
    return <PlantSelector onSelect={handleSelectPlanta} />
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'planes':
        return <PlanesTab planta={selectedPlanta} />
      case 'equipos':
        return <EquiposTab planta={selectedPlanta} />
      case 'historial':
        return <HistorialTab planta={selectedPlanta} />
      case 'herramientas':
        return <HerramientasTab />
      case 'dashboard':
        return <DashboardTab planta={selectedPlanta} />
      default:
        return <PlanesTab planta={selectedPlanta} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      <BackgroundOrbs />
      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          planta={selectedPlanta}
          onChangePlanta={handleChangePlanta}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTab()}
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
