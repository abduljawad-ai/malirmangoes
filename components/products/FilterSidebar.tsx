'use client'

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name A-Z' },
]

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  mobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const content = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sort By</h3>
        <div className="space-y-1">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                sortBy === opt.value
                  ? 'bg-mango text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange('')}
            className={cn(
              'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
              selectedCategory === ''
                ? 'bg-mango text-white font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize',
                selectedCategory === cat
                  ? 'bg-mango text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {cat.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onMobileClose} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-5 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Filters</h2>
              <button onClick={onMobileClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-20">{content}</div>
      </aside>
    </>
  )
}
