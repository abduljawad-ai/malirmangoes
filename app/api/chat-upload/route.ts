import { NextResponse, NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
import { uploadToCloudinary, validateFile, DEFAULT_ALLOWED_TYPES } from '@/lib/upload'

const CHAT_MAX_SIZE = 5 * 1024 * 1024 // 5MB for chat attachments

function sanitizeFolderName(name: string): string {
  // Remove any path traversal attempts and invalid characters
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128)
}

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

    // Sanitize user ID to prevent path traversal
    const safeUserId = sanitizeFolderName(user.uid)
    const folder = `chat-attachments/${safeUserId}`

    // Validate file
    const validationError = validateFile(file, {
      folder,
      maxSize: CHAT_MAX_SIZE,
      allowedTypes: DEFAULT_ALLOWED_TYPES,
    })
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Upload to Cloudinary in user-specific folder
    const result = await uploadToCloudinary(file, {
      folder,
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
