import { getPostBySlug } from '@/lib/public-data'
import { getSeoConfig } from '@/lib/seo/config'
import { absoluteUrl } from '@/lib/seo/canonical'
import { createOgImage, ogSize } from '@/lib/seo/og-image'
export const size = ogSize
export const contentType = 'image/png'
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [post, config] = await Promise.all([getPostBySlug((await params).slug), getSeoConfig()])
  return createOgImage({ title: post?.ogTitle || post?.title || 'Tin tức xe nâng', subtitle: post?.categoryName || 'Tin tức', image: absoluteUrl(post?.ogImage || post?.thumbnail || config.defaultOgImage, config.siteUrl), siteName: config.seo.siteName })
}
