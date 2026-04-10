'use client'

import React, { useState } from 'react'
import { Search, MessageSquare, Clock, XCircle } from 'lucide-react'
import { ChatConversation } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatListProps {
  conversations: ChatConversation[]
  selectedUserId: string | null
  onSelectChat: (userId: string) => void
  loading?: boolean
}

export default function ChatList({ 
  conversations, 
  selectedUserId, 
  onSelectChat,
  loading 
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'active' | 'closed'>('all')

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.metadata?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.metadata?.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.metadata?.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? (conv.metadata?.unreadByAdmin || 0) > 0 :
      filter === 'active' ? conv.metadata?.status === 'active' :
      filter === 'closed' ? conv.metadata?.status === 'closed' :
      true

    return matchesSearch && matchesFilter
  })

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes < 1 ? 'Just now' : `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else if (days < 7) {
      return `${days}d ago`
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-white border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="h-10 bg-border/50 rounded-xl animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-border/50 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-border/50 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-border/50 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-white border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-cream/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-dark flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-mango" />
            Conversations
          </h2>
          <span className="text-xs text-muted bg-border/50 px-2 py-1 rounded-full">
            {conversations.length} total
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-mango/30 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1">
          {(['all', 'unread', 'active', 'closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors',
                filter === f
                  ? 'bg-mango text-white'
                  : 'text-muted hover:bg-mango/10'
              )}
            >
              {f}
              {f === 'unread' && (
                <span className="ml-1">
                  {conversations.reduce((sum, c) => sum + (c.metadata?.unreadByAdmin || 0), 0)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <MessageSquare className="w-12 h-12 text-muted/30 mb-2" />
            <p className="text-muted text-sm">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.userId}
              onClick={() => onSelectChat(conv.userId)}
              className={cn(
                'w-full p-3 border-b border-border text-left transition-all',
                selectedUserId === conv.userId
                  ? 'bg-mango/5 border-l-4 border-l-mango'
                  : 'hover:bg-cream/30 border-l-4 border-l-transparent'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-mango/20 to-mango/40 rounded-lg flex items-center justify-center text-sm font-bold text-mango">
                    {conv.metadata?.userName?.[0]?.toUpperCase() || '?'}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={cn(
                      'font-semibold truncate text-sm',
                      selectedUserId === conv.userId ? 'text-mango' : 'text-dark'
                    )}>
                      {conv.metadata?.userName || 'Unknown User'}
                    </h3>
                    <span className="text-[11px] text-muted flex-shrink-0">
                      {conv.metadata?.lastMessageTime && formatTime(conv.metadata.lastMessageTime)}
                    </span>
                  </div>

                  <p className="text-xs text-muted truncate mb-1.5">
                    {conv.metadata?.lastMessage || 'No messages yet'}
                  </p>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5">
                    {(conv.metadata?.unreadByAdmin || 0) > 0 && (
                      <span className="px-2 py-0.5 bg-mango text-white text-[10px] font-bold rounded-full">
                        {conv.metadata.unreadByAdmin}
                      </span>
                    )}
                    
                    {conv.metadata?.contextProductName && (
                      <span className="px-2 py-0.5 bg-cream text-dark text-[10px] rounded-full flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {conv.metadata.contextProductName.slice(0, 18)}
                        {conv.metadata.contextProductName.length > 18 && '...'}
                      </span>
                    )}

                    {conv.metadata?.status === 'closed' && (
                      <span className="px-2 py-0.5 bg-border text-muted text-[10px] rounded-full flex items-center gap-1">
                        <XCircle className="w-2.5 h-2.5" />
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
