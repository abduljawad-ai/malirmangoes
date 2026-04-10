'use client'

import Link from 'next/link'
import { ArrowRight, Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
          <span className="text-[150px] leading-none select-none block" role="img" aria-label="Mango">
            🥭
          </span>
          <div className="absolute -top-2 -right-4 text-5xl animate-bounce-subtle">🍃</div>
        </div>

        <div className="text-7xl font-extrabold text-mango mb-3">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Looks like this page went mango-ing!
        </h1>
        <p className="text-slate-500 mb-8 text-base sm:text-lg leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or maybe it&apos;s just not in season yet.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-mango hover:bg-mango-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-mango/20"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
