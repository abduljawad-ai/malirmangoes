'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import { formatPKR } from '@/lib/utils'
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, MapPin, CreditCard } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { OrderStatus } from '@/types'

const statusIcons: Record<OrderStatus, { icon: React.ElementType; color: string }> = {
  Pending: { icon: Clock, color: 'text-amber-600 bg-amber-50' },
  Confirmed: { icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
  Packed: { icon: Package, color: 'text-indigo-600 bg-indigo-50' },
  Shipped: { icon: Truck, color: 'text-purple-600 bg-purple-50' },
  Delivered: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  Cancelled: { icon: CheckCircle2, color: 'text-rose-600 bg-rose-50' },
}

const steps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered']

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { orders, loading } = useOrders()
  
  const order = orders.find(o => o.id === params.id)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-cream rounded w-48" />
          <div className="h-64 bg-cream rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-dark">Order Not Found</h2>
        <p className="text-muted mt-2 mb-6">This order doesn&apos;t exist or you don&apos;t have access.</p>
        <Button onClick={() => router.push('/customer')}>Back to Orders</Button>
      </div>
    )
  }

  const currentStepIndex = steps.indexOf(order.orderStatus)
  const statusInfo = statusIcons[order.orderStatus]
  const StatusIcon = statusInfo.icon

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
      <Link href="/customer" className="inline-flex items-center text-sm text-muted hover:text-mango transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs text-muted uppercase tracking-widest font-bold">Order</p>
              <h1 className="text-xl sm:text-2xl font-extrabold text-dark">#{order.id.slice(-6).toUpperCase()}</h1>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold self-start ${statusInfo.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {order.orderStatus}
            </span>
          </div>
          <p className="text-sm text-muted mt-2">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            }) : 'N/A'}
          </p>
        </div>

        {order.orderStatus !== 'Cancelled' && (
          <div className="p-5 sm:p-6 border-b border-border/50">
            <h3 className="text-sm font-bold text-dark mb-4">Order Progress</h3>
            <div className="flex items-center justify-between">
              {steps.map((step, i) => {
                const isCompleted = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                return (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                      isCompleted ? 'bg-mango text-white' : 'bg-cream text-muted border-2 border-border'
                    } ${isCurrent ? 'ring-4 ring-mango/20' : ''}`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium mt-1.5 text-center hidden sm:block ${
                      isCompleted ? 'text-mango' : 'text-muted'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 border-b border-border/50">
          <h3 className="text-sm font-bold text-dark mb-4">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-cream rounded-xl">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark truncate text-sm">{item.name}</p>
                  <p className="text-xs text-muted">Qty: {item.qty} × {formatPKR(item.price)}</p>
                </div>
                <p className="font-bold text-dark text-sm">{formatPKR(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 border-b border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-mango" />
                Shipping Address
              </h3>
              <div className="text-sm text-muted">
                <p className="font-medium text-dark">{order.customerSnapshot.name}</p>
                <p>{order.customerSnapshot.phone}</p>
                <p>{order.customerSnapshot.address.street}</p>
                <p>{order.customerSnapshot.address.city}, {order.customerSnapshot.address.state} {order.customerSnapshot.address.zip}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-mango" />
                Payment
              </h3>
              <div className="text-sm text-muted">
                <p className="font-medium text-dark">{order.paymentMethod}</p>
                <p className={order.paymentStatus === 'Verified' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span>{formatPKR(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Delivery</span>
              <span className="text-leaf font-semibold">FREE</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border/50">
              <span className="font-bold text-dark text-lg">Total</span>
              <span className="text-xl font-extrabold text-mango">{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
