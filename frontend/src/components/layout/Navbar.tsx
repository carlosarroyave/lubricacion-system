'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TabType, Planta, PLANTA_LABELS } from '@/types'
import { 
  Droplets, 
  Settings, 
  History, 
  Wrench,
  LayoutDashboard,
  Menu,
  X,
  Factory,
  ArrowLeftRight,
} from 'lucide-react'

interface NavbarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  planta: Planta
  onChangePlanta: () => void
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'planes', label: 'Planes Lubricación', icon: Droplets },
  { id: 'equipos', label: 'Equipos', icon: Settings },
  { id: 'historial', label: 'Historial', icon: History },
  { id: 'herramientas', label: 'Herramientas', icon: Wrench },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function Navbar({ activeTab, onTabChange, planta, onChangePlanta }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const plantaColor = planta === 'TREN_1' ? 'orange' : 'blue'

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/[0.03] backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onTabChange('planes')}
              className="flex items-center space-x-3 group"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20"
              >
                <Droplets className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-80 transition-opacity hidden sm:inline">
                Lube<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Track</span> Pro
              </span>
            </button>

            {/* Plant indicator + switch button */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border',
                planta === 'TREN_1'
                  ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                  : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              )}>
                <Factory className="w-3.5 h-3.5" />
                {PLANTA_LABELS[planta]}
              </div>
              <button
                onClick={onChangePlanta}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Cambiar planta"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2',
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-orange-500/20 rounded-lg border border-orange-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
          
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-orange-400" />
              ) : (
                <Menu className="w-5 h-5 text-orange-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl"
        >
          <div className="px-4 py-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-orange-500/20 text-white border border-orange-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
            {/* Mobile: change plant button */}
            <button
              onClick={() => {
                onChangePlanta()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10 mt-2 pt-3"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Cambiar Planta
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
