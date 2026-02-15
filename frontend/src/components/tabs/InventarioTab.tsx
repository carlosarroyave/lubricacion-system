'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { InventoryItem } from '@/types'
import { Package, Search, Filter, Download, Edit, Plus, ShoppingCart } from 'lucide-react'

const inventoryData: InventoryItem[] = [
  { 
    code: 'ACE-068', 
    name: 'Aceite Hidráulico', 
    subName: 'ISO VG 68',
    type: 'Mineral', 
    currentStock: 450, 
    unit: 'L',
    minStock: 100, 
    location: 'Almacén A-12',
    status: 'available',
    percentage: 75
  },
  { 
    code: 'GRA-002', 
    name: 'Grasa Lítica', 
    subName: 'NLGI 2',
    type: 'Grasa', 
    currentStock: 25, 
    unit: 'kg',
    minStock: 50, 
    location: 'Almacén B-03',
    status: 'critical',
    percentage: 15
  },
  { 
    code: 'ACE-046', 
    name: 'Aceite Turbina', 
    subName: 'ISO VG 46',
    type: 'Sintético', 
    currentStock: 180, 
    unit: 'L',
    minStock: 200, 
    location: 'Almacén A-08',
    status: 'low',
    percentage: 45
  },
  { 
    code: 'ACE-220', 
    name: 'Aceite Engranajes', 
    subName: 'ISO VG 220',
    type: 'Mineral', 
    currentStock: 320, 
    unit: 'L',
    minStock: 80, 
    location: 'Almacén C-15',
    status: 'available',
    percentage: 80
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

export function InventarioTab() {
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'available': return 'success' as const
      case 'critical': return 'danger' as const
      case 'low': return 'warning' as const
      default: return 'neutral' as const
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return 'Disponible'
      case 'critical': return 'Crítico'
      case 'low': return 'Bajo Stock'
      default: return status
    }
  }

  const getBarColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-500'
      case 'critical': return 'bg-red-500'
      case 'low': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getIconColor = (status: string) => {
    switch(status) {
      case 'available': return { bg: 'bg-blue-500/20', text: 'text-blue-400' }
      case 'critical': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400' }
      case 'low': return { bg: 'bg-purple-500/20', text: 'text-purple-400' }
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400' }
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
        <h1 className="text-3xl font-bold text-white mb-2">Inventario de Lubricantes</h1>
        <p className="text-gray-400">Control de stock y gestión de insumos lubricantes</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="overflow-hidden">
          {/* Filter Tabs */}
          <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex gap-2">
              {['Aceites', 'Grasas', 'Aditivos'].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    i === 0 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {i === 0 && <Package className="w-4 h-4 inline mr-2" />}
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  className="bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 w-64 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
              </div>
              <button className="p-2 rounded-lg bg-white/5 text-orange-400 hover:bg-orange-500/20 transition-all border border-white/10">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 text-orange-400 hover:bg-orange-500/20 transition-all border border-white/10">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Stock Actual</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Stock Mínimo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-orange-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inventoryData.map((item, index) => {
                  const iconColors = getIconColor(item.status)
                  return (
                    <motion.tr
                      key={item.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-orange-500/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded ${iconColors.bg} flex items-center justify-center mr-3`}>
                            <Package className={`w-4 h-4 ${iconColors.text}`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.subName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-white font-medium">{item.currentStock}</span>
                          <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full ${getBarColor(item.status)} rounded-full`}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{item.minStock} {item.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={getStatusLabel(item.status)} 
                          variant={getStatusVariant(item.status)}
                          animate={item.status === 'critical'}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-orange-400 hover:text-orange-300 mr-3 transition-colors">
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button className="text-orange-400 hover:text-orange-300 transition-colors">
                          {item.status === 'critical' ? <ShoppingCart className="w-4 h-4 inline" /> : <Plus className="w-4 h-4 inline" />}
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
