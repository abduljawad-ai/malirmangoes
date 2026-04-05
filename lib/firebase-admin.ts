import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

function getServiceAccount(): ServiceAccount | undefined {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  if (!raw) return undefined
  try {
    return JSON.parse(raw) as ServiceAccount
  } catch {
    return undefined
  }
}

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
  } catch (error) {
  }
}

export const adminAuth = getAuth()
export const adminRtdb = getDatabase()

/**
 * Verify if a user is an admin by checking the RTDB admins collection
 * This is the authoritative server-side check
 */
export async function verifyAdminStatus(uid: string): Promise<boolean> {
  try {
    const snapshot = await adminRtdb.ref(`admins/${uid}`).get()
    return snapshot.exists()
  } catch (error) {
    return false
  }
}

/**
 * Verify ID token and get user claims
 */
export async function verifyIdToken(token: string) {
  try {
    return await adminAuth.verifyIdToken(token)
  } catch (error) {
    return null
  }
}
