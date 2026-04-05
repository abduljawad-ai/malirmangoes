'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/lib/validations'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import Link from 'next/link'

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-mango" /></div>}>
      <SignupContent />
    </Suspense>
  )
}

function SignupContent() {
  const { loginWithGoogle, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = React.useState(false)

  const redirect = searchParams.get('redirect') || '/'

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push(redirect)
    }
  }, [user, authLoading, router, redirect])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  })

  const onSubmit = async (data: SignupForm) => {
    setLoading(true)
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')
      const { ref, set } = await import('firebase/database')
      const { rtdb } = await import('@/lib/firebase')

      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await updateProfile(cred.user, { displayName: data.name })

      await set(ref(rtdb, `users/${cred.user.uid}`), {
        name: data.name,
        email: data.email,
        role: 'customer',
        createdAt: new Date().toISOString(),
      })

      toast.success('Account created!')
      router.push(redirect)
    } catch (error: any) {
      const msg = error.code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : 'Signup failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mango-50 to-orange-100 items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 bg-mango rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Join MangoStore</h1>
          <p className="text-slate-600">Create an account to order fresh mangoes and track your deliveries.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-mango rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="text-base font-semibold text-slate-900">MangoStore</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">Create Account</h2>
          <p className="text-sm text-slate-500 mb-6">Fill in your details to get started</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

            <Button type="submit" className="w-full h-11" loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">or</span></div>
          </div>

          <Button variant="outline" className="w-full h-11" onClick={loginWithGoogle}>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-mango font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
