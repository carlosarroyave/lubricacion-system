import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/[0.03] backdrop-blur-[20px]',
        'border border-white/[0.08]',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
        className
      )}
    >
      {children}
    </div>
  )
}
