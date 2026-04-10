'use client'

import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface SpringFadeProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  duration?: number
  once?: boolean
}

const directionOffsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { y: 0, x: 40 },
  right: { y: 0, x: -40 },
  none: { y: 0, x: 0 }
}

export function SpringFade({ 
  children, 
  delay = 0, 
  direction = 'up',
  className,
  once = true
}: SpringFadeProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches)
  }, [])

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  const offset = directionOffsets[direction]

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
