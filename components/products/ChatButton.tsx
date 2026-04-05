'use client'

import React from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatButtonProps {
  productId: string
  productSlug?: string
  productName: string
  productImage?: string
  productPrice?: number
  variant?: 'button' | 'icon' | 'outline'
  className?: string
}

export default function ChatButton({
  productId,
  productSlug,
  productName,
  productImage,
  productPrice,
  variant = 'button',
  className
}: ChatButtonProps) {
  const queryParams = new URLSearchParams({
    product: productId,
    ...(productSlug && { slug: productSlug }),
    name: productName,
    ...(productImage && { image: productImage }),
    ...(productPrice && { price: productPrice.toString() })
  }).toString()

  const href = `/chat?${queryParams}`

  if (variant === 'icon') {
    return (
      <Link
        href={href}
        className={cn(
          'p-2 text-muted hover:text-mango hover:bg-mango/10 rounded-lg transition-colors',
          className
        )}
        title={`Chat about ${productName}`}
      >
        <MessageCircle className="w-5 h-5" />
      </Link>
    )
  }

  if (variant === 'outline') {
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 border-2 border-mango/30 text-mango font-medium rounded-xl',
          'hover:bg-mango hover:text-white hover:border-mango transition-all',
          className
        )}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Ask About This</span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 px-5 py-2.5 bg-mango text-white font-medium rounded-xl',
        'hover:bg-mango-dark shadow-lg shadow-mango/20 hover:shadow-mango/30 transition-all',
        className
      )}
    >
      <MessageCircle className="w-4 h-4" />
      <span>Chat with Seller</span>
    </Link>
  )
}
