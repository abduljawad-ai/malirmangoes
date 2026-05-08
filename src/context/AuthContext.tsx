'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setUser(data as User)
    } else if (error) {
      // Create user profile if doesn't exist
      const { data: authData } = await supabase.auth.getUser(userId)
      if (authData?.user) {
        await supabase.from('users').insert({
          id: userId,
          email: authData.user.email,
          name: authData.user.email?.split('@')[0] || 'User',
          role: 'user',
        })
        // Fetch again
        const { data: newData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        if (newData) setUser(newData as User)
      }
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email: string, password: string, name?: string) {
    // Skip email confirmation to avoid rate limits
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: undefined
      }
    })
    if (error) return { error }

    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name: name || email.split('@')[0],
        role: 'user',
      })
      if (profileError) return { error: profileError }
    }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function updateProfile(data: Partial<User>) {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', user.id)

    if (!error) {
      setUser({ ...user, ...data })
    }
    return { error }
  }

  async function refreshUser() {
    if (!user) return
    await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}