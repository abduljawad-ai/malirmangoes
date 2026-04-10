'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { MessageSquare } from 'lucide-react'
import { useAdminChats } from '@/hooks/useAdminChats'
import { useAuth } from '@/hooks/useAuth'
import ChatList from '@/components/admin/chat/ChatList'
import ChatWindow from '@/components/admin/chat/ChatWindow'
import UserInfoPanel from '@/components/admin/chat/UserInfoPanel'
import { cn } from '@/lib/utils'

export default function AdminChatPage() {
  const { isAdmin } = useAuth()
  const adminChats = useAdminChats()
  const [isUserTyping, setIsUserTyping] = useState<Record<string, boolean>>({})
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Reactive mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const selectedConversation = adminChats.conversations.find(
    c => c.userId === adminChats.selectedUserId
  )

  // Reset showUserInfo when user changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowUserInfo(false)
  }, [adminChats.selectedUserId])

  useEffect(() => {
    if (!adminChats.selectedUserId) return

    const unsubscribe = adminChats.getTypingStatus(
      adminChats.selectedUserId,
      (isTyping) => {
        setIsUserTyping(prev => ({
          ...prev,
          [adminChats.selectedUserId!]: isTyping
        }))
      }
    )

    return () => unsubscribe()
  }, [adminChats.selectedUserId, adminChats.getTypingStatus])

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-dark mb-2">Access Denied</h2>
          <p className="text-muted">You don&apos;t have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-mango" />
            Live Chat
          </h1>
          <p className="text-muted mt-1">
            Manage customer conversations and support requests
          </p>
        </div>
        
        {adminChats.totalUnread > 0 && (
          <div className="px-4 py-2 bg-mango/10 rounded-xl">
            <span className="text-sm font-medium text-mango">
              {adminChats.totalUnread} unread message{adminChats.totalUnread > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-border overflow-hidden shadow-sm relative">
        <div className="flex h-full">
          <div className={cn(
            'w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-border',
            adminChats.selectedUserId && 'hidden lg:flex'
          )}>
            <ChatList
              conversations={adminChats.conversations}
              selectedUserId={adminChats.selectedUserId}
              onSelectChat={adminChats.setSelectedUserId}
              loading={adminChats.loading}
            />
          </div>

          <div className={cn(
            'flex-1 min-w-0 relative',
            !adminChats.selectedUserId && 'hidden lg:flex lg:items-center lg:justify-center'
          )}>
            {adminChats.selectedUserId && selectedConversation ? (
              <ChatWindow
                userId={selectedConversation.userId}
                messages={selectedConversation.messages}
                metadata={selectedConversation.metadata}
                onSendReply={(text) => adminChats.sendReply(selectedConversation.userId, text)}
                onMarkAsRead={() => adminChats.markAsRead(selectedConversation.userId)}
                onSetTyping={(isTyping) => adminChats.setTyping(selectedConversation.userId, isTyping)}
                onCloseChat={() => adminChats.closeChat(selectedConversation.userId)}
                onReopenChat={() => adminChats.reopenChat(selectedConversation.userId)}
                isUserTyping={isUserTyping[selectedConversation.userId] || false}
                isMobile={isMobile}
                onBack={() => adminChats.setSelectedUserId(null)}
                onToggleInfo={() => setShowUserInfo(!showUserInfo)}
              />
            ) : (
              <div className="text-center px-4">
                <div className="w-20 h-20 bg-mango/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-mango" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">Select a Conversation</h3>
                <p className="text-muted max-w-xs mx-auto">
                  Choose a customer from the list to view their messages and order details
                </p>
              </div>
            )}
          </div>

          {adminChats.selectedUserId && selectedConversation && (
            <div className={cn(
              "fixed inset-y-0 right-0 w-80 z-50 bg-white shadow-2xl transition-transform duration-300 transform lg:static lg:shadow-none lg:block lg:border-l lg:border-border",
              showUserInfo ? "translate-x-0" : "translate-x-full lg:translate-x-0",
              !showUserInfo && "hidden xl:block"
            )}>
              <UserInfoPanel
                userId={selectedConversation.userId}
                metadata={selectedConversation.metadata}
                onClose={() => setShowUserInfo(false)}
              />
            </div>
          )}

          {showUserInfo && (
            <div 
              className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setShowUserInfo(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
