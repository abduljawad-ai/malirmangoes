'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { Package, Clock, Truck, CheckCircle2, XCircle, MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getValidImageUrl } from '@/lib/utils'
import Badge, { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'

const statusIcons: Record<string, React.ElementType> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Packed: Package,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
}

function OrdersContent() {
  const { user, loading: authLoading } = useAuth()
  const { orders, loading: ordersLoading } = useOrders()

  if (authLoading || ordersLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white border border-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Please sign in</h3>
        <p className="text-sm text-slate-500 mb-4">Log in to view your orders</p>
        <Link href="/login?redirect=/customer" className="text-sm font-medium text-mango hover:underline">
          Sign In →
        </Link>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No orders yet</h3>
        <p className="text-sm text-slate-500 mb-4">Start shopping to see your orders here</p>
        <Link href="/products" className="text-sm font-medium text-mango hover:underline">
          Browse Products →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map(order => {
        const StatusIcon = statusIcons[order.orderStatus] || Clock
        return (
          <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-mono font-medium text-slate-500">
                  #{order.id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={order.orderStatus} />
              </div>
            </div>

            {/* Items */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-10 h-10 rounded-md border-2 border-white overflow-hidden bg-slate-100 relative flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-10 h-10 rounded-md border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-500 flex-shrink-0">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {order.items.map(i => i.name).join(', ')}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {order.customerSnapshot?.address?.city}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Rs. {order.total.toLocaleString()}</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <Link
                href={`/customer/orders/${order.id}`}
                className="flex items-center gap-1 text-xs font-medium text-mango hover:underline"
              >
                Details <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function CustomerOrdersPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 mb-4">My Orders</h1>
      <OrdersContent />
    </div>
  )
}
