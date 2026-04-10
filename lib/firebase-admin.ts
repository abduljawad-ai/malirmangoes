import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

let adminAuthInstance: ReturnType<typeof getAuth> | null = null
let adminRtdbInstance: ReturnType<typeof getDatabase> | null = null
let isInitialized = false

function getServiceAccount(): ServiceAccount | undefined {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  if (!raw) return undefined
  try {
    return JSON.parse(raw) as ServiceAccount
  } catch {
    return undefined
  }
}

function initializeFirebaseAdmin(): void {
  if (isInitialized) return
  
  const serviceAccount = getServiceAccount()
  
  if (!getApps().length) {
    try {
      if (serviceAccount) {
        initializeApp({ 
          credential: cert(serviceAccount),
          databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
        })
      } else {
        initializeApp({
          databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
        })
      }
      adminAuthInstance = getAuth()
      adminRtdbInstance = getDatabase()
      isInitialized = true
    } catch (error) {
      console.error('[Firebase Admin] Failed to initialize:', error)
    }
  } else {
    adminAuthInstance = getAuth()
    adminRtdbInstance = getDatabase()
    isInitialized = true
  }
}

export function getAdminAuth(): ReturnType<typeof getAuth> {
  if (!adminAuthInstance) {
    initializeFirebaseAdmin()
  }
  if (!adminAuthInstance) {
    throw new Error('Firebase Admin Auth not initialized. Check server logs.')
  }
  return adminAuthInstance
}

export function getAdminRtdb(): ReturnType<typeof getDatabase> {
  if (!adminRtdbInstance) {
    initializeFirebaseAdmin()
  }
  if (!adminRtdbInstance) {
    throw new Error('Firebase Admin RTDB not initialized. Check server logs.')
  }
  return adminRtdbInstance
}

export const adminAuth = {
  get auth() { return getAdminAuth() },
  createSessionCookie: async (token: string, options: { expiresIn: number }) => {
    return getAdminAuth().createSessionCookie(token, options)
  },
  verifyIdToken: async (token: string) => {
    return getAdminAuth().verifyIdToken(token)
  }
}

export const adminRtdb = {
  get db() { return getAdminRtdb() },
  ref: (path: string) => getAdminRtdb().ref(path)
}

export async function verifyAdminStatus(uid: string): Promise<boolean> {
  try {
    const db = getAdminRtdb()
    const snapshot = await db.ref(`admins/${uid}`).get()
    return snapshot.exists()
  } catch (error) {
    console.error('[verifyAdminStatus] Error:', error)
    return false
  }
}

export async function verifyIdToken(token: string) {
  try {
    return await getAdminAuth().verifyIdToken(token)
  } catch {
    return null
  }
}
