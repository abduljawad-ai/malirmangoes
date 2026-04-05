'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'
  children: React.ReactNode
  className?: string
}

const variants = {
  default: 'bg-mango-50 text-mango-700',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
  error: 'bg-danger-50 text-danger',
  info: 'bg-info-50 text-info',
  muted: 'bg-slate-100 text-slate-500',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'> = {
    Pending: 'warning',
    Confirmed: 'info',
    Packed: 'default',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'error',
  }
  return <Badge variant={map[status] || 'muted'}>{status}</Badge>
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'> = {
    Pending: 'warning',
    Verified: 'success',
    Failed: 'error',
    Refunded: 'muted',
  }
  return <Badge variant={map[status] || 'muted'}>{status}</Badge>
}
