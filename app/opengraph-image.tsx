import { getSeoConfig } from '@/lib/seo/config'
import { absoluteUrl } from '@/lib/seo/canonical'
import { createOgImage, ogSize } from '@/lib/seo/og-image'
import { connection } from 'next/server'
export const size = ogSize
export const contentType = 'image/png'
export default async function Image() {
  await connection()
  const config = await getSeoConfig()
  return createOgImage({ title: config.seo.defaultTitle, subtitle: config.seo.defaultDescription, image: absoluteUrl(config.defaultOgImage, config.siteUrl), siteName: config.seo.siteName })
}
