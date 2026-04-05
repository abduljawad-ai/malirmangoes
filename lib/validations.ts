import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format').min(10, 'Valid phone number is required'),
  street: z.string().min(5, 'Street address is required').max(200, 'Address is too long'),
  city: z.string().min(2, 'City is required').max(100, 'City name is too long'),
  state: z.string().min(2, 'State/Province is required').max(100, 'State name is too long'),
  zip: z.string().regex(/^[0-9A-Za-z\s\-]+$/, 'Invalid ZIP code format').min(4, 'ZIP code is required'),
  paymentMethod: z.enum(['COD'], 'Only Cash on Delivery is currently supported'),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  salePrice: z.number().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  weightKg: z.number().min(0, 'Weight cannot be negative'),
  deliveryCities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Rating must be 1-5'),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
