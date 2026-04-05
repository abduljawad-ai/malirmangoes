'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useChatUnreadCount } from '@/hooks/useChatUnreadCount'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ChatWidget() {
  const { user, isAdmin } = useAuth()
  const unreadCount = useChatUnreadCount(user?.uid || '')
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible || isAdmin) return null
  if (pathname === '/checkout' || pathname === '/checkout/success') return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            href="/chat"
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300",
              unreadCount > 0 
                ? "bg-mango text-white" 
                : "bg-white text-mango border border-mango/20"
            )}
          >
            <div className="relative">
              <MessageCircle className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-bounce-subtle">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
