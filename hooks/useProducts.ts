'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  ref, 
  get, 
  query,
  orderByChild,
  equalTo,
} from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { Product } from '@/types'

interface UseProductsOptions {
  category?: string
  limitCount?: number
  featuredOnly?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, limitCount = 12, featuredOnly = false } = options
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [displayCount, setDisplayCount] = useState(limitCount)
  
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const productsRef = ref(rtdb, 'products')
      const snapshot = await get(productsRef)

      if (snapshot.exists()) {
        let items: Product[] = []
        snapshot.forEach((child) => {
          const data = child.val()
          if (data && data.isActive) {
            items.push({ id: child.key, ...data } as Product)
          }
        })

        items.sort((a, b) => {
          const timeA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : 0
          const timeB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : 0
          return timeB - timeA
        })

        if (category && category !== 'all') {
          items = items.filter(p => p.category === category)
        }

        if (featuredOnly) {
          items = items.filter(p => p.isFeatured)
        }

        // Store all filtered products and slice based on displayCount
        setProducts(items)
        setHasMore(items.length > displayCount)
        setError(null)
      } else {
        setProducts([])
        setHasMore(false)
        setError(null)
      }
    } catch (err: unknown) {
      console.error('[useProducts] Failed to fetch products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [category, featuredOnly, displayCount])

  const loadMore = useCallback(() => {
    const nextCount = displayCount + limitCount
    setDisplayCount(nextCount)
    setHasMore(products.length > nextCount)
  }, [displayCount, limitCount, products.length])

  useEffect(() => {
    fetchProducts()
    setDisplayCount(limitCount) // Reset on category/filter change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProducts, category, featuredOnly])

  // Return sliced products based on displayCount
  const displayProducts = useMemo(() => {
    return products.slice(0, displayCount)
  }, [products, displayCount])

  return {
    products: displayProducts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh: () => fetchProducts()
  }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setProduct(null)
        setLoading(false)
        return
      }
      
      setLoading(true)
      try {
        const productsRef = ref(rtdb, 'products')
        const snapshot = await get(query(productsRef, orderByChild('slug'), equalTo(slug)))
        
        if (snapshot.exists()) {
          const key = Object.keys(snapshot.val())[0]
          const data = snapshot.val()[key]
          setProduct({ id: key, ...data } as Product)
        } else {
          setProduct(null)
        }
      } catch (err: unknown) {
        console.error('[useProduct] Failed to fetch product:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}
