const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dzimmsjyx'

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number
  height?: number
  quality?: string
  format?: string
}) {
  const { width = 800, height, quality = 'auto', format = 'auto' } = options || {}

  let url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`
  url += `f_${format},q_${quality},w_${width}`
  if (height) url += `,h_${height},c_fill`
  url += `/${publicId}`

  return url
}
