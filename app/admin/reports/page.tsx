'use client'

import React, { useMemo } from 'react'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { useProducts } from '@/hooks/useProducts'
import { useUsers } from '@/hooks/useUsers'
import { formatPKR } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'

const COLORS = ['#FF8C00', '#2EC4B6', '#F59E0B', '#EF4444', '#3B82F6', '#10B981']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function computeWeeklyData(orders: { total: number; createdAt: string | { toString(): string }; paymentStatus: string }[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const data = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return { name: dayNames[i], revenue: 0, orders: 0 }
  })

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt as any)
    const dayIndex = orderDate.getDay()
    if (orderDate >= startOfWeek && orderDate <= now) {
      data[dayIndex].revenue += order.total
      data[dayIndex].orders += 1
    }
  })

  return data
}

export default function AdminReportsPage() {
  const { orders } = useAdminOrders()
  const { products } = useProducts()
  const { users } = useUsers()

  const totalRevenue = orders.filter(o => o.paymentStatus === 'Verified').reduce((acc, o) => acc + o.total, 0)
  const verifiedOrders = orders.filter(o => o.paymentStatus === 'Verified')
  const avgOrderValue = verifiedOrders.length > 0 ? totalRevenue / verifiedOrders.length : 0

  const statusData = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(status => ({
    name: status,
    value: orders.filter(o => o.orderStatus === status).length,
  })).filter(d => d.value > 0)

  const categoryData = products.reduce((acc: { name: string; value: number }[], product) => {
    const existing = acc.find(c => c.name === product.category)
    if (existing) {
      existing.value++
    } else {
      acc.push({ name: product.category, value: 1 })
    }
    return acc
  }, [])

  const weeklyData = useMemo(() => computeWeeklyData(orders), [orders])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Reports & Analytics</h1>
        <p className="text-muted mt-1">Real-time insights into your store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-mango" />
            <span className="text-xs font-semibold text-muted uppercase">Revenue</span>
          </div>
          <p className="text-xl font-extrabold text-dark">{formatPKR(totalRevenue)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-leaf" />
            <span className="text-xs font-semibold text-muted uppercase">Avg Order</span>
          </div>
          <p className="text-xl font-extrabold text-dark">{formatPKR(Math.round(avgOrderValue))}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-mango" />
            <span className="text-xs font-semibold text-muted uppercase">Products</span>
          </div>
          <p className="text-xl font-extrabold text-dark">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-leaf" />
            <span className="text-xs font-semibold text-muted uppercase">Customers</span>
          </div>
          <p className="text-xl font-extrabold text-dark">{users.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-border/50">
          <h3 className="text-lg font-bold text-dark mb-4">Revenue Trend (This Week)</h3>
          <div className="h-64">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E6D8" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => v >= 1000 ? `Rs.${v/1000}k` : `Rs.${v}`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F0E6D8' }} formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#FF8C00" strokeWidth={2} dot={{ fill: '#FF8C00', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-sm">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/50">
          <h3 className="text-lg font-bold text-dark mb-4">Order Status Distribution</h3>
          <div className="h-64">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-sm">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/50">
          <h3 className="text-lg font-bold text-dark mb-4">Orders Per Day (This Week)</h3>
          <div className="h-64">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E6D8" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F0E6D8' }} />
                  <Bar dataKey="orders" fill="#2EC4B6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-sm">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/50">
          <h3 className="text-lg font-bold text-dark mb-4">Products by Category</h3>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
