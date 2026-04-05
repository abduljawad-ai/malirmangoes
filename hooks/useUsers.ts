'use client'

import { useState, useEffect, useCallback } from 'react'
import { ref, get } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { User } from '@/types'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const usersRef = ref(rtdb, 'users')
      const snapshot = await get(usersRef)
      
      if (snapshot.exists()) {
        const data = snapshot.val()
        const usersList = Object.keys(data).map(key => ({
          ...data[key],
          uid: key
        })) as User[]
        
        // Sort by createdAt descending
        usersList.sort((a, b) => 
          new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
        )
        
        setUsers(usersList)
      } else {
        setUsers([])
      }
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, refresh: fetchUsers }
}
