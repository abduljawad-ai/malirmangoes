'use client'

import React, { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, Truck, XCircle, Copy, ExternalLink, X } from 'lucide-react'
import { ChatMetadata } from '@/types/chat'
import { Order } from '@/types'
import { cn, formatPKR } from '@/lib/utils'
import { ref, onValue, update, get } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import Link from 'next/link'

interface UserInfoPanelProps {
  userId: string
  metadata: ChatMetadata | null
  onClose?: () => void
}

const orderStatusIcons: Record<string, React.ElementType> = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Shipped: Truck,
  Delivered: CheckCircle,
  Packed: Package,
  Cancelled: XCircle,
}

const orderStatusColors: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Shipped: 'bg-purple-50 text-purple-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
  Packed: 'bg-indigo-50 text-indigo-700',
  Cancelled: 'bg-red-50 text-red-700',
}

export default function UserInfoPanel({ userId, metadata, onClose }: UserInfoPanelProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const ordersRef = ref(rtdb, `orders/byUser/${userId}`)
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const ordersList = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })) as Order[]
        
        ordersList.sort((a, b) => 
          new Date(b.createdAt as unknown as string).getTime() - new Date(a.createdAt as unknown as string).getTime()
        )
        
        setOrders(ordersList)
      } else {
        setOrders([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId)
    setCopiedId(orderId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const now = new Date().toISOString()
      const statusEntry = { status: newStatus, timestamp: now, updatedBy: 'admin' }
      
      const updates: Record<string, unknown> = {
        orderStatus: newStatus,
        updatedAt: now,
      }

      // Append to orderStatusHistory
      const orderRef = ref(rtdb, `orders/all/${orderId}`)
      const orderSnap = await get(orderRef)
      const existingHistory = orderSnap.exists() ? (orderSnap.val().orderStatusHistory || []) : []
      updates['orderStatusHistory'] = [...existingHistory, statusEntry]
      
      await update(orderRef, updates)
      
      const userOrderRef = ref(rtdb, `orders/byUser/${userId}/${orderId}`)
      await update(userOrderRef, { orderStatus: newStatus, updatedAt: now })
    } catch (error) {
    }
  }

  const totalSpent = orders
    .filter(o => o.paymentStatus === 'Verified')
    .reduce((sum, o) => sum + o.total, 0)

  if (!metadata) return null

  const productLink = metadata.contextProductSlug 
    ? `/products/${metadata.contextProductSlug}`
    : metadata.contextProductId 
      ? `/products/${metadata.contextProductId}`
      : null

  return (
    <div className="w-full h-full bg-white border-l border-border overflow-y-auto relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-mango/10 rounded-xl transition-colors lg:hidden z-10"
        title="Close details"
      >
        <X className="w-5 h-5 text-muted" />
      </button>

      <div className="p-6 border-b border-border bg-gradient-to-br from-mango/5 to-transparent">
        <div className="flex items-center gap-4 mb-4 pr-8 lg:pr-0">
          <div className="w-16 h-16 bg-gradient-to-br from-mango/20 to-mango/40 rounded-2xl flex items-center justify-center text-2xl font-bold text-mango">
            {metadata.userName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-bold text-dark text-lg">{metadata.userName}</h3>
            <p className="text-sm text-muted">{metadata.userEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream/50 p-3 rounded-xl">
            <p className="text-2xl font-bold text-dark">{orders.length}</p>
            <p className="text-xs text-muted uppercase tracking-wider">Total Orders</p>
          </div>
          <div className="bg-cream/50 p-3 rounded-xl">
            <p className="text-2xl font-bold text-mango">{formatPKR(totalSpent)}</p>
            <p className="text-xs text-muted uppercase tracking-wider">Total Spent</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-dark flex items-center gap-2">
            <Package className="w-4 h-4 text-mango" />
            Order History
          </h4>
          <span className="text-xs text-muted bg-border/50 px-2 py-1 rounded-full">
            {orders.length} orders
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-cream/50 rounded-xl animate-pulse">
                <div className="h-4 bg-border/50 rounded w-3/4 mb-2" />
                <div className="h-3 bg-border/50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted/30 mx-auto mb-2" />
            <p className="text-muted text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const StatusIcon = orderStatusIcons[order.orderStatus] || Clock
              
              return (
                <div 
                  key={order.id} 
                  className="p-4 bg-cream/30 rounded-xl border border-border/50 hover:border-mango/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-dark">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <button
                          onClick={() => copyOrderId(order.id)}
                          className="p-1 hover:bg-mango/10 rounded transition-colors"
                          title="Copy Order ID"
                        >
                          <Copy className="w-3 h-3 text-muted" />
                        </button>
                        {copiedId === order.id && (
                          <span className="text-xs text-leaf">Copied!</span>
                        )}
                      </div>
                      <p className="text-xs text-muted">
                        {new Date(order.createdAt as unknown as string).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                      orderStatusColors[order.orderStatus]
                    )}>
                      <StatusIcon className="w-3 h-3" />
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-dark">
                        {item.qty}x {item.name}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-muted">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <span className="font-bold text-dark">{formatPKR(order.total)}</span>
                    <div className="flex items-center gap-2">
                      {order.orderStatus === 'Pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {order.orderStatus === 'Confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                        >
                          Ship
                        </button>
                      )}
                      <Link
                        href={`/admin/orders?highlight=${order.id}`}
                        className="p-1.5 text-muted hover:text-mango hover:bg-mango/10 rounded-lg transition-colors"
                        title="View full order details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {metadata.contextProductName && (
        <div className="p-4 border-t border-border bg-mango/5">
          <p className="text-xs text-muted uppercase tracking-wider mb-2">Chat Context</p>
          <p className="text-sm font-medium text-dark">{metadata.contextProductName}</p>
          {productLink && (
            <Link
              href={productLink}
              target="_blank"
              className="text-xs text-mango hover:underline flex items-center gap-1 mt-1"
            >
              View Product <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
