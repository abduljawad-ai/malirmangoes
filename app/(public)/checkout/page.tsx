'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { checkoutSchema } from '@/lib/validations'
import { z } from 'zod'
import { formatPKR } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Image from 'next/image'
import { getValidImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Truck, CreditCard, ShieldCheck, ShoppingCart, ArrowRight, Check } from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 5000

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      paymentMethod: 'COD'
    }
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        paymentMethod: 'COD'
      })
    }
  }, [user, reset])

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items,
          totalPrice,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to place order')

      toast.success('Order placed successfully!')
      clearCart()
      router.push(`/checkout/success?id=${result.orderId}`)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-mango" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-7 h-7 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mb-6">Add some mangoes before checking out.</p>
        <Button onClick={() => router.push('/products')}>Go to Shop</Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-[1.5] space-y-6">
          {/* Shipping */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-mango-50 rounded-md flex items-center justify-center">
                <Truck className="w-4 h-4 text-mango" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Shipping Information</h2>
            </div>

            {user?.addresses && user.addresses.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-500 mb-2">Saved Addresses</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {user.addresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setValue('street', addr.street)
                        setValue('city', addr.city)
                        setValue('state', addr.state)
                        setValue('zip', addr.zip)
                        toast.success(`Address "${addr.label}" applied`)
                      }}
                      className="text-left p-3 rounded-md border border-slate-200 hover:border-mango hover:bg-mango-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-slate-900">{addr.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {addr.street}, {addr.city}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-medium"><span className="bg-white px-3 text-slate-400">Or enter manually</span></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Full Name" placeholder="Recipient's name" error={errors.name?.message} {...register('name')} />
              <Input label="Phone" placeholder="03xx xxxxxxx" error={errors.phone?.message} {...register('phone')} />
              <Textarea label="Street Address" placeholder="Complete address" className="sm:col-span-2" rows={2} error={errors.street?.message} {...register('street')} />
              <Input label="City" placeholder="e.g. Karachi" error={errors.city?.message} {...register('city')} />
              <Input label="State" placeholder="e.g. Sindh" error={errors.state?.message} {...register('state')} />
              <Input label="ZIP Code" placeholder="75500" error={errors.zip?.message} {...register('zip')} />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-leaf-50 rounded-md flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-leaf" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Payment Method</h2>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-md border-2 border-mango bg-mango-50 cursor-pointer">
              <div className="w-4 h-4 rounded-full border-2 border-mango flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-mango" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Cash on Delivery</p>
                <p className="text-xs text-slate-500">Pay when you receive your order</p>
              </div>
            </label>
          </div>
        </form>

        {/* Order Summary */}
        <aside className="flex-1">
          <div className="bg-white border border-slate-200 rounded-lg p-5 sticky top-20">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0">
                    <Image src={getValidImageUrl(item.image)} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{formatPKR((item.salePrice || item.price) * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">{formatPKR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-leaf">Free</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>{formatPKR(totalPrice)}</span>
              </div>
            </div>

            <Button className="w-full h-11" onClick={handleSubmit(onSubmit)} loading={loading} disabled={loading}>
              Place Order <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Your information is secure</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
