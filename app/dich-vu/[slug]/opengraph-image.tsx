import { getServiceBySlug } from '@/lib/public-data'
import { getSeoConfig } from '@/lib/seo/config'
import { absoluteUrl } from '@/lib/seo/canonical'
import { createOgImage, ogSize } from '@/lib/seo/og-image'
export const size = ogSize
export const contentType = 'image/png'
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [service, config] = await Promise.all([getServiceBySlug((await params).slug), getSeoConfig()])
  return createOgImage({ title: service?.ogTitle || service?.title || 'Dịch vụ xe nâng', subtitle: 'Dịch vụ', image: absoluteUrl(service?.ogImage || service?.image || config.defaultOgImage, config.siteUrl), siteName: config.seo.siteName })
}
