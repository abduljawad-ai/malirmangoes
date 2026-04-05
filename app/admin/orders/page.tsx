'use client'

import React, { useState } from 'react'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { formatPKR, cn } from '@/lib/utils'
import { Clock, CheckCircle2, Truck, Package, Search, XCircle } from 'lucide-react'
import { ref, update } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { OrderStatus } from '@/types'
import Badge, { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'
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

export default function AdminOrdersPage() {
  const { orders, loading, refresh } = useAdminOrders()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerSnapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerSnapshot.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      const updates = { orderStatus: newStatus, updatedAt: new Date().toISOString() }
      const userId = orders.find(o => o.id === orderId)?.userId
      await update(ref(rtdb, `orders/all/${orderId}`), updates)
      if (userId) {
        await update(ref(rtdb, `orders/byUser/${userId}/${orderId}`), updates)
      }
      toast.success(`Order updated to ${newStatus}`)
      refresh()
    } catch (error) {
      toast.error('Failed to update order')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">{orders.length} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 h-10 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="h-10 px-3 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango"
        >
          <option value="all">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white border border-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-slate-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const StatusIcon = statusIcons[order.orderStatus]
            return (
              <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-mono font-medium text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt as any).toLocaleString()}</p>
                    </div>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    disabled={updatingId === order.id}
                    className="h-8 px-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango disabled:opacity-50"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Customer + Total */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{order.customerSnapshot.name}</p>
                    <p className="text-xs text-slate-500">{order.customerSnapshot.email} · {order.customerSnapshot.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatPKR(order.total)}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-slate-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded text-xs">
                      <span className="text-slate-700 truncate max-w-[100px]">{item.name}</span>
                      <span className="text-slate-400">×{item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
