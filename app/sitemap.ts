import { MetadataRoute } from 'next'

const BASE_URL = 'https://malirmangoes.vercel.app'

interface Product {
  slug: string
  isActive: boolean
}

async function getProductSlugs(): Promise<string[]> {
  const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  if (!dbUrl) return []

  try {
    const res = await fetch(`${dbUrl}/products.json`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []

    const data: Record<string, Product> = await res.json()
    return Object.values(data)
      .filter((p) => p.isActive && p.slug)
      .map((p) => p.slug)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await getProductSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
