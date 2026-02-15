'use client'

import { useState, useEffect, useRef } from 'react'

export function useAnimatedNumber(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const progress = currentTime - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - percentage, 3)
      
      const currentCount = Math.floor(easeOut * end)
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }

      if (percentage < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      startTimeRef.current = null
    }
  }, [end, duration])

  return count
}
