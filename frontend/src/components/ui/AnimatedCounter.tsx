'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ value, suffix = '', className }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  
  const spring = useSpring(0, { 
    stiffness: 50, 
    damping: 20,
    duration: 1.5 
  })
  
  const rounded = useTransform(spring, (latest) => Math.round(latest))
  
  useEffect(() => {
    spring.set(value)
  }, [spring, value])
  
  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [rounded])
  
  return (
    <motion.span className={className}>
      {displayValue.toLocaleString()}{suffix}
    </motion.span>
  )
}
