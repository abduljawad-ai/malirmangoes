'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, Package, LogOut, MessageCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLayout } from '@/components/layout/LayoutContext'
import { cn } from '@/lib/utils'

const customerLinks = [
  { icon: Package, label: 'My Orders', href: '/customer' },
  { icon: User, label: 'Profile', href: '/customer/profile' },
  { icon: MessageCircle, label: 'Chat', href: '/chat' },
]

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { setHideNavbar, setHideFooter } = useLayout()

  useEffect(() => {
    setHideNavbar(true)
    setHideFooter(true)
    return () => {
      setHideNavbar(false)
      setHideFooter(false)
    }
  }, [setHideNavbar, setHideFooter])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-mango" />
      </div>
    )
  }

  if (!user) {
    router.push('/login?redirect=/customer')
    return null
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Drawer */}
      <aside className={cn(
        'fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform',
        drawerOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-mango rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">MangoStore</span>
          </Link>
          <button onClick={() => setDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {customerLinks.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-mango-50 text-mango font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => { logout(); setDrawerOpen(false) }}
            className="flex items-center gap-1.5 w-full px-3 py-2 text-sm font-medium text-danger hover:bg-danger-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 flex items-center justify-between">
        <button onClick={() => setDrawerOpen(true)} className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-slate-900">My Account</span>
        <Link href="/" className="text-xs font-medium text-mango hover:text-mango-600 transition-colors">
          Shop →
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {children}
      </div>
    </>
  )
}
