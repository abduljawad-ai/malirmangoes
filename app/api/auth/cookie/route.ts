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
    // Create a secure session cookie from the ID token
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: SESSION_COOKIE_EXPIRY,
    })

    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const, // 'lax' for e-commerce (allows checkout redirects), 'strict' would block payment provider callbacks
      path: '/',
      maxAge: SESSION_COOKIE_EXPIRY / 1000, // Convert to seconds
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // SECURITY FIX: Do NOT fall back to storing raw ID token
    // Log the error for debugging but return an error to the client
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
