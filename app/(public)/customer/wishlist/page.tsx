'use client'

import React, { Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Heart, User } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
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
          <div className="w-16 h-16 bg-mango-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-mango" />
          </div>
          <h2 className="text-2xl font-bold text-dark">Please sign in</h2>
          <p className="text-muted mt-2 mb-6">You need to be logged in to view your wishlist.</p>
          <Link href="/login?redirect=/customer/wishlist">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark">Wishlist</h1>
        <p className="text-muted mt-1 text-sm">Your saved mango varieties</p>
      </div>

      <Card className="p-12 text-center bg-white border-border/40">
        <div className="w-14 h-14 bg-mango-soft rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-mango" />
        </div>
        <h3 className="text-lg font-bold text-dark">Your Wishlist is Empty</h3>
        <p className="text-sm text-muted mt-2 mb-6 max-w-sm mx-auto">
          Save your favorite mango varieties to quickly find them later.
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </Card>
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
