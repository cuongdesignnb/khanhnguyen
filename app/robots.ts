import type { MetadataRoute } from 'next'
import { getSeoConfig } from '@/lib/seo/config'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getSeoConfig()
  const production = process.env.APP_ENV === 'production' || process.env.NODE_ENV === 'production'
  const validProductionUrl = !/localhost|127\.0\.0\.1/.test(config.siteUrl)
  if (!production || !validProductionUrl || !Boolean(config.robots.allowIndexing)) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: [...config.robots.disallow] },
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  }
}
