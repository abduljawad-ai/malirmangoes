'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  asChild?: boolean
  children: React.ReactNode
}

const variants = {
  primary: 'bg-mango text-white hover:bg-mango-600 active:bg-mango-700 disabled:bg-mango-200',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-50',
  outline: 'bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:border-slate-100 disabled:text-slate-300',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-300',
  danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-200',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  asChild,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? 'span' : 'button'

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        loading && 'opacity-70 pointer-events-none',
        (disabled || loading) && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </Comp>
  )
}
