'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { formatPKR } from '@/lib/utils'
import { ArrowLeft, Clock, CheckCircle2, Truck, Package, XCircle, MapPin, Phone, Mail, User } from 'lucide-react'
import { ref, update } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { OrderStatus } from '@/types'
import Badge, { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'
import Image from 'next/image'
import toast from 'react-hot-toast'

const statusOptions: OrderStatus[] = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

const statusIcons: Record<OrderStatus, React.ElementType> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Packed: Package,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { orders, loading, refresh } = useAdminOrders()
  const [updating, setUpdating] = useState(false)

  const order = orders.find(o => o.id === orderId)

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    if (!order) return
    setUpdating(true)
    try {
      const updates = { orderStatus: newStatus, updatedAt: new Date().toISOString() }
      await update(ref(rtdb, `orders/all/${order.id}`), updates)
      if (order.userId) {
        await update(ref(rtdb, `orders/byUser/${order.userId}/${order.id}`), updates)
      }
      toast.success(`Order updated to ${newStatus}`)
      refresh()
    } catch (error) {
      toast.error('Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-white border border-slate-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-mango transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="text-center py-16">
          <p className="text-slate-500">Order not found</p>
        </div>
      </div>
    )
  }

  const StatusIcon = statusIcons[order.orderStatus]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-slate-100 rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Order <span className="font-mono">#{order.id.slice(-6).toUpperCase()}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.orderStatus} />
          <select
            value={order.orderStatus}
            onChange={(e) => updateOrderStatus(e.target.value as OrderStatus)}
            disabled={updating}
            className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango disabled:opacity-50"
          >
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatPKR(item.price)} × {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatPKR(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">{formatPKR(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="text-leaf font-medium">Free</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Status Timeline</h2>
            <div className="space-y-3">
              {statusOptions.map((status, index) => {
                const isActive = statusOptions.indexOf(order.orderStatus) >= index
                const Icon = statusIcons[status]
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                      isActive ? 'bg-mango text-white' : 'bg-slate-100 text-slate-400'
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={cn(
                      'text-sm',
                      isActive ? 'font-medium text-slate-900' : 'text-slate-400'
                    )}>
                      {status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Customer
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{order.customerSnapshot.name}</p>
                <p className="text-xs text-slate-500">{order.customerSnapshot.email}</p>
              </div>
              {order.customerSnapshot.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customerSnapshot.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" /> Shipping Address
            </h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p>{order.customerSnapshot.address.street}</p>
              <p>{order.customerSnapshot.address.city}, {order.customerSnapshot.address.state} {order.customerSnapshot.address.zip}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-slate-400">💳</span> Payment
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Method</span>
                <span className="text-sm font-medium text-slate-900">{order.paymentMethod || 'Cash on Delivery'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
