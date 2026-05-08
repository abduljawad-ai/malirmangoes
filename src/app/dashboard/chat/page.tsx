'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { MessageCircle, Send, User } from 'lucide-react'

interface Message {
  id: string
  created_at: string
  message: string
  sender_id: string
  is_admin: boolean
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    if (!user) return
    try {
      const res = await fetch('/api/chat')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return
    
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      })
      if (res.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (e) {
      console.error('Failed to send message:', e)
    }
    setSending(false)
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat Support
        </h1>
        <button 
          onClick={fetchMessages}
          disabled={refreshing}
          className="text-sm text-orange-600 hover:underline"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender_id === user?.id 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-orange-100' : 'text-gray-500'}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button 
            type="submit" 
            disabled={sending || !newMessage.trim()}
            className="bg-orange-500 text-white p-2 rounded-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}