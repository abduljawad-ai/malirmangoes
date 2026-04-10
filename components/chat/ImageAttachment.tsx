'use client'

import React, { useRef } from 'react'
import { Paperclip } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageAttachmentProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export default function ImageAttachment({ onImageSelect, disabled }: ImageAttachmentProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        return
      }
      onImageSelect(file)
    }
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="p-2 text-slate-400 hover:text-mango hover:bg-mango-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Attach image"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </>
  )
}
