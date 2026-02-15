'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface StatusBadgeProps {
  status: string
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  animate?: boolean
}

const variants = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export function StatusBadge({ status, variant, animate = false }: StatusBadgeProps) {
  return (
    <motion.span
      animate={animate ? { opacity: [1, 0.7, 1] } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        'relative inline-flex items-center px-3 py-1 rounded-full',
        'text-xs font-medium border overflow-hidden',
        variants[variant]
      )}
    >
      <span className="relative z-10">{status}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.span>
  )
}
