'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { GlassPanel } from './GlassPanel'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  title?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  actions?: ReactNode
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  title,
  searchPlaceholder,
  onSearch,
  actions
}: DataTableProps<T>) {
  return (
    <GlassPanel className="animate-slide-up">
      {(title || searchPlaceholder || actions) && (
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
          <div className="flex gap-3">
            {searchPlaceholder && (
              <div className="relative group">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 w-64 focus:w-80 transition-all duration-300 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                />
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
            {actions}
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-black/20">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-orange-400 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, index) => (
              <motion.tr
                key={keyExtractor(item)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-orange-500/5 transition-colors duration-200"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}
