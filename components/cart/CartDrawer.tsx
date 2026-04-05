'use client'

import React from 'react'
import { X, ShoppingBag, Plus, Minus, Trash2, Truck, MessageCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPKR, getValidImageUrl } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Image from 'next/image'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923XXXXXXXXX'

function buildWhatsAppMessage(items: { name: string; qty: number; salePrice?: number; price: number }[], total: number) {
  const itemsList = items.map((i) => `${i.name} x${i.qty}`).join(', ')
  return `Assalam o Alaikum! I want to order: ${itemsList}. Total: ${formatPKR(total)}. My address is...`
}

const FREE_SHIPPING_THRESHOLD = 5000

export default function CartDrawer() {
  const { items, isCartOpen, toggleCart, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  const progress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0)

  const handleWhatsAppCheckout = () => {
    const message = buildWhatsAppMessage(items, totalPrice)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    clearCart()
  }

  if (!isCartOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={toggleCart} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-xl z-50 flex flex-col max-h-[80vh] md:max-w-md md:right-4 md:left-auto md:bottom-4 md:top-4 md:rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-mango rounded-md flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Cart</h2>
              <p className="text-xs text-slate-500">{totalItems} items</p>
            </div>
          </div>
          <button onClick={toggleCart} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shipping Progress */}
        {items.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-700">
                {remaining === 0 ? (
                  <span className="text-leaf">Free shipping unlocked!</span>
                ) : (
                  `Add ${formatPKR(remaining)} more for free shipping`
                )}
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${remaining === 0 ? 'bg-leaf' : 'bg-mango'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">Your cart is empty</p>
              <p className="text-xs text-slate-500 mb-4">Add some mangoes to get started</p>
              <Button variant="outline" onClick={toggleCart}>Start Shopping</Button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={getValidImageUrl(item.image)}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-900 truncate">{item.name}</h3>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {formatPKR(item.salePrice || item.price)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-white rounded-md border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.productId, item.qty - 1)}
                        className="p-1 hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        {item.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="px-2 text-xs font-semibold text-slate-900 min-w-[24px] text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.qty + 1)}
                        className="p-1 hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-lg font-bold text-slate-900">{formatPKR(totalPrice)}</span>
            </div>
            <Button className="w-full h-11" onClick={handleWhatsAppCheckout}>
              <MessageCircle className="w-4 h-4 mr-1" /> Order via WhatsApp
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
