'use client'

import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { rtdb } from '@/lib/firebase'

export function useChatUnreadCount(userId: string) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    
    const unsubscribe = onValue(metadataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setUnreadCount(data.unreadByUser || 0)
      } else {
        setUnreadCount(0)
      }
    })

    return () => unsubscribe()
  }, [userId])

  return unreadCount
}
