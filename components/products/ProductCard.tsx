'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { Product } from '@/types'
import { formatPKR, getValidImageUrl } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  showFeatured?: boolean
}

export default function ProductCard({ product, showFeatured = false }: ProductCardProps) {
  const { addItem, toggleCart, items, updateQuantity, removeItem } = useCart()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const cartItem = items.find(item => item.productId === product.id)
  const quantity = cartItem?.qty || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdding || product.stock === 0) return
    
    setIsAdding(true)
    
    if (quantity === 0) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        image: getValidImageUrl(product.images?.[0]?.webp, 'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/honey-mango.jpg'),
        qty: 1,
        stock: product.stock
      })
      toast.success(`${product.name} added to cart`)
    } else {
      toggleCart()
    }
    
    setTimeout(() => setIsAdding(false), 300)
  }

  const handleUpdateQuantity = (e: React.MouseEvent, newQty: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (newQty === 0) {
      removeItem(product.id)
      toast.success('Removed from cart')
    } else {
      updateQuantity(product.id, newQty)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on cart controls
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[data-cart-controls]')) {
      return
    }
  }

  const discount = useMemo(() => product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0, [product.salePrice, product.price])

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors">
      <Link href={`/products/${product.slug}`} className="group block" onClick={handleCardClick}>
        {/* Image */}
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          {!imgLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}
          <Image
            src={getValidImageUrl(product.images?.[0]?.webp, 'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/honey-mango.jpg')}
            alt={`${product.name} product image`}
            priority={showFeatured}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {showFeatured && (
              <span className="bg-mango text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="bg-danger text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <span className="bg-warning text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-slate-800 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                Out of stock
              </span>
            )}
          </div>

          {/* Cart Controls */}
          {quantity > 0 && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between" data-cart-controls>
              <div className="flex items-center bg-white rounded-md shadow-sm border border-slate-200">
                <button
                  type="button"
                  onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                  className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
                  aria-label="Decrease quantity"
                >
                  {quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <span className="px-2 text-xs font-semibold text-slate-900" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                <button
                  type="button"
                  onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="p-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Add Button */}
          {quantity === 0 && (
            <div className="absolute bottom-2 right-2" data-cart-controls>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className="w-8 h-8 bg-mango text-white rounded-md flex items-center justify-center shadow-sm hover:bg-mango-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-mango transition-colors">{product.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{product.category}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-slate-900">{formatPKR(product.salePrice || product.price)}</span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-xs text-slate-400 line-through">{formatPKR(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
