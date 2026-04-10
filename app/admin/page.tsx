'use client'

import React from 'react'
import { DollarSign, ShoppingBag, Package, Users, Clock, CheckCircle2, Truck, ArrowUpRight, ChevronRight } from 'lucide-react'
import { formatPKR, cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useProducts } from '@/hooks/useProducts'
import { useUsers } from '@/hooks/useUsers'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import Badge, { OrderStatusBadge } from '@/components/ui/Badge'
import { StatCardSkeleton } from '@/components/ui/Skeleton'

const orderStatusIcons: Record<string, React.ElementType> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Packed: Package,
  Cancelled: CheckCircle2,
}

export default function AdminDashboard() {
  const router = useRouter()
  const { products, loading: productsLoading } = useProducts()
  const { users, loading: usersLoading } = useUsers()
  const { orders, loading: ordersLoading } = useAdminOrders()

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Verified')
    .reduce((acc, o) => acc + o.total, 0)

  const activeProductsCount = products.filter(p => p.isActive).length
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length

  const stats = [
    { label: 'Revenue', value: formatPKR(totalRevenue), icon: DollarSign, color: 'text-mango bg-mango-50' },
    { label: 'Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'text-slate-700 bg-slate-100' },
    { label: 'Products', value: activeProductsCount.toString(), icon: Package, color: 'text-mango bg-mango-50' },
    { label: 'Customers', value: users.length.toString(), icon: Users, color: 'text-slate-700 bg-slate-100' },
  ]

  if (productsLoading || usersLoading || ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Store overview</p>
        </div>
        {pendingOrders > 0 && (
          <Button size="sm" asChild>
            <Link href="/admin/orders">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {pendingOrders} pending
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className={cn('w-8 h-8 rounded-md flex items-center justify-center mb-3', stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-500 mb-0.5">{stat.label}</p>
            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button variant="outline" className="h-12 justify-start" asChild>
          <Link href="/admin/products"><Package className="w-4 h-4 mr-2" />Manage Products</Link>
        </Button>
        <Button variant="outline" className="h-12 justify-start" asChild>
          <Link href="/admin/orders"><ShoppingBag className="w-4 h-4 mr-2" />Process Orders</Link>
        </Button>
        <Button variant="outline" className="h-12 justify-start" asChild>
          <Link href="/admin/settings">Store Settings</Link>
        </Button>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-mango hover:underline flex items-center gap-0.5">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Order</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 hidden sm:table-cell">Customer</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Total</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Status</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => {
                  const StatusIcon = orderStatusIcons[order.orderStatus] || Clock
                  return (
                    <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/orders?highlight=${order.id}`)}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-medium text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-slate-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-slate-900">{order.customerSnapshot?.name}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{formatPKR(order.total)}</td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/orders?highlight=${order.id}`} className="text-xs font-medium text-mango hover:underline flex items-center gap-0.5 justify-end">
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
