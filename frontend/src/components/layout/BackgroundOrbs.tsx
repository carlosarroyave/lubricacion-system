'use client'

import { motion } from 'framer-motion'

export function BackgroundOrbs() {
  return (
    <>
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="fixed -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[100px] pointer-events-none z-0"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="fixed -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-orange-600/15 blur-[80px] pointer-events-none z-0"
      />
      <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pointer-events-none z-0" />
    </>
  )
}
