import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

const SESSION_COOKIE_EXPIRY = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds

export async function POST(request: Request) {
  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  try {
    const auth = adminAuth
    if (!auth) {
      console.error('[Auth Cookie] Firebase Admin not initialized')
      return NextResponse.json({ 
        error: 'Server configuration error. Please contact support.' 
      }, { status: 500 })
    }

    const sessionCookie = await auth.createSessionCookie(token, {
      expiresIn: SESSION_COOKIE_EXPIRY,
    })

    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: SESSION_COOKIE_EXPIRY / 1000,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Auth Cookie] Failed to create session cookie:', error)
    
    return NextResponse.json({ 
      error: 'Failed to create session. Please log in again.' 
    }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return NextResponse.json({ success: true })
}
