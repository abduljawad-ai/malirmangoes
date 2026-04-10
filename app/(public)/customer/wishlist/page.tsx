'use client'

import React, { Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

function WishlistContent() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mango" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-mango-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-mango" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Please sign in</h2>
          <p className="text-slate-500 mt-2 mb-6">You need to be logged in to view your wishlist.</p>
          <Link href="/login?redirect=/customer/wishlist">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-mango-50 to-orange-50 border border-mango/20 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mango/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-mango" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Wishlist feature coming soon!</h2>
            <p className="text-sm text-slate-500 mt-0.5">We&apos;re working on a way for you to save your favorite mangoes. Check back soon.</p>
          </div>
        </div>
      </div>

      <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Not available yet</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          The wishlist feature is under construction. In the meantime, browse our available products.
        </p>
        <Link href="/products">
          <Button variant="outline">Browse Products</Button>
        </Link>
      </div>
    </div>
  )
}

export default function WishlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mango" />
      </div>
    }>
      <WishlistContent />
    </Suspense>
  )
}
