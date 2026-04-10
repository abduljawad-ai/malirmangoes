'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ArrowRight } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { formatPKR } from '@/lib/utils'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { products } = useProducts({ limitCount: 50 })
  
  // Debounce the search query (300ms delay)
  const debouncedQuery = useDebounce(query, 300)

  // Use a key to force re-render when open changes, which resets the input
  const [inputKey, setInputKey] = useState(0)

  // Simple filter without debounce - filter happens on client with small product list
  const results = useMemo(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return []
    
    const lowerQuery = trimmed.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    ).slice(0, 6)
  }, [products, query])

  useEffect(() => {
    if (open) {
      setInputKey(k => k + 1)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Memoize the filtered results
  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim()
    if (trimmed.length < 2) return []
    
    const lowerQuery = trimmed.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    ).slice(0, 6)
  }, [products, debouncedQuery])

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  if (!open) return null

  const showInitial = query.trim().length < 2

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            key={inputKey}
            ref={inputRef}
            type="text"
            defaultValue=""
            onChange={handleQueryChange}
            placeholder="Search mangoes..."
            className="flex-1 text-base text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {showInitial ? (
            <p className="text-sm text-slate-400 text-center py-8">Type at least 2 characters to search</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {results.map(product => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0">
                    {product.images?.[0]?.webp ? (
                      <Image src={product.images[0].webp} alt={product.name} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">🥭</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatPKR(product.salePrice || product.price)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <Link
            href={`/products?focus=search`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-mango-50 text-mango text-sm font-medium hover:bg-mango-100 transition-colors border-t border-slate-100"
          >
            View all results for &ldquo;{query}&rdquo; <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
