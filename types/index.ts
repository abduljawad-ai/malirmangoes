import { Timestamp } from 'firebase/firestore'

// ─── User ────────────────────────────────────────
export interface Address {
  label: string
  street: string
  city: string
  state: string
  zip: string
}

export interface User {
  uid: string
  email: string
  name: string
  phone: string
  addresses: Address[]
  createdAt: Timestamp
  lastLogin: Timestamp
  role: 'customer' | 'admin'
  photoURL?: string
  isBanned?: boolean
  profileCompleted?: boolean
  wishlist?: string[]
}

// ─── Product ─────────────────────────────────────
export interface ProductImages {
  original: string
  webp: string
  thumbnail: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  description: string
  category: string
  images: ProductImages[]
  stock: number
  weightKg: number
  deliveryCities: string[]
  tags: string[]
  isFeatured: boolean
  isActive: boolean
  seoTitle: string
  seoDescription: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Category ────────────────────────────────────
export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description: string
  order?: number
}

// ─── Order ───────────────────────────────────────
export type PaymentStatus = 'Pending' | 'Verified' | 'Rejected'
export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled'

export interface OrderItem {
  productId: string
  name: string
  price: number
  qty: number
  image: string
  total?: number
}

export interface CustomerSnapshot {
  name: string
  email: string
  phone: string
  address: Address
}

export interface OrderStatusEntry {
  status: OrderStatus
  note: string
  changedAt: Timestamp
  changedBy: string
}

export interface Order {
  id: string
  userId: string
  customerSnapshot: CustomerSnapshot
  items: OrderItem[]
  total: number
  paymentProofUrl: string
  paymentMethod: string
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  orderStatusHistory: OrderStatusEntry[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Review ──────────────────────────────────────
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  verifiedPurchase: boolean
  isVisible: boolean
  createdAt: Timestamp
}

// ─── Cart ────────────────────────────────────────
export interface CartItem {
  productId: string
  name: string
  price: number
  salePrice?: number
  image: string
  qty: number
  stock: number
}

// ─── Settings ────────────────────────────────────
export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  isActive: boolean
  order: number
}

export interface PaymentMethodConfig {
  id: string
  name: string
  type: 'easypaisa' | 'jazzcash' | 'bank'
  accountTitle: string
  accountNumber: string
  qrImage?: string
  isActive: boolean
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  whatsapp?: string
  youtube?: string
}

export interface SEOConfig {
  defaultTitle: string
  defaultDescription: string
  keywords: string[]
}

export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundImage: string
}

export interface Testimonial {
  id: string
  name: string
  comment: string
  rating: number
  avatar?: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface SiteSettings {
  siteName: string
  logo: string
  favicon: string
  heroContent: HeroContent
  banners: Banner[]
  paymentMethods: PaymentMethodConfig[]
  socialLinks: SocialLinks
  seo: SEOConfig
  testimonials: Testimonial[]
  faq: FAQItem[]
  footerText: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
}

// ─── Analytics ───────────────────────────────────
export interface AnalyticsData {
  date: string
  sales: number
  orders: number
  visitors: number
  conversionRate: number
}
