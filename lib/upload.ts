

export interface UploadOptions {
  folder: string
  maxSize?: number
  allowedTypes?: string[]
  requireAdmin?: boolean
}

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
const FOLDER = process.env.CLOUDINARY_FOLDER || 'mangostore'

function validateConfig(): void {
  if (!CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME environment variable is not set')
  }
  if (!UPLOAD_PRESET) {
    throw new Error('CLOUDINARY_UPLOAD_PRESET environment variable is not set')
  }
}

export const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
export const DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function validateFile(file: File, options: UploadOptions): string | null {
  const { maxSize = DEFAULT_MAX_SIZE, allowedTypes = DEFAULT_ALLOWED_TYPES } = options

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`
  }

  if (file.size > maxSize) {
    return `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
  }

  return null
}

export async function uploadToCloudinary(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  validateConfig()
  
  const { folder } = options
  const uploadFolder = folder.startsWith('/') ? folder : `${FOLDER}/${folder}`

  const cloudinaryForm = new FormData()
  cloudinaryForm.append('file', file)
  cloudinaryForm.append('upload_preset', UPLOAD_PRESET!)
  cloudinaryForm.append('folder', uploadFolder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: cloudinaryForm }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Upload failed')
  }

  const data = await res.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  }
}

export interface CloudinaryUploadResponse {
  success: true
  data: UploadResult
}

export interface CloudinaryUploadError {
  success: false
  error: string
  status: number
}

export type CloudinaryResponse = CloudinaryUploadResponse | CloudinaryUploadError

export function successResponse(data: UploadResult): CloudinaryUploadResponse {
  return { success: true, data }
}

export function errorResponse(error: string, status: number): CloudinaryUploadError {
  return { success: false, error, status }
}
