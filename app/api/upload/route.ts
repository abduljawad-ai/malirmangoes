import { NextResponse, NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
import { adminRtdb } from '@/lib/firebase-admin'
import { uploadToCloudinary, validateFile, DEFAULT_ALLOWED_TYPES, DEFAULT_MAX_SIZE } from '@/lib/upload'

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await verifyAuth(req)
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin status
    const adminSnap = await adminRtdb.ref(`admins/${user.uid}`).get()
    if (!adminSnap.exists()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file
    const validationError = validateFile(file, {
      folder: 'products',
      maxSize: DEFAULT_MAX_SIZE,
      allowedTypes: DEFAULT_ALLOWED_TYPES,
    })
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, {
      folder: 'products',
    })

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
