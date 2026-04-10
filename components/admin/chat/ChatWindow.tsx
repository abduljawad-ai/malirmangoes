'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Send, MoreVertical, ArrowLeft, ZoomIn, Loader2 } from 'lucide-react'
import { ChatMessage, ChatMetadata } from '@/types/chat'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import DOMPurify from 'dompurify'

function sanitize(str: string): string {
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

interface ChatWindowProps {
  userId: string
  messages: ChatMessage[]
  metadata: ChatMetadata | null
  onSendReply: (text: string) => void
  onMarkAsRead: () => void
  onSetTyping: (isTyping: boolean) => void
  onCloseChat: () => void
  onReopenChat: () => void
  isUserTyping: boolean
  isMobile?: boolean
  onBack?: () => void
  onToggleInfo?: () => void
}

export default function ChatWindow({
  userId,
  messages,
  metadata,
  onSendReply,
  onMarkAsRead,
  onSetTyping,
  onCloseChat,
  onReopenChat,
  isUserTyping,
  isMobile,
  onBack,
  onToggleInfo
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  // Mark as read when opening
  useEffect(() => {
    onMarkAsRead()
  }, [userId, onMarkAsRead])

  const handleSend = () => {
    if (!inputText.trim()) return
    onSendReply(inputText)
    setInputText('')
    onSetTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
    
    // Typing indicator
    onSetTyping(true)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onSetTyping(false)
    }, 1000)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message) => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    }, {} as Record<string, typeof messages>)
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-cream/30">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-mango/10 rounded-lg transition-colors"
              title="Back to chat list"
            >
              <ArrowLeft className="w-5 h-5 text-muted" />
            </button>
          )}
          
          <div className="w-10 h-10 bg-gradient-to-br from-mango/20 to-mango/40 rounded-xl flex items-center justify-center text-lg font-bold text-mango">
            {metadata?.userName?.[0]?.toUpperCase() || '?'}
          </div>
          
          <div>
            <h3 className="font-bold text-dark">{metadata?.userName || 'Unknown User'}</h3>
            <p className="text-xs text-muted flex items-center gap-2">
              <span className="max-w-[150px] truncate">{metadata?.userEmail}</span>
              {isUserTyping && (
                <span className="text-mango flex items-center gap-1">
                  <span className="animate-pulse">●</span> typing...
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* User Info Toggle Button */}
          <button 
            onClick={onToggleInfo}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-bold text-dark hover:bg-mango/10 hover:text-mango hover:border-mango/20 transition-all shadow-sm"
            title="View customer details"
          >
            <MoreVertical className="w-4 h-4" />
            <span className="hidden sm:inline">User Details</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-muted hover:text-mango hover:bg-mango/10 rounded-lg transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[160px] z-10">
                {metadata?.status === 'active' ? (
                  <button
                    onClick={() => { onCloseChat(); setShowActions(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-muted hover:bg-cream transition-colors"
                  >
                    Close Conversation
                  </button>
                ) : (
                  <button
                    onClick={() => { onReopenChat(); setShowActions(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-mango hover:bg-mango/10 transition-colors"
                  >
                    Reopen Conversation
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Product Context */}
      {metadata?.contextProductName && (
        <div className="p-3 bg-mango/5 border-b border-mango/10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Chatting about:</span>
            <span className="font-medium text-mango">{metadata.contextProductName}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-mango/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-muted">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-3">
              <div className="flex justify-center">
                <span className="text-xs text-muted bg-border/50 px-3 py-1 rounded-full">
                  {formatDate(new Date(date).getTime())}
                </span>
              </div>
              {msgs.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.sender === 'admin' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-3 rounded-2xl',
                      message.sender === 'admin'
                        ? 'bg-mango text-white rounded-br-md'
                        : 'bg-white border border-border text-dark rounded-bl-md'
                    )}
                  >
                    {message.imageUrl && (
                      <button
                        onClick={() => setPreviewImage(message.imageUrl!)}
                        className="mb-2 rounded-lg overflow-hidden block hover:opacity-90 transition-opacity relative group"
                      >
                        <Image
                          src={message.imageUrl}
                          alt="Attached image"
                          width={280}
                          height={180}
                          className="object-contain max-h-[200px] w-auto rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-1.5">
                            <ZoomIn className="w-3.5 h-3.5 text-slate-700" />
                          </div>
                        </div>
                      </button>
                    )}
                    {message.text && (
                      <p className="text-sm leading-relaxed">{sanitize(message.text)}</p>
                    )}
                    <p 
                      className={cn(
                        'text-xs mt-1',
                        message.sender === 'admin' ? 'text-white/70' : 'text-muted'
                      )}
                    >
                      {formatTime(message.timestamp)}
                      {message.sender === 'admin' && (
                        <span className="ml-2">
                          {message.seen ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        
        {isUserTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-border px-4 py-3 rounded-2xl rounded-bl-md">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-mango rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-mango rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-mango rounded-full animate-bounce" />
      </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-white">
        <div className="flex items-center gap-2 bg-cream rounded-2xl p-2 border border-border focus-within:border-mango/30 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your reply..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-dark placeholder:text-muted"
            disabled={metadata?.status === 'closed'}
          />
            <button
            onClick={handleSend}
            disabled={!inputText.trim() || metadata?.status === 'closed'}
            title="Send reply"
            className={cn(
              'p-3 rounded-xl transition-all',
              inputText.trim() && metadata?.status !== 'closed'
                ? 'bg-mango text-white hover:bg-mango-dark shadow-lg shadow-mango/20'
                : 'bg-border text-muted cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {metadata?.status === 'closed' && (
          <p className="text-center text-xs text-muted mt-2">
            This conversation is closed. Click &quot;Reopen Conversation&quot; to reply.
          </p>
        )}
      </div>

      {/* Full-screen Image Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Image
              src={previewImage}
              alt="Full view"
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
