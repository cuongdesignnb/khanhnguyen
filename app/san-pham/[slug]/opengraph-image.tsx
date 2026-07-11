import { getProductBySlug } from '@/lib/public-data'
import { getSeoConfig } from '@/lib/seo/config'
import { absoluteUrl } from '@/lib/seo/canonical'
import { createOgImage, ogSize } from '@/lib/seo/og-image'
export const size = ogSize
export const contentType = 'image/png'
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [product, config] = await Promise.all([getProductBySlug((await params).slug), getSeoConfig()])
  return createOgImage({ title: product?.ogTitle || product?.name || 'Sản phẩm xe nâng', subtitle: product?.categoryName || 'Sản phẩm', image: absoluteUrl(product?.ogImage || product?.thumbnail || config.defaultOgImage, config.siteUrl), siteName: config.seo.siteName })
}
