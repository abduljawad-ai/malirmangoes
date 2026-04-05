'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-mango" />
      </div>
    )
  }

  if (!user) {
    router.push('/login?redirect=/customer')
    return null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {children}
    </div>
  )
}
