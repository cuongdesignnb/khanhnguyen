import { MetadataRoute } from 'next'
import {
  getAllProductSlugs,
  getAllServiceSlugs,
  getAllPostSlugs,
  getAllProductCategorySlugs,
} from '@/lib/public-data'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl()

  // Standard static routes
  const routes = [
    '',
    '/san-pham',
    '/dich-vu',
    '/tin-tuc',
    '/lien-he',
    '/gioi-thieu',
    '/catalogue',
    '/kiem-tra-don-hang',
  ].map((route) => ({
    url: `${origin}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    const [productSlugs, serviceSlugs, postSlugs, categorySlugs] = await Promise.all([
      getAllProductSlugs(),
      getAllServiceSlugs(),
      getAllPostSlugs(),
      getAllProductCategorySlugs(),
    ])

    const products = productSlugs.map((slug) => ({
      url: `${origin}/san-pham/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const services = serviceSlugs.map((slug) => ({
      url: `${origin}/dich-vu/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    const posts = postSlugs.map((slug) => ({
      url: `${origin}/tin-tuc/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    const categories = categorySlugs.map((slug) => ({
      url: `${origin}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...routes, ...products, ...services, ...posts, ...categories]
  } catch (error) {
    console.error('Sitemap dynamic generation failed, fallback to static:', error)
    return routes
  }
}
