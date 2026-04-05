import { NextResponse, NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
import { adminRtdb } from '@/lib/firebase-admin'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
const FOLDER = process.env.CLOUDINARY_FOLDER || 'mangostore'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

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

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: `Invalid file type. Allowed: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}`
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        error: `File too large. Maximum size: ${MAX_SIZE / 1024 / 1024}MB`
      }, { status: 400 })
    }

    const cloudinaryForm = new FormData()
    cloudinaryForm.append('file', file)
    cloudinaryForm.append('upload_preset', UPLOAD_PRESET!)
    cloudinaryForm.append('folder', FOLDER)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cloudinaryForm }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.error?.message || 'Upload failed' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
