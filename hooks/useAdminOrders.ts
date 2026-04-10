'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ref, get, query, orderByChild, limitToLast } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { Order } from '@/types'

const PAGE_SIZE = 20

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [, setLastKey] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Use ref to prevent race conditions
  const loadingRef = useRef(false)

  const fetchOrders = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true)
      setOrders([])
      setLastKey(null)
      setHasMore(true)
    } else {
      setLoading(true)
    }
    
    try {
      const ordersRef = ref(rtdb, 'orders/all')
      const ordersQuery = query(
        ordersRef,
        orderByChild('createdAt'),
        limitToLast(PAGE_SIZE + 1)
      )
      
      const snapshot = await get(ordersQuery)
      
      if (snapshot.exists()) {
        const ordersList: Order[] = []
        
        snapshot.forEach((child) => {
          ordersList.push({ ...child.val(), id: child.key } as Order)
        })
        
        ordersList.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        const hasMoreResults = ordersList.length > PAGE_SIZE
        if (hasMoreResults) {
          ordersList.pop()
        }
        
        const newLastKey = ordersList.length > 0 ? ordersList[ordersList.length - 1].id : null
        
        if (reset) {
          setOrders(ordersList)
        } else {
          setOrders(prev => [...prev, ...ordersList])
        }
        
        setLastKey(newLastKey || null)
        setHasMore(hasMoreResults)
      } else {
        setOrders([])
        setHasMore(false)
      }
      
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
      loadingRef.current = false
    }
  }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current) return
    loadingRef.current = true
    setIsLoadingMore(true)
    fetchOrders(false)
  }, [hasMore, fetchOrders])

  useEffect(() => {
    fetchOrders(true)
  }, [fetchOrders])

  return { 
    orders, 
    loading, 
    error, 
    hasMore,
    isLoadingMore,
    loadMore,
    refresh: () => fetchOrders(true)
  }
}
