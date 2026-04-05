'use client'

import { useState, useEffect, useCallback } from 'react'
import { ref, get } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { Order } from '@/types'

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const ordersRef = ref(rtdb, 'orders/all')
      const snapshot = await get(ordersRef)
      
      if (snapshot.exists()) {
        const data = snapshot.val()
        const ordersList = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })) as Order[]
        
        // Sort by date descending
        ordersList.sort((a, b) => 
          new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
        )
        
        setOrders(ordersList)
      } else {
        setOrders([])
      }
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, refresh: fetchOrders }
}
