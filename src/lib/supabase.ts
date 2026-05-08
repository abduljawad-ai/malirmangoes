import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'user' | 'seller' | 'admin'

export interface User {
  id: string
  email: string
  phone?: string
  name?: string
  address?: string
  city?: string
  role: UserRole
  created_at: string
}

export interface MangoVariety {
  id: string
  name: string
  description?: string
  price_per_kg: number
  image_url?: string
  available: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id?: string
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  delivery_address: string
  customer_name: string
  customer_phone: string
  created_at: string
}

export interface OrderItem {
  variety_id: string
  variety_name: string
  quantity: number
  price_per_kg: number
}

export interface ChatMessage {
  id: string
  order_id?: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
  read: boolean
}

export interface SiteSettings {
  site_name: string
  logo_url: string
  hero_title: string
  hero_subtitle: string
  hero_image: string
  footer_text: string
  contact_phone: string
}