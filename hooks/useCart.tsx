'use client'

import React, { useEffect, useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'
import { useAuth } from './useAuth'
import { ref, get, set } from 'firebase/database'
import { rtdb } from '@/lib/firebase'

interface CartState {
  items: CartItem[]
  isCartOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  setItems: (items: CartItem[]) => void
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.productId === newItem.productId)
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item.productId === newItem.productId 
                ? { ...item, qty: Math.min(item.qty + newItem.qty, item.stock) } 
                : item
            )
          }
        }
        return { items: [...state.items, newItem] }
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
      })),
      updateQuantity: (productId, qty) => set((state) => ({
        items: state.items.map(item => 
          item.productId === productId ? { ...item, qty: Math.max(1, Math.min(qty, item.stock)) } : item
        )
      })),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setItems: (items) => set({ items })
    }),
    {
      name: 'mango-cart-storage',
    }
  )
)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const store = useCartStore()
  const { user } = useAuth()
  const [isSyncing, setIsSyncing] = React.useState(false)
  const hasSynced = React.useRef(false)

  // 1. Initial Sync when user logs in
  useEffect(() => {
    if (!user) {
      hasSynced.current = false
      return
    }

    const syncWithRTDB = async () => {
      if (hasSynced.current) return
      
      setIsSyncing(true)
      try {
        const cartRef = ref(rtdb, `carts/${user.uid}`)
        const cartSnap = await get(cartRef)
        
        if (cartSnap.exists()) {
          const cloudItems = (cartSnap.val().items || []) as CartItem[]
          
          // If local is empty but cloud has items, pull cloud
          // Use get() to avoid stale closure
          const currentItems = useCartStore.getState().items
          if (cloudItems.length > 0 && currentItems.length === 0) {
            store.setItems(cloudItems)
          } 
          // If local has items, the second useEffect will handle pushing them to cloud
        }
        hasSynced.current = true
      } catch (error) {
        console.error('Failed to sync cart:', error)
      } finally {
        setIsSyncing(false)
      }
    }

    syncWithRTDB()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]) // Only run when user changes

  // 2. Push local changes to RTDB (Debounced)
  useEffect(() => {
    if (!user || isSyncing || !hasSynced.current) return

    const timeoutId = setTimeout(async () => {
      try {
        const cartRef = ref(rtdb, `carts/${user.uid}`)
        const itemsToSync = store.items.map(item => ({
          ...item,
          salePrice: item.salePrice ?? null
        }))
        await set(cartRef, { items: itemsToSync, updatedAt: new Date().toISOString() })
      } catch (error) {
        console.error('Failed to save cart:', error)
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.items, user?.uid, isSyncing])

  return <>{children}</>
}

export function useCart() {
  const store = useCartStore()
  
  const totalItems = useMemo(() => 
    store.items.reduce((acc, item) => acc + item.qty, 0), 
    [store.items]
  )
  
  const totalPrice = useMemo(() => 
    store.items.reduce((acc, item) => acc + (item.salePrice || item.price) * item.qty, 0),
    [store.items]
  )
  
  return {
    items: store.items,
    isCartOpen: store.isCartOpen,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    toggleCart: store.toggleCart,
    setItems: store.setItems,
    totalItems,
    totalPrice
  }
}
