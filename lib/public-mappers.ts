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
import { normalizeProductSpecs } from '@/lib/products/normalize-product-specs'

type MediaLike = { url?: string | null }
type CategoryLike = {
  id?: string
  name?: string
  slug?: string
  subtitle?: string | null
  icon?: string | null
  description?: string | null
  bannerImage?: MediaLike | null
}
type BrandLike = {
  id?: string
  name?: string
  slug?: string
  logo?: MediaLike | null
  description?: string | null
}
type ProductImageLike = { media?: MediaLike | null }
type ProductReviewLike = { name?: string | null; rating?: number | null; content?: string | null }
type ProductLike = {
  id?: string
  slug?: string
  sku?: string | null
  name?: string
  model?: string | null
  categoryId?: string
  category?: CategoryLike | string | null
  brandId?: string | null
  brand?: BrandLike | string | null
  thumbnail?: MediaLike | null
  image?: string | null
  images?: ProductImageLike[]
  specs?: unknown
  price?: Decimal | number | string | null
  priceLabel?: string | null
  badge?: string | null
  status?: string
  stockStatus?: PublicProductDetail['stockStatus'] | null
  isFeatured?: boolean | null
  isBestSeller?: boolean | null
  capacity?: string | null
  liftHeight?: string | null
  fuelType?: string | null
  manufactureYear?: number | null
  forkLength?: string | null
  condition?: string | null
  origin?: string | null
  shortDescription?: string | null
  description?: string | null
  advantages?: unknown
  warrantyPolicy?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: MediaLike | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  robotsIndex?: boolean | null
  robotsFollow?: boolean | null
  reviews?: ProductReviewLike[]
}
type ServiceProcessLike = { title: string; description: string }
type ServiceFaqLike = { question?: string | null; answer?: string | null }
type ServiceLike = {
  id?: string
  title?: string
  slug?: string
  subtitle?: string | null
  description?: string | null
  content?: string | null
  image?: MediaLike | null
  benefits?: unknown
  process?: unknown
  faqs?: ServiceFaqLike[]
  ctaTitle?: string | null
  ctaDescription?: string | null
  ctaButtonText?: string | null
  ctaButtonHref?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: MediaLike | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  robotsIndex?: boolean | null
  robotsFollow?: boolean | null
}
type PostLike = {
  id?: string
  title?: string
  slug?: string
  excerpt?: string | null
  content?: string | null
  thumbnail?: MediaLike | null
  category?: CategoryLike | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  viewCount?: number | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: MediaLike | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  robotsIndex?: boolean | null
  robotsFollow?: boolean | null
  author?: { name?: string | null } | null
}
type TestimonialLike = {
  id?: string
  name?: string
  location?: string | null
  quote?: string
  image?: MediaLike | null
  rating?: number | null
}
type BannerLike = {
  id?: string
  title?: string
  subtitle?: string | null
  image?: MediaLike | null
  href?: string | null
  buttonText?: string | null
  position?: PublicBanner['position']
}
type MenuLike = {
  id?: string
  parentId?: string | null
  label?: string
  href?: string
}

function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

// Helper to format Decimal to string or null
const formatPrice = (price: Decimal | number | string | null | undefined): string | null => {
  if (price === null || price === undefined) return null
  if (typeof price === 'number') return price.toString()
  if (typeof price === 'string') return price
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
        Object.assign(config, { [key]: s.value })
      }
    }
  }
  return config
}

export function mapCategoryToPublicCategory(cat: CategoryLike): PublicCategory {
  return {
    id: cat.id || '',
    name: cat.name || '',
    slug: cat.slug || '',
    subtitle: cat.subtitle || 'Xem ngay',
    icon: cat.icon || 'Folder',
    description: cat.description || undefined,
    bannerImage: cat.bannerImage?.url || undefined,
  }
}

export function mapBrandToPublicBrand(brand: BrandLike): PublicBrand {
  return {
    id: brand.id || '',
    name: brand.name || '',
    slug: brand.slug || '',
    logo: brand.logo?.url || undefined,
    description: brand.description || undefined,
  }
}

export function mapProductToPublicCard(p: ProductLike): PublicProductCard {
  const brandName = typeof p.brand === 'string' ? p.brand : p.brand?.name
  const specs = normalizeProductSpecs(p.specs, {
    model: p.model,
    brand: brandName,
    capacity: p.capacity,
    liftHeight: p.liftHeight,
    fuelType: p.fuelType,
    manufactureYear: p.manufactureYear,
    condition: p.condition,
    origin: p.origin,
    forkLength: p.forkLength,
  })
  const categoryName = typeof p.category === 'string' ? p.category : p.category?.name
  const categorySlug = typeof p.category === 'string' ? '' : p.category?.slug
  const image = p.thumbnail?.url || p.image

  return {
    id: p.id || '',
    slug: p.slug || '',
    badge: p.badge || undefined,
    category: categoryName || 'Sản phẩm',
    categorySlug: categorySlug || '',
    name: p.name || '',
    model: p.model || p.name || '',
    image: typeof image === 'string' && image.trim() ? image : '/images/product-placeholder.svg',
    specs,
    price: formatPrice(p.price),
    priceLabel: p.priceLabel || 'Liên hệ',
  }
}

export function mapProductToProductDetail(p: ProductLike): PublicProductDetail {
  const images = Array.isArray(p.images)
    ? p.images.map((img) => img.media?.url).filter((url): url is string => Boolean(url))
    : []
  const brand = typeof p.brand === 'string' ? null : p.brand
  const category = typeof p.category === 'string' ? null : p.category

  const specs = normalizeProductSpecs(p.specs, {
    model: p.model,
    brand: brand?.name,
    capacity: p.capacity,
    liftHeight: p.liftHeight,
    fuelType: p.fuelType,
    manufactureYear: p.manufactureYear,
    condition: p.condition,
    origin: p.origin,
    forkLength: p.forkLength,
  })

  const advantages = parseArray<string>(p.advantages)

  return {
    id: p.id || '',
    slug: p.slug || '',
    sku: p.sku || null,
    name: p.name || '',
    model: p.model || null,
    categoryId: p.categoryId || '',
    categoryName: category?.name || 'Sản phẩm',
    categorySlug: category?.slug || '',
    brandId: p.brandId || null,
    brandName: brand?.name || null,
    brandSlug: brand?.slug || null,
    thumbnail: p.thumbnail?.url || '/images/product-placeholder.svg',
    images: images.length > 0 ? images : [p.thumbnail?.url || '/images/product-placeholder.svg'],
    specs,
    price: formatPrice(p.price),
    priceLabel: p.priceLabel || 'Liên hệ',
    badge: p.badge || null,
    status: p.status || 'ACTIVE',
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
    approvedReviews: Array.isArray(p.reviews)
      ? p.reviews.map((review) => ({
          name: review.name || '',
          rating: review.rating || 5,
          content: review.content || '',
          status: 'APPROVED' as const,
        }))
      : [],
  }
}

export function mapServiceToPublicService(s: ServiceLike): PublicService {
  return {
    id: s.id || '',
    title: s.title || '',
    slug: s.slug || '',
    description: s.description || '',
    image: s.image?.url || '/images/placeholder.jpg',
  }
}

export function mapServiceToServiceDetail(s: ServiceLike): PublicServiceDetail {
  const benefits = parseArray<string>(s.benefits)
  const process = parseArray<ServiceProcessLike>(s.process)

  const faqs = Array.isArray(s.faqs)
    ? s.faqs.map((f) => ({ question: f.question || '', answer: f.answer || '' }))
    : []

  return {
    id: s.id || '',
    title: s.title || '',
    slug: s.slug || '',
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

export function mapPostToPublicPost(p: PostLike): PublicPostCard {
  return {
    id: p.id || '',
    title: p.title || '',
    excerpt: p.excerpt || '',
    date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : '',
    image: p.thumbnail?.url || '/images/placeholder.jpg',
    category: p.category?.name || 'Tin tức',
    categorySlug: p.category?.slug || 'tin-tuc',
    slug: p.slug || '',
  }
}

export function mapPostToPostDetail(p: PostLike): PublicPostDetail {
  return {
    id: p.id || '',
    title: p.title || '',
    slug: p.slug || '',
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
    updatedAtIso: new Date(p.updatedAt || new Date()).toISOString(),
    authorName: p.author?.name || null,
  }
}

export function mapTestimonialToPublicTestimonial(t: TestimonialLike): PublicTestimonial {
  return {
    id: t.id || '',
    name: t.name || '',
    location: t.location || '',
    quote: t.quote || '',
    image: t.image?.url || '/images/placeholder.jpg',
    rating: t.rating || 5,
  }
}

export function mapBannerToPublicBanner(b: BannerLike): PublicBanner {
  return {
    id: b.id || '',
    title: b.title || '',
    subtitle: b.subtitle || null,
    image: b.image?.url || '/images/placeholder.jpg',
    href: b.href || null,
    buttonText: b.buttonText || null,
    position: b.position || 'HOME_HERO',
  }
}

export function mapMenuToNavigation(menus: MenuLike[]): PublicNavigationItem[] {
  // Build a tree of menus
  const roots = menus.filter((m) => !m.parentId)
  return roots.map((root) => {
    const children = menus.filter((m) => m.parentId === root.id)
    return {
      label: root.label || '',
      href: root.href || '',
      ...(children.length > 0
        ? {
            children: children.map((c) => ({
              label: c.label || '',
              href: c.href || '',
            })),
          }
        : {}),
    }
  })
}
