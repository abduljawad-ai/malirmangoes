'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import {
  ShoppingBag,
  ChevronLeft,
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Minus,
  Plus,
} from 'lucide-react'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useReviews } from '@/hooks/useReviews'
import { formatPKR, cn, getValidImageUrl } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ChatButton from '@/components/products/ChatButton'
import ProductCard from '@/components/products/ProductCard'
import ReviewSystem from '@/components/products/ReviewSystem'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { product, loading, error } = useProduct(slug as string)
  const { products: relatedProducts } = useProducts({
    category: product?.category,
    limitCount: 4
  })

  const { addItem, toggleCart } = useCart()
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const { reviews, averageRating } = useReviews(product?.id || '')

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 aspect-square bg-slate-200 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-12 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: getValidImageUrl(product.images[0]?.webp),
      qty,
      stock: product.stock
    })
    toast.success(`${product.name} added to cart`)
    toggleCart()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to products
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Images */}
        <div className="flex-1 space-y-3">
          <div className="aspect-square relative bg-slate-100 rounded-lg overflow-hidden">
            <Image
              src={getValidImageUrl(product.images[activeImage]?.webp)}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors',
                    activeImage === i ? 'border-mango' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={getValidImageUrl(img.webp)} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default">{product.category}</Badge>
            {product.isFeatured && <Badge variant="success">Featured</Badge>}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{product.name}</h1>

          {averageRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-mango">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={cn('w-4 h-4', s <= Math.round(averageRating) ? 'fill-current' : 'text-slate-200')}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {averageRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {formatPKR(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-lg text-slate-400 line-through">{formatPKR(product.price)}</span>
            )}
            <span className="text-sm text-slate-500">/ {product.weightKg}kg</span>
          </div>

          <p className={cn(
            'text-sm font-medium mb-6',
            product.stock > 0 ? 'text-leaf' : 'text-danger'
          )}>
            {product.stock > 0 ? `${product.stock} kg available` : 'Out of stock'}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description}</p>

          {/* Qty + Cart */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-slate-200 rounded-md">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              Add to Cart
            </Button>
          </div>

          <ChatButton
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            productImage={product.images[0]?.webp}
            productPrice={product.salePrice || product.price}
            variant="outline"
          />

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            {[
              { icon: Truck, label: 'Fast Delivery' },
              { icon: ShieldCheck, label: 'Quality Guarantee' },
              { icon: RefreshCcw, label: 'Easy Returns' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center text-center gap-1.5">
                <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-xs font-medium text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <ReviewSystem productId={product.id} />
      </div>

      {/* Related */}
      {relatedProducts.filter(p => p.id !== product.id).length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedProducts
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
