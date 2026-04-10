'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatImageProps {
  src: string
  alt?: string
  className?: string
}

export default function ChatImage({ src, alt = 'Attached image', className }: ChatImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative group cursor-pointer rounded-lg overflow-hidden bg-slate-100', className)}>
      {!loaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}
      <Image
        src={src}
        alt={alt}
        width={300}
        height={200}
        className={cn(
          'object-contain max-h-[200px] w-auto transition-opacity duration-200',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
          <ZoomIn className="w-4 h-4 text-slate-700" />
        </div>
      </div>
    </div>
  )
}
