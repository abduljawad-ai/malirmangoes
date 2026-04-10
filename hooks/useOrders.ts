'use client'

import { useState, useEffect, useCallback } from 'react'
import { ref, get } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { Order } from '@/types'
import { useAuth } from './useAuth'

export function useOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Query orders for specific user
      const ordersRef = ref(rtdb, `orders/byUser/${user.uid}`)
      const snapshot = await get(ordersRef)
      
      if (snapshot.exists()) {
        const data = snapshot.val()
        const ordersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) as Order[]
        
        // Sort by date descending
        ordersList.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        setOrders(ordersList)
      } else {
        setOrders([])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchUserOrders()
  }, [fetchUserOrders])

  return { orders, loading, error, refresh: fetchUserOrders }
}
