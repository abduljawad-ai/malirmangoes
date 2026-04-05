import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price in PKR — Rs. 1,200 */
export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

/** Generate URL-safe slug from string */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Truncate text to specified length with ellipsis */
export function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len).trimEnd() + '…'
}

/** Delay for async operations */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Get initials from name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Generate a random order ID */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MNG-${timestamp}-${random}`
}

/** Ensure image URL has protocol and is valid for next/image */
export function getValidImageUrl(url?: string, fallback: string = ''): string {
  if (!url || typeof url !== 'string' || url.trim() === '') return fallback
  
  const trimmedUrl = url.trim()
  
  // Handle malformed data URIs (e.g., https://data:image/jpeg;base64,...)
  if (trimmedUrl.includes('://data:')) {
    const dataUriStart = trimmedUrl.indexOf('data:')
    return trimmedUrl.slice(dataUriStart)
  }
  
  // Handle malformed blob URLs (e.g., https://blob:https://...)
  if (trimmedUrl.includes('://blob:')) {
    const blobUriStart = trimmedUrl.indexOf('blob:')
    return trimmedUrl.slice(blobUriStart)
  }
  
  // Handle Google Drive links
  if (trimmedUrl.includes('drive.google.com/file/d/')) {
    const match = trimmedUrl.match(/\/file\/d\/([^\/]+)/)
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`
    }
  }

  if (trimmedUrl.startsWith('blob:')) return trimmedUrl // blob URL
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) return trimmedUrl
  if (trimmedUrl.startsWith('//')) return `https:${trimmedUrl}`
  if (trimmedUrl.startsWith('/')) return trimmedUrl // local path
  if (trimmedUrl.startsWith('data:')) return trimmedUrl // data URI
  
  // Handle cases like "www.example.com"
  return `https://${trimmedUrl}`
}
