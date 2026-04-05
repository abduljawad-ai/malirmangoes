'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-slate-200 rounded animate-pulse', className)} />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="aspect-square bg-slate-200 animate-pulse" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-7 w-16" />
    </div>
  )
}
