'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Package } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-leaf-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-leaf" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Placed!</h1>
      <p className="text-sm text-slate-500 mb-6">Your order has been confirmed and will be shipped soon.</p>

      {orderId && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-slate-500 mb-1">Order ID</p>
          <p className="text-sm font-mono font-semibold text-slate-900">{orderId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1" asChild>
          <Link href="/customer">
            <Package className="w-4 h-4 mr-1.5" />
            Track Order
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-mango mx-auto mb-6" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
