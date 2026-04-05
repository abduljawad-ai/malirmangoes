import { NextResponse, NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
import { adminRtdb } from '@/lib/firebase-admin'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB for chat attachments

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await verifyAuth(req)
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only images allowed.'
      }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        error: 'File too large. Maximum 5MB.'
      }, { status: 400 })
    }

    // Upload to Cloudinary in user-specific folder
    const cloudinaryForm = new FormData()
    cloudinaryForm.append('file', file)
    cloudinaryForm.append('upload_preset', UPLOAD_PRESET!)
    cloudinaryForm.append('folder', `mangostore/chat-attachments/${user.uid}`)

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
  } catch {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
