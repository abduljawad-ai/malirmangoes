'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react'

interface ImagePreviewProps {
  src: string
  alt?: string
  onClose: () => void
}

export default function ImagePreview({ src, alt = 'Image', onClose }: ImagePreviewProps) {
  const [scale, setScale] = useState(1)

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={() => setScale(s => Math.min(s + 0.25, 3))}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale(s => Math.max(s - 0.25, 0.5))}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <a
            href={src}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image */}
        <div
          className="transition-transform duration-200"
          style={{ transform: `scale(${scale})` }}
        >
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
