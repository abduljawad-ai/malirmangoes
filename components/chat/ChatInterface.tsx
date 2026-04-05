'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, ShoppingBag, ArrowLeft, MessageCircle, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/hooks/useAuth'
import { cn, formatPKR, getValidImageUrl } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import ImageAttachment from './ImageAttachment'
import ImagePreview from './ImagePreview'
import toast from 'react-hot-toast'

interface ChatInterfaceProps {
  productInfo?: {
    id: string
    slug?: string
    name: string
    image?: string
    price?: number
  }
}

export default function ChatInterface({ productInfo }: ChatInterfaceProps) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [inputText, setInputText] = useState('')
  const [pendingImage, setPendingImage] = useState<{ file: File; preview: string } | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const chat = useChat({
    userId: user?.uid || '',
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPhotoURL: user?.photoURL
  })

  // Auto-scroll to bottom only when new messages arrive
  const lastMessageId = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].id : ''
  useEffect(() => {
    if (lastMessageId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageId])

  // Mark as read when messages change (not on every render)
  const messagesLength = chat.messages.length
  useEffect(() => {
    if (messagesLength > 0) {
      chat.markAsRead()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesLength])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputText(value)
    
    chat.setTyping(true)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      chat.setTyping(false)
    }, 2000)
  }

  const handleImageSelect = (file: File) => {
    const preview = URL.createObjectURL(file)
    setPendingImage({ file, preview })
  }

  const handleRemoveImage = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage.preview)
    }
    setPendingImage(null)
  }

  const handleSend = useCallback(async () => {
    if ((!inputText.trim() && !pendingImage) || chat.isSending || chat.isUploading) return
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    chat.setTyping(false)
    
    const textToSend = inputText
    const imageToSend = pendingImage
    setInputText('')
    setPendingImage(null)
    
    let imageUrl: string | undefined

    if (imageToSend) {
      const uploadedUrl = await chat.uploadImage(imageToSend.file)
      if (!uploadedUrl) {
        toast.error('Failed to upload image')
        return
      }
      imageUrl = uploadedUrl
    }
    
    await chat.sendMessage(
      textToSend,
      productInfo ? {
        id: productInfo.id,
        slug: productInfo.slug,
        name: productInfo.name,
        image: productInfo.image
      } : undefined,
      imageUrl
    )
  }, [inputText, pendingImage, chat, productInfo])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const groupedMessages = chat.messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, typeof chat.messages>)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-mango/10 rounded-full flex items-center justify-center mb-6">
          <MessageCircle className="w-10 h-10 text-mango" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Sign in to Chat</h2>
        <p className="text-muted mb-6">Please sign in to start a conversation with our team</p>
        <Link 
          href="/login?redirect=/chat"
          className="px-8 py-3 bg-mango text-white font-semibold rounded-xl hover:bg-mango-dark transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      {isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-800 text-sm">
            <span className="text-lg">⚠️</span>
            <p>
              <span className="font-bold">Admin Mode:</span> This is the customer-facing chat. 
              To manage all conversations, please use the <strong>Admin Dashboard</strong>.
            </p>
          </div>
          <Link 
            href="/admin/chat"
            className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      <div className="flex items-center gap-4 p-4 border-b border-border bg-gradient-to-r from-mango/5 to-transparent">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-mango/10 rounded-xl transition-colors lg:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-muted" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-mango to-mango-dark rounded-xl flex items-center justify-center">
            <span className="text-xl">🥭</span>
          </div>
          <div>
            <h1 className="font-bold text-dark">MangoStore Support</h1>
            <p className="text-xs text-muted">
              {chat.isAdminTyping ? (
                <span className="text-mango flex items-center gap-1">
                  <span className="animate-pulse">●</span> Admin is typing...
                </span>
              ) : (
                'Typically replies within minutes'
              )}
            </p>
          </div>
        </div>
      </div>

      {productInfo && (
        <div className="p-3 bg-cream/50 border-b border-border">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border/50">
            {productInfo.image && (
              <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                <Image
                  src={productInfo.image}
                  alt={productInfo.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted uppercase tracking-wider">Chatting about</p>
              <p className="font-semibold text-dark truncate">{productInfo.name}</p>
              {productInfo.price && (
                <p className="text-sm text-mango font-medium">{formatPKR(productInfo.price)}</p>
              )}
            </div>
            <Link 
              href={`/products/${productInfo.slug || productInfo.id}`}
              className="p-2 text-muted hover:text-mango hover:bg-mango/10 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/20">
        {chat.loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-mango/20 rounded-full mb-3" />
              <div className="h-4 bg-mango/20 rounded w-32" />
            </div>
          </div>
        ) : chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 bg-mango/10 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-mango" />
            </div>
            <h3 className="text-lg font-bold text-dark mb-2">Start a conversation</h3>
            <p className="text-muted text-sm max-w-xs">
              {productInfo 
                ? `Ask us anything about ${productInfo.name}`
                : 'Have a question? Our team is here to help you with anything you need.'
              }
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="space-y-3">
              <div className="flex justify-center">
                <span className="text-xs text-muted bg-border/50 px-3 py-1 rounded-full">
                  {formatDate(new Date(date).getTime())}
                </span>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-3 rounded-2xl',
                      message.sender === 'user'
                        ? 'bg-mango text-white rounded-br-md'
                        : 'bg-white border border-border text-dark rounded-bl-md'
                    )}
                  >
                    {message.imageUrl && (
                      <button
                        onClick={() => setPreviewImage(message.imageUrl!)}
                        className="mb-2 rounded-lg overflow-hidden block hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={message.imageUrl}
                          alt="Attached image"
                          width={280}
                          height={180}
                          className="object-contain max-h-[200px] w-auto rounded-lg"
                        />
                      </button>
                    )}
                    {message.text && (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    )}
                    <p 
                      className={cn(
                        'text-xs mt-1',
                        message.sender === 'user' ? 'text-white/70' : 'text-muted'
                      )}
                    >
                      {formatTime(message.timestamp)}
                      {message.sender === 'user' && (
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
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Before Sending */}
      {pendingImage && (
        <div className="px-4 pt-3 bg-white border-t border-border">
          <div className="relative inline-block">
            <Image
              src={pendingImage.preview}
              alt="Pending image"
              width={200}
              height={130}
              className="object-contain max-h-[130px] w-auto rounded-lg border border-slate-200"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border bg-white">
        <div className="flex items-center gap-2 bg-cream rounded-2xl p-2 border border-border focus-within:border-mango/30 transition-colors">
          <ImageAttachment
            onImageSelect={handleImageSelect}
            disabled={chat.isSending || chat.isUploading}
          />
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={chat.isSending || chat.isUploading}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-dark placeholder:text-muted disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !pendingImage) || chat.isSending || chat.isUploading}
            title="Send message"
            className={cn(
              'p-3 rounded-xl transition-all',
              (inputText.trim() || pendingImage) && !chat.isSending && !chat.isUploading
                ? 'bg-mango text-white hover:bg-mango-dark shadow-lg shadow-mango/20'
                : 'bg-border text-muted cursor-not-allowed'
            )}
          >
            {chat.isSending || chat.isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-center text-xs text-muted mt-2">
          Press Enter to send a message · Images up to 5MB
        </p>
      </div>

      {/* Full-screen Image Preview */}
      {previewImage && (
        <ImagePreview
          src={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  )
}
