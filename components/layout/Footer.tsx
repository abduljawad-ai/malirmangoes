'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, MessageSquare, Share2, Globe, Video, MapPin, Phone, Mail, Leaf, Truck, Shield, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLayout } from './LayoutContext'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const socialLinks = [
  { icon: MessageSquare, href: '#', label: 'WhatsApp' },
  { icon: Share2, href: '#', label: 'Facebook' },
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Video, href: '#', label: 'YouTube' },
]

const shopLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'Chaunsa', href: '/products?category=chaunsa' },
  { label: 'Sindhri', href: '/products?category=sindhri' },
  { label: 'Anwar Ratol', href: '/products?category=anwar-ratol' },
]

const supportLinks = [
  { label: 'Track Order', href: '/customer' },
  { label: 'Shipping Info', href: '#' },
  { label: 'Returns', href: '#' },
  { label: 'FAQ', href: '#' },
]

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Our Orchards', href: '#' },
  { label: 'Contact', href: '#' },
]

export default function Footer() {
  const { user } = useAuth()
  const { hideFooter } = useLayout()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  if (hideFooter) return null

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Newsletter */}
        <div className="bg-slate-800 rounded-lg p-6 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white mb-1">Stay Updated</h3>
              <p className="text-sm text-slate-400">Get exclusive deals and harvest updates.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 sm:w-56 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:border-mango transition-colors"
              />
              <Button type="submit" size="sm" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
          {subscribed && (
            <p className="mt-2 text-sm text-leaf">Thanks for subscribing!</p>
          )}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-mango rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="text-base font-semibold text-white">MangoStore</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fresh Pakistani mangoes delivered to your doorstep.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-9 h-9 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-mango transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" /> Shop
            </h4>
            <ul className="space-y-2">
              {shopLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-mango mt-0.5 flex-shrink-0" />
              <span className="text-slate-400">Multan, Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-mango flex-shrink-0" />
              <span className="text-slate-400">+92 300 1234567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-mango flex-shrink-0" />
              <span className="text-slate-400">hello@mangostore.pk</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            © 2026 MangoStore. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Pakistan
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
