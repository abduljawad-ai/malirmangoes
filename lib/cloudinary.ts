import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number
  height?: number
  quality?: string
  format?: string
}) {
  const { width = 800, height, quality = 'auto', format = 'auto' } = options || {}

  let url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
  url += `f_${format},q_${quality},w_${width}`
  if (height) url += `,h_${height},c_fill`
  url += `/${publicId}`

  return url
}

export { cloudinary }
