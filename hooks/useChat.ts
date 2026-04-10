'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ref, onValue, push, set, update, get } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { ChatMessage, ChatMetadata, TypingStatus } from '@/types/chat'

interface UseChatProps {
  userId: string
  userName: string
  userEmail: string
  userPhotoURL?: string
}

export function useChat({ userId, userName, userEmail, userPhotoURL }: UseChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAdminTyping, setIsAdminTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Listen to messages
  useEffect(() => {
    if (!userId) return

    const messagesRef = ref(rtdb, `chats/${userId}/messages`)
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const messagesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) as ChatMessage[]
        
        messagesList.sort((a, b) => a.timestamp - b.timestamp)
        setMessages(messagesList)
      } else {
        setMessages([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  // Listen to metadata
  useEffect(() => {
    if (!userId) return

    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    const unsubscribe = onValue(metadataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as ChatMetadata
        setMetadata(data)
        setUnreadCount(data.unreadByUser || 0)
      }
    })

    return () => unsubscribe()
  }, [userId])

  // Listen to admin typing status
  useEffect(() => {
    if (!userId) return

    const typingRef = ref(rtdb, `chatTyping/${userId}`)
    const unsubscribe = onValue(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as TypingStatus
        setIsAdminTyping(data.isAdminTyping || false)
      } else {
        setIsAdminTyping(false)
      }
    })

    return () => unsubscribe()
  }, [userId])

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }, [])

  const sendMessage = useCallback(async (text: string, productInfo?: { id: string; slug?: string; name: string; image?: string }, imageUrl?: string) => {
    if (!userId || (!text.trim() && !imageUrl) || isSending) return

    setIsSending(true)
    const now = Date.now()
    const messageRef = push(ref(rtdb, `chats/${userId}/messages`))
    
    const message: Omit<ChatMessage, 'id'> = {
      text: text.trim(),
      sender: 'user',
      timestamp: now,
      seen: false
    }

    if (productInfo) {
      message.productId = productInfo.id
      message.productName = productInfo.name
    }

    if (imageUrl) {
      message.imageUrl = imageUrl
    }

    await set(messageRef, message)

    // Update only the specific metadata fields needed, preserving any admin-set fields
    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    
    // Build minimal update object - only update fields that should change on user message
    const metadataUpdates: Record<string, unknown> = {
      lastMessage: imageUrl ? (text.trim() || '📷 Image') : text.trim(),
      lastMessageTime: now,
      unreadByUser: 0, // Reset user's unread count
      // unreadByAdmin should only be incremented by admin, not by user
      // Don't update status, createdAt, or any admin-only fields
    }

    // Only update context if explicitly provided with product info
    if (productInfo) {
      metadataUpdates.contextProductId = productInfo.id
      if (productInfo.slug) metadataUpdates.contextProductSlug = productInfo.slug
      metadataUpdates.contextProductName = productInfo.name
      if (productInfo.image) metadataUpdates.contextProductImage = productInfo.image
    }

    // Check if metadata exists, if not create initial metadata
    const metadataSnap = await get(metadataRef)
    if (!metadataSnap.exists()) {
      // First message - create full metadata
      await set(metadataRef, {
        userId,
        userName,
        userEmail,
        userPhotoURL: userPhotoURL || null,
        lastMessage: metadataUpdates.lastMessage,
        lastMessageTime: metadataUpdates.lastMessageTime,
        unreadByUser: 0,
        unreadByAdmin: 1, // First message is unread for admin
        status: 'active',
        createdAt: now
      })
    } else {
      // Existing conversation - only update message-related fields
      await update(metadataRef, metadataUpdates)
    }
    setIsSending(false)
  }, [userId, userName, userEmail, userPhotoURL, isSending])

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!userId) return null

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/chat-upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }

      const data = await res.json()
      return data.url
    } catch {
      return null
    } finally {
      setIsUploading(false)
    }
  }, [userId])

  const markAsRead = useCallback(async () => {
    if (!userId || messages.length === 0) return

    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    await update(metadataRef, { unreadByUser: 0 })

    const updates: Record<string, boolean> = {}
    messages.forEach(msg => {
      if (msg.sender === 'admin' && !msg.seen) {
        updates[`chats/${userId}/messages/${msg.id}/seen`] = true
      }
    })

    if (Object.keys(updates).length > 0) {
      await update(ref(rtdb), updates)
    }
  }, [userId, messages])

  const setTyping = useCallback((isTyping: boolean) => {
    if (!userId) return

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(async () => {
        const typingRef = ref(rtdb, `chatTyping/${userId}`)
        await update(typingRef, { isUserTyping: false })
      }, 3000)
    }

    const typingRef = ref(rtdb, `chatTyping/${userId}`)
    update(typingRef, {
      isUserTyping: isTyping,
      timestamp: Date.now()
    })
  }, [userId])

  return {
    messages,
    metadata,
    loading,
    unreadCount,
    isAdminTyping,
    isSending,
    isUploading,
    sendMessage,
    markAsRead,
    setTyping,
    uploadImage
  }
}
