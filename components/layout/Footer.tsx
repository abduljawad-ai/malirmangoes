'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Leaf, Heart } from 'lucide-react'
import { useLayout } from './LayoutContext'
import { cn } from '@/lib/utils'

const shopLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'Chaunsa', href: '/products?category=chaunsa' },
  { label: 'Sindhri', href: '/products?category=sindhri' },
  { label: 'Anwar Ratol', href: '/products?category=anwar-ratol' },
]

export default function Footer() {
  const { hideFooter } = useLayout()

  if (hideFooter) return null

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
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

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact</h4>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-mango flex-shrink-0" />
              <span className="text-slate-400">Multan, Pakistan</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-mango flex-shrink-0" />
              <span className="text-slate-400">+92 300 1234567</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-mango flex-shrink-0" />
              <span className="text-slate-400">hello@mangostore.pk</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            © 2026 MangoStore. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  )
}
