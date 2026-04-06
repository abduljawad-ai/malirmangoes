import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminStatus, adminRtdb, verifyIdToken } from './firebase-admin'
import { adminAuth } from '@/lib/firebase-admin'

/**
 * Verify request and extract user info from session cookie.
 * Supports both session cookies (new) and raw ID tokens (legacy).
 */
export async function verifyAuth(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value
    if (!session) {
      return { user: null, error: 'No session' }
    }

    try {
      const decoded = await adminAuth.verifySessionCookie(session, true)
      return { user: decoded, error: null }
    } catch {
      const decoded = await verifyIdToken(session)
      if (decoded) return { user: decoded, error: null }
      return { user: null, error: 'Invalid token' }
    }
  } catch (error) {
    return { user: null, error: 'Auth failed' }
  }
}

/**
 * Verify admin access for API route
 */
export async function requireAdmin(request: NextRequest) {
  const { user, error } = await verifyAuth(request)

  if (error || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const isAdmin = await verifyAdminStatus(user.uid)
  if (!isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return {
    authorized: true,
    user,
    response: null
  }
}

/**
 * Check if order belongs to user or user is admin
 */
export async function checkOrderAccess(orderId: string, userId: string) {
  try {
    // Query the admin RTDB to check order ownership
    // This requires the admin SDK setup to be working
    const snapshot = await adminRtdb.ref(`orders/all/${orderId}`).get()

    if (!snapshot.exists()) {
      return { hasAccess: false, reason: 'Order not found' }
    }

    const order = snapshot.val()
    const isOwner = order.userId === userId
    const isAdmin = await verifyAdminStatus(userId)

    if (!isOwner && !isAdmin) {
      return { hasAccess: false, reason: 'Forbidden' }
    }

    return { hasAccess: true, order }
  } catch (error) {
    return { hasAccess: false, reason: 'Error checking access' }
  }
}

/**
 * Rate limiting helper
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(key: string, maxRequests: number = 5, windowSeconds: number = 60): boolean {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record) {
    requestCounts.set(key, { count: 1, resetTime: now + windowSeconds * 1000 })
    return true
  }

  if (now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowSeconds * 1000 })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}
