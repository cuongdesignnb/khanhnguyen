import { Decimal } from '@prisma/client/runtime/library'
import {
  PublicSiteConfig,
  PublicCategory,
  PublicBrand,
  PublicProductCard,
  PublicProductDetail,
  PublicService,
  PublicServiceDetail,
  PublicPostCard,
  PublicPostDetail,
  PublicTestimonial,
  PublicBanner,
  PublicNavigationItem,
} from '@/types/public'

// Helper to format Decimal to string or null
const formatPrice = (price: any): string | null => {
  if (price === null || price === undefined) return null
  if (typeof price === 'number') return price.toString()
  if (price instanceof Decimal) return price.toString()
  return String(price)
}

export function mapSettingRowsToSiteConfig(
  settings: { key: string; value: string | null }[],
  defaultConfig: PublicSiteConfig
): PublicSiteConfig {
  const config = { ...defaultConfig }
  for (const s of settings) {
    if (s.value !== null) {
      const key = s.key as keyof PublicSiteConfig
      if (key in config) {
        ;(config as any)[key] = s.value
      }
    }
  }
  return config
}

export function mapCategoryToPublicCategory(cat: any): PublicCategory {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    subtitle: cat.subtitle || 'Xem ngay',
    icon: cat.icon || 'Folder',
    description: cat.description || undefined,
    bannerImage: cat.bannerImage?.url || undefined,
  }
}

export function mapBrandToPublicBrand(brand: any): PublicBrand {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo?.url || undefined,
    description: brand.description || undefined,
  }
}

export function mapProductToPublicCard(p: any): PublicProductCard {
  const specs = Array.isArray(p.specs)
    ? p.specs.map((s: any) => ({ label: s.label, value: s.value }))
    : []

  // If DB specs are empty, try to populate from base fields
  const finalSpecs = specs.length > 0 ? specs : [
    ...(p.capacity ? [{ label: 'Tải trọng', value: p.capacity }] : []),
    ...(p.liftHeight ? [{ label: 'Nâng cao', value: p.liftHeight }] : []),
    ...(p.manufactureYear ? [{ label: 'Năm SX', value: p.manufactureYear.toString() }] : []),
  ]

  return {
    id: p.id,
    slug: p.slug,
    badge: p.badge || undefined,
    category: p.category?.name || 'Sản phẩm',
    categorySlug: p.category?.slug || '',
    name: p.name,
    model: p.model || p.name,
    image: p.thumbnail?.url || '/images/placeholder.jpg',
    specs: finalSpecs,
    price: formatPrice(p.price),
    priceLabel: p.priceLabel || 'Liên hệ',
  }
}

export function mapProductToProductDetail(p: any): PublicProductDetail {
  const images = Array.isArray(p.images)
    ? p.images.map((img: any) => img.media?.url).filter(Boolean)
    : []

  const specs = Array.isArray(p.specs)
    ? p.specs.map((s: any) => ({ label: s.label, value: s.value }))
    : []

  const advantages = Array.isArray(p.advantages)
    ? p.advantages
    : typeof p.advantages === 'string'
    ? JSON.parse(p.advantages)
    : []

  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku || null,
    name: p.name,
    model: p.model || null,
    categoryId: p.categoryId,
    categoryName: p.category?.name || 'Sản phẩm',
    categorySlug: p.category?.slug || '',
    brandId: p.brandId || null,
    brandName: p.brand?.name || null,
    brandSlug: p.brand?.slug || null,
    thumbnail: p.thumbnail?.url || '/images/placeholder.jpg',
    images: images.length > 0 ? images : [p.thumbnail?.url || '/images/placeholder.jpg'],
    specs,
    price: formatPrice(p.price),
    priceLabel: p.priceLabel || 'Liên hệ',
    badge: p.badge || null,
    status: p.status,
    stockStatus: p.stockStatus || 'IN_STOCK',
    isFeatured: p.isFeatured || false,
    isBestSeller: p.isBestSeller || false,
    capacity: p.capacity || null,
    liftHeight: p.liftHeight || null,
    fuelType: p.fuelType || null,
    manufactureYear: p.manufactureYear || null,
    forkLength: p.forkLength || null,
    condition: p.condition || null,
    origin: p.origin || null,
    shortDescription: p.shortDescription || null,
    description: p.description || null,
    advantages,
    warrantyPolicy: p.warrantyPolicy || null,
    seoTitle: p.seoTitle || null,
    seoDescription: p.seoDescription || null,
    ogImage: p.ogImage?.url || null,
    canonicalUrl: p.canonicalUrl || null,
    ogTitle: p.ogTitle || null,
    ogDescription: p.ogDescription || null,
    robotsIndex: p.robotsIndex !== false,
    robotsFollow: p.robotsFollow !== false,
    approvedReviews: Array.isArray(p.reviews) ? p.reviews.map((review: any) => ({ name: review.name, rating: review.rating, content: review.content, status: 'APPROVED' as const })) : [],
  }
}

export function mapServiceToPublicService(s: any): PublicService {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: s.description || '',
    image: s.image?.url || '/images/placeholder.jpg',
  }
}

export function mapServiceToServiceDetail(s: any): PublicServiceDetail {
  const benefits = Array.isArray(s.benefits)
    ? s.benefits
    : typeof s.benefits === 'string'
    ? JSON.parse(s.benefits)
    : []

  const process = Array.isArray(s.process)
    ? s.process
    : typeof s.process === 'string'
    ? JSON.parse(s.process)
    : []

  const faqs = Array.isArray(s.faqs)
    ? s.faqs.map((f: any) => ({ question: f.question, answer: f.answer }))
    : []

  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    subtitle: s.subtitle || null,
    description: s.description || null,
    content: s.content || null,
    image: s.image?.url || '/images/placeholder.jpg',
    benefits,
    process,
    faqs,
    ctaTitle: s.ctaTitle || null,
    ctaDescription: s.ctaDescription || null,
    ctaButtonText: s.ctaButtonText || null,
    ctaButtonHref: s.ctaButtonHref || null,
    seoTitle: s.seoTitle || null,
    seoDescription: s.seoDescription || null,
    ogImage: s.ogImage?.url || null,
    canonicalUrl: s.canonicalUrl || null,
    ogTitle: s.ogTitle || null,
    ogDescription: s.ogDescription || null,
    robotsIndex: s.robotsIndex !== false,
    robotsFollow: s.robotsFollow !== false,
  }
}

export function mapPostToPublicPost(p: any): PublicPostCard {
  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || '',
    date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : '',
    image: p.thumbnail?.url || '/images/placeholder.jpg',
    category: p.category?.name || 'Tin tức',
    categorySlug: p.category?.slug || 'tin-tuc',
    slug: p.slug,
  }
}

export function mapPostToPostDetail(p: any): PublicPostDetail {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || null,
    content: p.content || null,
    thumbnail: p.thumbnail?.url || '/images/placeholder.jpg',
    categoryName: p.category?.name || 'Tin tức',
    categorySlug: p.category?.slug || 'tin-tuc',
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : '',
    viewCount: p.viewCount || 0,
    seoTitle: p.seoTitle || null,
    seoDescription: p.seoDescription || null,
    ogImage: p.ogImage?.url || null,
    canonicalUrl: p.canonicalUrl || null,
    ogTitle: p.ogTitle || null,
    ogDescription: p.ogDescription || null,
    robotsIndex: p.robotsIndex !== false,
    robotsFollow: p.robotsFollow !== false,
    publishedAtIso: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    updatedAtIso: new Date(p.updatedAt).toISOString(),
    authorName: p.author?.name || null,
  }
}

export function mapTestimonialToPublicTestimonial(t: any): PublicTestimonial {
  return {
    id: t.id,
    name: t.name,
    location: t.location || '',
    quote: t.quote,
    image: t.image?.url || '/images/placeholder.jpg',
    rating: t.rating || 5,
  }
}

export function mapBannerToPublicBanner(b: any): PublicBanner {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle || null,
    image: b.image?.url || '/images/placeholder.jpg',
    href: b.href || null,
    buttonText: b.buttonText || null,
    position: b.position,
  }
}

export function mapMenuToNavigation(menus: any[]): PublicNavigationItem[] {
  // Build a tree of menus
  const roots = menus.filter((m) => !m.parentId)
  return roots.map((root) => {
    const children = menus.filter((m) => m.parentId === root.id)
    return {
      label: root.label,
      href: root.href,
      ...(children.length > 0
        ? {
            children: children.map((c) => ({
              label: c.label,
              href: c.href,
            })),
          }
        : {}),
    }
  })
}
