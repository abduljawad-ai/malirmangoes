'use client'

import React, { useState, useMemo } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { Search, User, Mail, Phone, Calendar, Ban, Check } from 'lucide-react'
import { formatPKR, cn } from '@/lib/utils'
import { ref, update } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import toast from 'react-hot-toast'

export default function AdminCustomersPage() {
  const { users, loading, refresh } = useUsers()
  const { orders } = useAdminOrders()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase()
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.includes(query)
    )
  })

  const userOrderMap = useMemo(() => {
    const map = new Map<string, typeof orders>()
    for (const order of orders) {
      if (!map.has(order.userId)) {
        map.set(order.userId, [])
      }
      map.get(order.userId)!.push(order)
    }
    return map
  }, [orders])

  const userSpentMap = useMemo(() => {
    const map = new Map<string, number>()
    userOrderMap.forEach((userOrders, userId) => {
      const total = userOrders
        .filter(o => o.paymentStatus === 'Verified')
        .reduce((acc, o) => acc + o.total, 0)
      map.set(userId, total)
    })
    return map
  }, [userOrderMap])

  const toggleBan = async (userId: string, isBanned: boolean) => {
    try {
      await update(ref(rtdb, `users/${userId}`), { isBanned: !isBanned })
      toast.success(isBanned ? 'User unbanned' : 'User banned')
      refresh()
    } catch {
      toast.error('Failed to update user')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Customers</h1>
        <p className="text-muted mt-1">{users.length} registered customers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border/50 text-sm focus:border-mango focus:ring-2 focus:ring-mango/20 focus:outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-white animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/50 p-12 text-center">
          <User className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-muted">No customers found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const isSelected = selectedUser === user.uid

            return (
              <div key={user.uid} className="bg-white rounded-xl border border-border/50 overflow-hidden">
                <button
                  onClick={() => setSelectedUser(isSelected ? null : user.uid)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-surface-hover/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mango to-mango-dark flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-dark truncate">{user.name || 'Unknown'}</p>
                      {user.isBanned && (
                        <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold rounded-full">BANNED</span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="font-semibold text-dark">{(userOrderMap.get(user.uid) || []).length}</p>
                      <p className="text-xs text-muted">Orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-dark">{formatPKR(userSpentMap.get(user.uid) || 0)}</p>
                      <p className="text-xs text-muted">Spent</p>
                    </div>
                  </div>
                </button>

                {isSelected && (
                  <div className="px-4 pb-4 pt-2 border-t border-border/30 bg-surface-hover/30">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Calendar className="w-4 h-4" />
                        <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => toggleBan(user.uid, !!user.isBanned)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                          user.isBanned
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-error/10 text-error hover:bg-error/20"
                        )}
                      >
                        {user.isBanned ? <Check className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {user.isBanned ? 'Unban User' : 'Ban User'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
