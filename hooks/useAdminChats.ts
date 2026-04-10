'use client'

import { useState, useEffect, useCallback } from 'react'
import { ref, onValue, push, set, update } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { ChatMessage, ChatMetadata, ChatConversation, TypingStatus } from '@/types/chat'

const MESSAGE_PREVIEW_LIMIT = 3

export function useAdminChats() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [totalUnread, setTotalUnread] = useState(0)

  useEffect(() => {
    if (!rtdb) {
      setLoading(false)
      return
    }

    const chatsRef = ref(rtdb, 'chats')
    let timeoutId: NodeJS.Timeout | null = null

    const unsubscribe = onValue(
      chatsRef,
      (snapshot) => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        if (snapshot.exists()) {
          const data = snapshot.val()
          const conversationsList: ChatConversation[] = []

          Object.keys(data).forEach(userId => {
            const chatData = data[userId]
            const allMessages = chatData.messages || {}
            const metadata = chatData.metadata || {}

            const allMessagesList = Object.keys(allMessages).map(key => ({
              id: key,
              ...allMessages[key]
            })) as ChatMessage[]

            allMessagesList.sort((a, b) => a.timestamp - b.timestamp)

            const lastMessages = allMessagesList.slice(-MESSAGE_PREVIEW_LIMIT)

            conversationsList.push({
              userId,
              metadata: metadata as ChatMetadata,
              messages: lastMessages
            })
          })

          conversationsList.sort((a, b) => {
            const unreadDiff = (b.metadata?.unreadByAdmin || 0) - (a.metadata?.unreadByAdmin || 0)
            if (unreadDiff !== 0) return unreadDiff
            return (b.metadata?.lastMessageTime || 0) - (a.metadata?.lastMessageTime || 0)
          })

          setConversations(conversationsList)
          
          const total = conversationsList.reduce((sum, conv) => 
            sum + (conv.metadata?.unreadByAdmin || 0), 0
          )
          setTotalUnread(total)
        } else {
          setConversations([])
          setTotalUnread(0)
        }
        setLoading(false)
      },
      () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        setLoading(false)
      }
    )

    timeoutId = setTimeout(() => {
      setLoading(false)
      timeoutId = null
    }, 5000)

    return () => {
      unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const sendReply = useCallback(async (userId: string, text: string) => {
    if (!text.trim()) return

    // Check if chat is closed
    const conv = conversations.find(c => c.userId === userId)
    if (conv?.metadata?.status === 'closed') return

    const now = Date.now()
    const messageRef = push(ref(rtdb, `chats/${userId}/messages`))
    
    const message: Omit<ChatMessage, 'id'> = {
      text: text.trim(),
      sender: 'admin',
      timestamp: now,
      seen: false
    }

    await set(messageRef, message)

    // Update metadata — increment unreadByUser so customer sees notification
    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    await update(metadataRef, {
      lastMessage: text.trim(),
      lastMessageTime: now,
      unreadByAdmin: 0,
      unreadByUser: ((conv?.metadata?.unreadByUser || 0) + 1),
      status: 'active'
    })
  }, [conversations])

  const markAsRead = useCallback(async (userId: string) => {
    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    await update(metadataRef, { unreadByAdmin: 0 })

    // Mark user messages as seen — use direct query instead of stale closure
    const convRef = ref(rtdb, `chats/${userId}/messages`)
    onValue(convRef, (snapshot) => {
      if (!snapshot.exists()) return
      const data = snapshot.val()
      const updates: Record<string, boolean> = {}
      Object.keys(data).forEach(key => {
        if (data[key].sender === 'user' && !data[key].seen) {
          updates[`chats/${userId}/messages/${key}/seen`] = true
        }
      })

      if (Object.keys(updates).length > 0) {
        await update(ref(rtdb), updates)
      }
    }, { onlyOnce: true })
  }, [])

  const setTyping = useCallback(async (userId: string, isTyping: boolean) => {
    const typingRef = ref(rtdb, `chatTyping/${userId}`)
    await update(typingRef, {
      isAdminTyping: isTyping,
      timestamp: Date.now()
    })
  }, [])

  const closeChat = useCallback(async (userId: string) => {
    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    await update(metadataRef, { status: 'closed' })
  }, [])

  const reopenChat = useCallback(async (userId: string) => {
    const metadataRef = ref(rtdb, `chats/${userId}/metadata`)
    await update(metadataRef, { status: 'active' })
  }, [])

  const getTypingStatus = useCallback((userId: string, callback: (isTyping: boolean) => void) => {
    const typingRef = ref(rtdb, `chatTyping/${userId}`)
    
    const unsubscribe = onValue(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as TypingStatus
        callback(data.isUserTyping || false)
      } else {
        callback(false)
      }
    })

    return unsubscribe
  }, [])

  return {
    conversations,
    loading,
    totalUnread,
    selectedUserId,
    setSelectedUserId,
    sendReply,
    markAsRead,
    setTyping,
    closeChat,
    reopenChat,
    getTypingStatus
  }
}
