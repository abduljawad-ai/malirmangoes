'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Order {
  id: string
  created_at: string
  status: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return
      setLoading(true)
      try {
        const res = await fetch(`/api/orders?user_id=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet</p>
          <a href="/" className="text-orange-600 hover:underline">Browse mangoes</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-gray-500 text-sm">{formatDate(order.created_at)}</span>
                <span className="font-bold">Rs. {order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}