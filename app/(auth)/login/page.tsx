'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import Link from 'next/link'

type LoginForm = z.infer<typeof loginSchema>

function LoginContent() {
  const { loginWithGoogle, user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = React.useState(false)

  const redirect = searchParams.get('redirect') || '/'

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push(isAdmin ? '/admin' : redirect)
    }
  }, [user, authLoading, router, redirect, isAdmin])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')
      await signInWithEmailAndPassword(auth, data.email, data.password)
      router.push(isAdmin ? '/admin' : redirect)
    } catch (error: any) {
      const msg = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : error.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Sign In</h2>
      <p className="text-sm text-slate-500 mb-6">Enter your credentials to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />

        <Button type="submit" className="w-full h-11" loading={loading}>
          Sign In
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
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-mango font-medium hover:underline">Sign Up</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-mango" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
