'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, Search, Home, Package, MessageCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useChatUnreadCount } from '@/hooks/useChatUnreadCount'
import { useLayout } from './LayoutContext'
import MobileMenu from './MobileMenu'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/products' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: ShoppingCart, label: 'Cart', href: '#', isCart: true },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAdmin, loading } = useAuth()
  const { totalItems, toggleCart } = useCart()
  const chatUnreadCount = useChatUnreadCount(user?.uid || '')
  const { hideNavbar } = useLayout()

  if (hideNavbar) return null

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-mango rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="text-base font-semibold text-slate-900">MangoStore</span>
            </Link>

            {/* Nav Items */}
            <nav className="flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={item.isCart ? toggleCart : undefined}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors',
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.isCart && totalItems > 0 && (
                    <span className="ml-1 min-w-[18px] h-[18px] flex items-center justify-center bg-mango text-white text-[10px] font-bold rounded-full px-1">
                      {totalItems}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {user && (
                <Link
                  href="/chat"
                  className="relative flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                  {chatUnreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1">
                      {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                    </span>
                  )}
                </Link>
              )}
              {user ? (
                <Link
                  href={isAdmin ? '/admin' : '/customer'}
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {user.name?.[0]?.toUpperCase() || '?'}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-mango hover:bg-mango-50 rounded-md transition-colors"
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={item.isCart ? toggleCart : undefined}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-500 hover:text-slate-900 transition-colors relative"
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.isCart && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 flex items-center justify-center bg-mango text-white text-[8px] font-bold rounded-full px-0.5">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">Menu</span>
          </button>
        </div>
      </nav>

      <MobileMenu open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}
