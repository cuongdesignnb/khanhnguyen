import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { getSeoConfig } from '@/lib/seo/config'
import { absoluteUrl } from '@/lib/seo/canonical'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await getSeoConfig()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    ...['/san-pham','/dich-vu','/tin-tuc','/lien-he','/gioi-thieu','/catalogue'].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: 'weekly' as const, priority: path === '/san-pham' ? 0.8 : 0.6 })),
    ...['/ho-tro/huong-dan-mua-hang','/ho-tro/bao-hanh','/ho-tro/doi-tra','/ho-tro/thanh-toan','/ho-tro/faq'].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
  try {
    const now = new Date()
    const [products, categories, services, posts, postCategories] = await Promise.all([
      prisma.product.findMany({ where: { status: 'PUBLISHED', deletedAt: null, robotsIndex: true }, select: { slug: true, updatedAt: true, thumbnail: { select: { url: true } } } }),
      prisma.category.findMany({ where: { isVisible: true, deletedAt: null, robotsIndex: true }, select: { slug: true, updatedAt: true, bannerImage: { select: { url: true } } } }),
      prisma.service.findMany({ where: { status: 'PUBLISHED', deletedAt: null, robotsIndex: true }, select: { slug: true, updatedAt: true, image: { select: { url: true } } } }),
      prisma.post.findMany({ where: { status: 'PUBLISHED', deletedAt: null, robotsIndex: true, OR: [{ publishedAt: null }, { publishedAt: { lte: now } }] }, select: { slug: true, updatedAt: true, thumbnail: { select: { url: true } } } }),
      prisma.postCategory.findMany({ where: { isVisible: true, deletedAt: null, robotsIndex: true }, select: { slug: true, updatedAt: true } }),
    ])
    return [
      ...staticRoutes,
      ...products.map((item) => ({ url: `${siteUrl}/san-pham/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'weekly' as const, priority: 0.7, images: item.thumbnail?.url ? [absoluteUrl(item.thumbnail.url, siteUrl)!] : undefined })),
      ...categories.map((item) => ({ url: `${siteUrl}/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8, images: item.bannerImage?.url ? [absoluteUrl(item.bannerImage.url, siteUrl)!] : undefined })),
      ...services.map((item) => ({ url: `${siteUrl}/dich-vu/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7, images: item.image?.url ? [absoluteUrl(item.image.url, siteUrl)!] : undefined })),
      ...posts.map((item) => ({ url: `${siteUrl}/tin-tuc/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6, images: item.thumbnail?.url ? [absoluteUrl(item.thumbnail.url, siteUrl)!] : undefined })),
      ...postCategories.map((item) => ({ url: `${siteUrl}/tin-tuc/danh-muc/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ]
  } catch (error) {
    console.error('Không thể tạo sitemap động:', error instanceof Error ? error.message : error)
    return staticRoutes
  }
}
