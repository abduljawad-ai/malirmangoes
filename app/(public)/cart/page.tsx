'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, Plus, Minus, Trash2, Truck } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPKR, getValidImageUrl } from '@/lib/utils'
import Button from '@/components/ui/Button'

const FREE_SHIPPING_THRESHOLD = 5000

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  const progress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0)

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-9 h-9 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Add some mangoes to get started.</p>
        <Button asChild>
          <Link href="/products">Browse Mangoes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-mango rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
          <p className="text-sm text-slate-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200">
              <Link href={`/products/${item.slug}`} className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                <Image
                  src={getValidImageUrl(item.image)}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-slate-900 hover:text-mango transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {formatPKR(item.salePrice || item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-slate-50 rounded-md border border-slate-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.qty - 1)}
                      className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      {item.qty === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>
                    <span className="px-3 text-sm font-semibold text-slate-900 min-w-[40px] text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.qty + 1)}
                      className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatPKR((item.salePrice || item.price) * item.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-20">
            {/* Shipping Progress */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-700">
                  {remaining === 0 ? (
                    <span className="text-leaf">Free shipping unlocked!</span>
                  ) : (
                    <>Add {formatPKR(remaining)} more for free shipping</>
                  )}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${remaining === 0 ? 'bg-leaf' : 'bg-mango'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-slate-900">{formatPKR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-leaf">{remaining === 0 ? 'Free' : 'Calculated at checkout'}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mb-4">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPKR(totalPrice)}</span>
              </div>
            </div>

            <Button className="w-full h-12" asChild>
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>

            <p className="text-xs text-slate-400 text-center mt-3">Secure checkout · Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  )
}
