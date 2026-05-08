'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  Home, 
  ShoppingBag, 
  Settings, 
  MessageCircle, 
  Package, 
  User,
  LogOut,
  Menu,
  X,
  Store
} from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const userLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard/orders', label: 'My Orders', icon: Package },
    { href: '/dashboard/chat', label: 'Chat', icon: MessageCircle },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Admin Panel', icon: Settings },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40
        transform transition-transform duration-200
        lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🥭</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Malir Mangoes</h1>
                <p className="text-xs text-gray-500">Fresh & Juicy</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(link.href) 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}

            {/* Admin Links */}
            {user && (user.role === 'admin' || user.role === 'seller') && (
              <>
                <div className="pt-4">
                  <p className="text-xs text-gray-400 uppercase px-4">Admin</p>
                </div>
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive(link.href) 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100">
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            ) : (
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}