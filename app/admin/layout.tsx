'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
  BarChart3,
  Store,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLayout } from '@/components/layout/LayoutContext'
import { cn } from '@/lib/utils'
import { useAdminChats } from '@/hooks/useAdminChats'

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Live Chat', href: '/admin/chat', icon: MessageSquare, showBadge: true },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'CMS', href: '/admin/cms', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, isAdmin, logout } = useAuth()
  const { setHideNavbar, setHideFooter } = useLayout()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { totalUnread } = useAdminChats()

  useEffect(() => {
    setHideNavbar(true)
    setHideFooter(true)
    return () => {
      setHideNavbar(false)
      setHideFooter(false)
    }
  }, [setHideNavbar, setHideFooter])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin')
    }
  }, [user, isAdmin, loading, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-mango" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-slate-200 z-40 flex flex-col transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-mango rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navigation.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-mango-50 text-mango font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.showBadge && totalUnread > 0 && (
                  <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 mb-2 px-2">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
              {user.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 flex-1 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger-50 rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
            <Link
              href="/"
              className="flex items-center justify-center px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-md">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link href="/" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Visit Store →
          </Link>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
