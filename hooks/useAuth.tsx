'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser,
  signInWithPopup
} from 'firebase/auth'
import { ref, get, set, update } from 'firebase/database'
import { auth, rtdb, googleProvider } from '@/lib/firebase'
import { User } from '@/types'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  isAdmin: boolean
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  updateUserData: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
  fetchUserData: (uid: string) => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const syncCookie = async (token: string | null) => {
    try {
      if (token) {
        await fetch('/api/auth/cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
      } else {
        await fetch('/api/auth/cookie', { method: 'DELETE' })
      }
    } catch (error) {
    }
  }

  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      const userRef = ref(rtdb, `users/${uid}`)
      const userSnap = await get(userRef)
      if (userSnap.exists()) {
        const userData = userSnap.val() as User
        
        if (!userData.addresses) userData.addresses = []
        if (userData.phone === undefined) userData.phone = ''
        
        setUser(userData)
        
        const adminRef = ref(rtdb, `admins/${uid}`)
        const adminSnap = await get(adminRef)
        setIsAdmin(adminSnap.exists())
        return userData
      }
    } catch (error) {
    }
    return null
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser)
      
      if (fUser) {
        const token = await fUser.getIdToken()
        await syncCookie(token)
        const userData = await fetchUserData(fUser.uid)
        
        if (userData?.isBanned) {
          await signOut(auth)
          setUser(null)
          setIsAdmin(false)
          toast.error('Your account has been suspended. Contact support.')
        }
      } else {
        await syncCookie(null)
        setUser(null)
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to log out')
    }
  }

  const loginWithGoogle = async () => {
    try {
      const { user: fUser } = await signInWithPopup(auth, googleProvider)
      
      // Check if user profile already exists
      const userRef = ref(rtdb, `users/${fUser.uid}`)
      const userSnap = await get(userRef)
      
      if (!userSnap.exists()) {
        const newUser: User = {
          uid: fUser.uid,
          email: fUser.email || '',
          name: fUser.displayName || 'Guest User',
          phone: fUser.phoneNumber || '',
          photoURL: fUser.photoURL || '',
          role: 'customer',
          addresses: [],
          isBanned: false,
          profileCompleted: false,
          wishlist: [],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }
        await set(userRef, newUser)
        setUser(newUser)
      } else {
        const userData = userSnap.val() as User
        if (userData.isBanned) {
          await signOut(auth)
          toast.error('Your account has been suspended. Contact support.')
          return
        }
        await set(ref(rtdb, `users/${fUser.uid}/lastLogin`), new Date().toISOString())
        setUser(userData)
      }
      
      toast.success('Logged in with Google!')
    } catch (error: unknown) {
      const firebaseError = error as { code?: string }
      if (firebaseError.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to log in with Google')
      }
    }
  }

  const updateUserData = async (data: Partial<User>) => {
    if (!firebaseUser) return
    try {
      const userRef = ref(rtdb, `users/${firebaseUser.uid}`)
      await update(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      })
      await fetchUserData(firebaseUser.uid)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
      throw error
    }
  }

  const refreshUser = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser.uid)
    }
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isAdmin, logout, loginWithGoogle, updateUserData, refreshUser, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
