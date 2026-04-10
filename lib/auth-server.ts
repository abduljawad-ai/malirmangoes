import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminStatus, adminRtdb, verifyIdToken, getAdminAuth } from './firebase-admin'

/**
 * Verify request and extract user info from session cookie or Bearer token.
 * Supports both session cookies (preferred) and Firebase ID tokens.
 * 
 * Security Note: We only use Firebase Admin SDK methods here.
 * The REST API fallback has been removed as it poses security risks.
 */
export async function verifyAuth(request: NextRequest) {
  try {
    let token = request.cookies.get('session')?.value
    
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      }
    }

    if (!token) {
      return { user: null, error: 'No session' }
    }

    try {
      const auth = getAdminAuth()
      const decoded = await auth.verifySessionCookie(token, true)
      return { user: decoded, error: null }
    } catch {
      const decoded = await verifyIdToken(token)
      if (decoded) {
        console.warn('[Auth] Falling back to ID token verification for user:', decoded.uid)
        return { user: decoded, error: null }
      }
      
      return { user: null, error: 'Invalid or expired token' }
    }
  } catch (error) {
    console.error('[Auth] Authentication error:', error)
    return { user: null, error: 'Authentication failed' }
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
  } catch {
    return { hasAccess: false, reason: 'Error checking access' }
  }
}

/**
 * Rate limiting helper with automatic cleanup
 * Note: For serverless environments, consider using Redis or a distributed rate limiter
 */
interface RateLimitRecord {
  count: number
  resetTime: number
}

const requestCounts = new Map<string, RateLimitRecord>()
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 60 * 1000 // Cleanup every minute
const MAX_MAP_SIZE = 10000 // Prevent memory exhaustion

function cleanupExpiredRecords(): void {
  const now = Date.now()
  
  // Only cleanup periodically
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  
  // Clean up expired entries
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key)
    }
  }
  
  // Emergency cleanup if map is too large
  if (requestCounts.size > MAX_MAP_SIZE) {
    const entries = Array.from(requestCounts.entries())
    entries.sort((a, b) => a[1].resetTime - b[1].resetTime)
    
    // Remove oldest half
    const toRemove = entries.slice(0, Math.floor(entries.length / 2))
    for (const [key] of toRemove) {
      requestCounts.delete(key)
    }
  }
}

export function checkRateLimit(
  key: string, 
  maxRequests: number = 5, 
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  
  // Periodic cleanup
  cleanupExpiredRecords()
  
  const record = requestCounts.get(key)

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = { 
      count: 1, 
      resetTime: now + windowSeconds * 1000 
    }
    requestCounts.set(key, newRecord)
    return { 
      allowed: true, 
      remaining: maxRequests - 1, 
      resetIn: windowSeconds 
    }
  }

  if (record.count >= maxRequests) {
    const resetIn = Math.ceil((record.resetTime - now) / 1000)
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn 
    }
  }

  record.count++
  const remaining = maxRequests - record.count
  const resetIn = Math.ceil((record.resetTime - now) / 1000)
  
  return { allowed: true, remaining, resetIn }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>): Record<string, string> {
  return {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetIn.toString(),
  }
}
