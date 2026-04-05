'use client'

import React from 'react'
import Link from 'next/link'
import { X, Home, Package, ShoppingCart, MessageCircle, User, Heart, LogOut, Settings, LayoutDashboard, Users, BarChart3 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user, isAdmin, logout } = useAuth()

  if (!open) return null

  const mainLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Package, label: 'Products', href: '/products' },
  ]

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: MessageCircle, label: 'Live Chat', href: '/admin/chat' },
    { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  const customerLinks = [
    { icon: MessageCircle, label: 'Chat', href: '/chat' },
    { icon: Package, label: 'My Orders', href: '/customer' },
    { icon: User, label: 'Profile', href: '/customer/profile' },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <span className="text-base font-semibold text-slate-900">Menu</span>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-mango rounded-md hover:bg-mango-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        <nav className="p-4 space-y-1">
          {mainLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {user && (
          <nav className="p-4 space-y-1 border-t border-slate-100">
            {(isAdmin ? adminLinks : customerLinks).map(link => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {user && (
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={() => { logout(); onClose() }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-danger hover:bg-danger-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  )
}
