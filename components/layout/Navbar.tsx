'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, Home, Package, MessageCircle, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useChatUnreadCount } from '@/hooks/useChatUnreadCount'
import { useLayout } from './LayoutContext'
import { cn } from '@/lib/utils'
import MobileMenu from './MobileMenu'
import SearchOverlay from './SearchOverlay'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Package, label: 'Products', href: '/products' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, isAdmin } = useAuth()
  const { totalItems, toggleCart } = useCart()
  const chatUnreadCount = useChatUnreadCount(user?.uid || '')
  const { hideNavbar } = useLayout()

  if (hideNavbar) return null

  return (
    <>
      {/* Header (Desktop + Mobile) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-mango rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <span className="text-base font-semibold text-slate-900">Malir Mangoes</span>
              </Link>
            </div>

            {/* Nav Items (Desktop only) */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors',
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                href="/cart"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="ml-1 min-w-[18px] h-[18px] flex items-center justify-center bg-mango text-white text-[10px] font-bold rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search (mobile) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-1.5 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart (mobile only) */}
              <button
                onClick={toggleCart}
                className="md:hidden relative p-1.5 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-mango text-white text-[9px] font-bold rounded-full px-1">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {user && (
                <Link
                  href="/chat"
                  className="hidden md:flex relative items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
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
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
