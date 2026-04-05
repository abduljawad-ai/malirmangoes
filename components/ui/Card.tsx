'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-lg',
        hover && 'hover:border-slate-300 hover:shadow-sm transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
