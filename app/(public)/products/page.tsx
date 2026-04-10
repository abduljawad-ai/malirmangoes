'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import FilterSidebar from '@/components/products/FilterSidebar'
import { useProducts } from '@/hooks/useProducts'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'

function ProductsContent() {
  const { products, loading } = useProducts()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const cat = searchParams.get('category') || ''
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategory(cat)
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get('focus') === 'search') {
      searchInputRef.current?.focus()
    }
  }, [searchParams])

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  const filtered = products
    .filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.salePrice || a.price) - (b.salePrice || b.price)
      if (sortBy === 'price-desc') return (b.salePrice || b.price) - (a.salePrice || a.price)
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} products</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
          <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search mangoes..."
          className="flex-1 h-10 px-3 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango text-slate-900 placeholder:text-slate-400"
        />
        <Button
          variant="outline"
          size="md"
          className="lg:hidden"
          onClick={() => setMobileFilterOpen(true)}
          icon={<Filter className="w-4 h-4" />}
        >
          Filters
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat)
            if (cat) {
              router.push(`/products?category=${cat}`, { scroll: false })
            } else {
              router.push('/products', { scroll: false })
            }
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          mobileOpen={mobileFilterOpen}
          onMobileClose={() => setMobileFilterOpen(false)}
        />

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 mb-4">No products found</p>
              <Button variant="outline" onClick={() => { setSelectedCategory(''); setSearch('') }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-6"><ProductGridSkeleton count={8} /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
