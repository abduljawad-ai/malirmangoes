'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ref, 
  query, 
  get, 
  orderByChild, 
  equalTo, 
  limitToFirst
} from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { Product } from '@/types'

interface UseProductsOptions {
  category?: string
  limitCount?: number
  featuredOnly?: boolean
  searchQuery?: string
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, limitCount = 12, featuredOnly = false } = options
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      // RTDB base query (fetch active products)
      const productsRef = ref(rtdb, 'products')
      const q = query(
        productsRef, 
        orderByChild('isActive'), 
        equalTo(true),
        limitToFirst(limitCount * 2) // Fetch a bit extra for client-side filtering
      )

      const snapshot = await get(q)
      if (snapshot.exists()) {
        let items: Product[] = []
        snapshot.forEach((child) => {
          items.push({ id: child.key, ...child.val() } as Product)
        })

        // Sort by createdAt desc (client side for simplicity in RTDB)
        items.sort((a, b) => {
          const timeA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : 0
          const timeB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : 0
          return timeB - timeA
        })

        // Filter by category
        if (category && category !== 'all') {
          items = items.filter(p => p.category === category)
        }

        // Filter by featured
        if (featuredOnly) {
          items = items.filter(p => p.isFeatured)
        }

        const paginatedItems = items.slice(0, limitCount)
        setProducts(paginatedItems)
        setHasMore(items.length > limitCount)
      } else {
        setProducts([])
        setHasMore(false)
      }
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [category, featuredOnly, limitCount])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore: () => {}, // RTDB pagination is different, skipping for now
    refresh: () => fetchProducts()
  }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const productsRef = ref(rtdb, 'products')
        const q = query(productsRef, orderByChild('slug'), equalTo(slug), limitToFirst(1))
        const snapshot = await get(q)
        
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, Record<string, unknown>>
          const id = Object.keys(data)[0]
          setProduct({ ...data[id], id } as Product)
        } else {
          setProduct(null)
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  return { product, loading, error }
}
