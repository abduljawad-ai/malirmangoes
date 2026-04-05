'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Leaf, Heart, Info } from 'lucide-react'
import { useLayout } from './LayoutContext'
import { useSettings } from '@/hooks/useSettings'

const shopLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'Chaunsa', href: '/products?category=chaunsa' },
  { label: 'Sindhri', href: '/products?category=sindhri' },
  { label: 'Anwar Ratol', href: '/products?category=anwar-ratol' },
]

const infoLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/chat' },
]

export default function Footer() {
  const { hideFooter } = useLayout()
  const { settings } = useSettings()

  if (hideFooter) return null

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-mango rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="text-base font-semibold text-white">Malir Mangoes</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fresh Pakistani mangoes delivered to your doorstep.
            </p>
            {/* Social Icons */}
            {(settings.facebook || settings.instagram) && (
              <div className="flex items-center gap-3 pt-1">
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center hover:border-mango hover:text-mango transition-colors text-slate-400"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center hover:border-mango hover:text-mango transition-colors text-slate-400"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
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

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Info
            </h4>
            <ul className="space-y-2">
              {infoLinks.map(link => (
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
              <span className="text-slate-400">{settings.address || 'Multan, Pakistan'}</span>
            </div>
            {settings.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-mango flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-slate-400 hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-mango flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-slate-400 hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            © {new Date().getFullYear()} Malir Mangoes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
