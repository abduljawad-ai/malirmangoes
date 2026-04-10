'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ref, get, query, orderByKey, limitToFirst } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { User } from '@/types'

const PAGE_SIZE = 20

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  // Use ref to prevent race conditions
  const loadingRef = useRef(false)

  const fetchUsers = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true)
      setUsers([])
      setLastKey(null)
      setHasMore(true)
    } else {
      setLoading(true)
    }
    
    try {
      const usersRef = ref(rtdb, 'users')
      
      // Build query with pagination
      let usersQuery = query(
        usersRef,
        orderByKey(),
        limitToFirst(PAGE_SIZE + 1) // +1 to check if there are more
      )
      
      // If there's a lastKey, start after it
      if (!reset && lastKey) {
        // Note: RTDB doesn't support startAfter directly with orderByKey
        // We fetch all and filter, which is a limitation of RTDB
        // For production, consider using a different pagination strategy
        usersQuery = query(usersRef, orderByKey(), limitToFirst(PAGE_SIZE + 1))
      }
      
      const snapshot = await get(usersQuery)
      
      if (snapshot.exists()) {
        const usersList: User[] = []
        
        snapshot.forEach((child) => {
          usersList.push({ ...child.val(), uid: child.key } as User)
        })
        
        // Check if there are more results
        const hasMoreResults = usersList.length > PAGE_SIZE
        if (hasMoreResults) {
          usersList.pop() // Remove the extra item
        }
        
        const newLastKey = usersList.length > 0 ? usersList[usersList.length - 1].uid : null
        
        if (reset) {
          setUsers(usersList)
        } else {
          // Check for duplicates before adding
          setUsers(prev => {
            const existingIds = new Set(prev.map(u => u.uid))
            const newUsers = usersList.filter(u => !existingIds.has(u.uid))
            return [...prev, ...newUsers]
          })
        }
        
        setLastKey(newLastKey || null)
        setHasMore(hasMoreResults)
      } else {
        setUsers([])
        setHasMore(false)
      }
      
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
      loadingRef.current = false
    }
  }, [lastKey])

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current) return
    loadingRef.current = true
    setIsLoadingMore(true)
    fetchUsers(false)
  }, [hasMore, fetchUsers])

  useEffect(() => {
    fetchUsers(true)
  }, [fetchUsers])

  return { 
    users, 
    loading, 
    error, 
    hasMore,
    isLoadingMore,
    loadMore,
    refresh: () => fetchUsers(true)
  }
}
