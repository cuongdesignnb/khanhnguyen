import prisma from './prisma'
import * as homeData from '@/data/home'
import { Prisma, StockStatus } from '@prisma/client'
import { logPublicDataFallback } from './public-db-safe'
import { toVietnameseSlug } from './slug'
import { defaultSettings } from '@/data/default-settings'
import { getSettingsByGroup } from './settings'
import { getFooterMenu, getHeaderMenu, getMobileMenu } from './menu'
import { normalizeVideoUrl } from './videos/normalize-video-url'
import { clampHeroOverlayOpacity } from './hero/hero-overlay'
import type { HomeVideoSettingItem, PublicHomeVideoSection } from '@/types/home-video'
import {
  mapCategoryToPublicCategory,
  mapBrandToPublicBrand,
  mapProductToPublicCard,
  mapProductToProductDetail,
  mapServiceToPublicService,
  mapServiceToServiceDetail,
  mapPostToPublicPost,
  mapPostToPostDetail,
  mapTestimonialToPublicTestimonial,
  mapBannerToPublicBanner,
} from './public-mappers'
import {
  PublicSiteConfig,
  PublicCategory,
  PublicBrand,
  PublicProductCard,
  PublicProductCategorySection,
  PublicProductDetail,
  PublicService,
  PublicServiceDetail,
  PublicPostCard,
  PublicPostDetail,
  PublicTestimonial,
  PublicBanner,
  PublicHeroSettings,
  PublicCategorySliderSettings,
  PublicNavigationItem,
  ProductListParams,
  ProductListResult,
  PostListParams,
  PostListResult,
} from '@/types/public'

type StaticHomeProduct = (typeof homeData.featuredProducts)[number] & { slug?: string }
type ResolvedSearchParams = Record<string, string | string[] | undefined>
type HomeConfigRuntime = {
  heroEnabled?: unknown
  heroOverlayContentEnabled?: unknown
  heroTextEnabled?: unknown
  heroCtaEnabled?: unknown
  heroTitle?: unknown
  heroSubtitle?: unknown
  heroDescription?: unknown
  heroImageId?: unknown
  heroPrimaryCtaLabel?: unknown
  heroPrimaryCtaUrl?: unknown
  heroSecondaryCtaLabel?: unknown
  heroSecondaryCtaUrl?: unknown
  heroSliderEnabled?: unknown
  heroSliderAutoplay?: unknown
  heroSliderIntervalMs?: unknown
  heroSliderTransition?: unknown
  heroSliderPauseOnHover?: unknown
  heroSliderShowArrows?: unknown
  heroSliderShowDots?: unknown
  heroSliderMaxItems?: unknown
  heroSliderOverlayOpacity?: unknown
  categoriesEnabled?: unknown
  categorySliderEnabled?: unknown
  categorySliderAutoplay?: unknown
  categorySliderIntervalMs?: unknown
  categorySliderPauseOnHover?: unknown
  categorySliderShowArrows?: unknown
  categorySliderLoop?: unknown
  categorySliderDesktopItems?: unknown
  categorySliderLaptopItems?: unknown
  categorySliderTabletItems?: unknown
  categorySliderMobileItems?: unknown
  categorySliderMaxItems?: unknown
  brandsEnabled?: unknown
  brandSectionEyebrow?: unknown
  brandSectionTitle?: unknown
  brandSliderEnabled?: unknown
  brandSliderAutoplay?: unknown
  brandSliderIntervalMs?: unknown
  brandSliderPauseOnHover?: unknown
  brandSliderShowArrows?: unknown
  brandSliderLoop?: unknown
  brandSliderDesktopItems?: unknown
  brandSliderTabletItems?: unknown
  brandSliderMobileItems?: unknown
  brandSliderMaxItems?: unknown
  featuredProductsEnabled?: boolean
  featuredProductsLimit?: unknown
  categoryProductSectionsEnabled?: boolean
  categoryProductLimit?: unknown
  videoSectionEnabled?: unknown
  videoSectionEyebrow?: unknown
  videoSectionTitle?: unknown
  videoSectionDescription?: unknown
  videoSectionLimit?: unknown
  videoSectionCtaLabel?: unknown
  videoSectionCtaUrl?: unknown
  videoItems?: unknown
}

const HOME_PRODUCT_MAX_LIMIT = 8

function clampHomeProductLimit(value: unknown, fallback = HOME_PRODUCT_MAX_LIMIT) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(HOME_PRODUCT_MAX_LIMIT, Math.max(1, Math.floor(parsed)))
}

function getStaticProductSlug(product: StaticHomeProduct) {
  return toVietnameseSlug(product.slug || product.id || product.name)
}

function mapStaticHomeProduct(product: StaticHomeProduct) {
  return mapProductToPublicCard({ ...product, slug: getStaticProductSlug(product) })
}

const EMPTY_HOME_VIDEO_SECTION: PublicHomeVideoSection = {
  enabled: false,
  eyebrow: '',
  title: '',
  description: '',
  ctaLabel: '',
  ctaUrl: '',
  items: [],
}

function textValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

function clampVideoLimit(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.min(12, Math.max(1, Math.floor(parsed))) : 8
}

function isHomeVideoSettingItem(value: unknown): value is HomeVideoSettingItem {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string'
    && typeof item.title === 'string'
    && (item.source === 'youtube' || item.source === 'facebook')
    && typeof item.url === 'string'
    && (typeof item.thumbnailId === 'string' || item.thumbnailId === null)
    && typeof item.isEnabled === 'boolean'
    && typeof item.sortOrder === 'number'
}

async function getHomeVideoSection(homeConfig: HomeConfigRuntime): Promise<PublicHomeVideoSection> {
  if (homeConfig.videoSectionEnabled === false) return EMPTY_HOME_VIDEO_SECTION
  try {
    const normalizedItems = (Array.isArray(homeConfig.videoItems) ? homeConfig.videoItems : [])
      .filter(isHomeVideoSettingItem)
      .filter((item) => item.isEnabled && item.title.trim())
      .map((item) => ({ item, normalized: normalizeVideoUrl(item.url) }))
      .filter((entry): entry is typeof entry & { normalized: NonNullable<typeof entry.normalized> } => Boolean(entry.normalized))
      .filter((entry) => entry.item.source === entry.normalized.source)
      .sort((a, b) => a.item.sortOrder - b.item.sortOrder)
      .slice(0, clampVideoLimit(homeConfig.videoSectionLimit))

    const thumbnailIds = [...new Set(normalizedItems.map(({ item }) => item.thumbnailId).filter((id): id is string => Boolean(id)))]
    const media = thumbnailIds.length
      ? await prisma.mediaFile.findMany({ where: { id: { in: thumbnailIds }, deletedAt: null }, select: { id: true, url: true } })
      : []
    const mediaById = new Map(media.map((item) => [item.id, item.url]))

    return {
      enabled: true,
      eyebrow: textValue(homeConfig.videoSectionEyebrow, 'VIDEO THỰC TẾ'),
      title: textValue(homeConfig.videoSectionTitle, 'VIDEO XE NÂNG KHÁNH NGUYÊN'),
      description: textValue(homeConfig.videoSectionDescription),
      ctaLabel: textValue(homeConfig.videoSectionCtaLabel, 'Xem thêm video'),
      ctaUrl: textValue(homeConfig.videoSectionCtaUrl),
      items: normalizedItems.map(({ item, normalized }) => ({
        id: item.id,
        title: item.title.trim(),
        source: normalized.source,
        originalUrl: normalized.originalUrl,
        embedUrl: normalized.embedUrl,
        thumbnailUrl: (item.thumbnailId && mediaById.get(item.thumbnailId)) || normalized.autoThumbnailUrl || '/images/video-placeholder.svg',
      })),
    }
  } catch (error) {
    logPublicDataFallback('getHomeVideoSection', error)
    return EMPTY_HOME_VIDEO_SECTION
  }
}

const fallbackProductDetails: PublicProductDetail[] = [
  {
    id: 'toyota-7fb15-fallback-id',
    slug: 'xe-nang-dien-dung-lai-toyota-15-tan-7fb15',
    sku: 'KN-ED-7FB15-2019',
    name: 'Xe nâng điện đứng lái Toyota 1.5 tấn 7FB15',
    model: '7FB15',
    categoryId: 'xe-nang-dien',
    categoryName: 'Xe nâng điện',
    categorySlug: 'xe-nang-dien',
    brandId: 'toyota-brand-id',
    brandName: 'Toyota',
    brandSlug: 'toyota',
    thumbnail: '/images/seed/products/toyota-8fb25.jpg',
    images: ['/images/seed/products/toyota-8fb25.jpg'],
    specs: [
      { label: 'Model', value: '7FB15' },
      { label: 'Thương hiệu', value: 'Toyota' },
      { label: 'Tải trọng nâng', value: '1500 kg' },
      { label: 'Chiều cao nâng', value: '4500 mm' },
      { label: 'Tâm tải trọng', value: '500 mm' },
      { label: 'Chiều dài càng', value: '1070 mm' },
      { label: 'Nguồn năng lượng', value: 'Điện 48V' },
      { label: 'Loại pin', value: 'Ắc quy chì axit' },
      { label: 'Dung lượng pin', value: '48V – 420Ah' },
      { label: 'Năm sản xuất', value: '2019' },
      { label: 'Xuất xứ', value: 'Nhật Bản' },
      { label: 'Tình trạng', value: 'Nhật bãi 85%' },
      { label: 'Giờ hoạt động', value: '3.250 giờ' },
      { label: 'Tổng trọng lượng', value: '2650 kg' },
      { label: 'Bánh trước', value: 'Bánh đặc' },
      { label: 'Bánh sau', value: 'Bánh đặc' },
      { label: 'Bán kính quay vòng', value: '1480 mm' },
      { label: 'Tốc độ di chuyển', value: '10.5 km/h' }
    ],
    price: '425000000',
    priceLabel: '425.000.000đ',
    badge: 'Mới',
    status: 'PUBLISHED',
    stockStatus: 'IN_STOCK',
    isFeatured: true,
    isBestSeller: true,
    capacity: '1500 kg',
    liftHeight: '4.5 m',
    fuelType: 'Điện',
    manufactureYear: 2019,
    forkLength: '1070 mm',
    condition: 'Nhật bãi 85%',
    origin: 'Nhật Bản',
    shortDescription: 'Xe nâng điện đứng lái Toyota 7FB15 tải trọng 1.5 tấn, nâng cao 4.5m, hoạt động êm ái, tiết kiệm năng lượng, phù hợp kho xưởng, kệ cao.',
    description: 'Xe nâng điện đứng lái Toyota 7FB15 là lựa chọn tối ưu cho các kho xưởng, nhà máy, siêu thị với khả năng vận hành linh hoạt trong không gian hẹp. Được thiết kế bởi Toyota Nhật Bản, sản phẩm nổi bật với độ bền cao, vận hành êm ái, tiết kiệm điện năng và chi phí bảo trì thấp.',
    advantages: [
      'Thiết kế nhỏ gọn, bán kính quay vòng nhỏ, phù hợp lối đi hẹp.',
      'Động cơ điện mạnh mẽ, vận hành êm, không khí thải, thân thiện môi trường.',
      'Hệ thống điều khiển thông minh, an toàn và chính xác.',
      'Pin dung lượng lớn, thời gian sử dụng dài, sạc nhanh.',
      'Độ bền cao, phụ tùng dễ thay thế, chi phí bảo dưỡng thấp.'
    ],
    warrantyPolicy: 'Bảo hành 6 – 12 tháng hoặc 1000 giờ hoạt động tùy điều kiện nào đến trước. Hỗ trợ kỹ thuật 24/7 qua hotline, Zalo.',
    seoTitle: null,
    seoDescription: null,
    ogImage: null,
    canonicalUrl: null,
    ogTitle: null,
    ogDescription: null,
    robotsIndex: true,
    robotsFollow: true,
    approvedReviews: [],
  }
]

function getStaticProductFallback(slug: string): PublicProductDetail | null {
  const detailedMatch = fallbackProductDetails.find((p) => p.slug === slug)
  if (detailedMatch) return detailedMatch

  const homeMatch = homeData.featuredProducts.find(
    (p) => getStaticProductSlug(p) === slug
  )
  if (homeMatch) {
    return {
      id: homeMatch.id,
      slug: getStaticProductSlug(homeMatch),
      sku: `KN-${homeMatch.id.toUpperCase()}`,
      name: homeMatch.name,
      model: homeMatch.name,
      categoryId: 'xe-nang-dien',
      categoryName: homeMatch.category,
      categorySlug: toVietnameseSlug(homeMatch.category),
      brandId: null,
      brandName: null,
      brandSlug: null,
      thumbnail: homeMatch.image,
      images: [homeMatch.image],
      specs: homeMatch.specs,
      price: null,
      priceLabel: homeMatch.priceLabel,
      badge: homeMatch.badge || null,
      status: 'PUBLISHED',
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestSeller: false,
      capacity: null,
      liftHeight: null,
      fuelType: null,
      manufactureYear: null,
      forkLength: null,
      condition: null,
      origin: null,
      shortDescription: `${homeMatch.name} chất lượng cao Nhật bãi.`,
      description: `${homeMatch.name} chất lượng cao Nhật bãi. Vận hành ổn định, tiết kiệm năng lượng.`,
      advantages: [],
      warrantyPolicy: 'Bảo hành 6 - 12 tháng.',
      seoTitle: null,
      seoDescription: null,
      ogImage: null,
      canonicalUrl: null,
      ogTitle: null,
      ogDescription: null,
      robotsIndex: true,
      robotsFollow: true,
      approvedReviews: [],
    }
  }
  return null
}

// 1. Settings
export async function getSiteSettings(): Promise<PublicSiteConfig> {
  try {
    const [general, contact, social, brand] = await Promise.all([
      getSettingsByGroup('general.site', defaultSettings.generalSite),
      getSettingsByGroup('contact.info', defaultSettings.contactInfo),
      getSettingsByGroup('social.links', defaultSettings.socialLinks),
      getSettingsByGroup('brand.identity', defaultSettings.brandIdentity),
    ])
    const logo = brand.logoId ? await prisma.mediaFile.findUnique({ where: { id: brand.logoId }, select: { url: true } }) : null
    return {
      name: general.siteName, tagline: general.slogan, slogan: general.description,
      hotline: contact.hotline, secondaryHotline: contact.hotlineSecondary, email: contact.email,
      showroom: contact.showroomAddress || contact.address, branch: contact.warehouseAddress,
      workingHours: contact.workingHours, facebookLink: social.facebook, zaloLink: social.zalo,
      youtubeLink: social.youtube, tiktokLink: social.tiktok, logoUrl: logo?.url,
    }
  } catch (error) {
    logPublicDataFallback('getSiteSettings', error)
    return {
      name: homeData.siteConfig.name,
      tagline: homeData.siteConfig.tagline,
      slogan: homeData.siteConfig.slogan,
      hotline: homeData.siteConfig.hotline,
      secondaryHotline: homeData.siteConfig.secondaryHotline,
      email: homeData.siteConfig.email,
      showroom: homeData.siteConfig.showroom,
      branch: homeData.siteConfig.branch,
      workingHours: homeData.siteConfig.workingHours,
    }
  }
}

// 2. Navigation / Menus
export async function getPublicMenus(): Promise<PublicNavigationItem[]> {
  try {
    const menu = await getHeaderMenu()
    return menu.items.map((item) => ({ label: item.label, href: item.url, children: item.children.map((child) => ({ label: child.label, href: child.url })) }))
  } catch (error) {
    logPublicDataFallback('getPublicMenus', error)
    return homeData.navigation
  }
}

export async function getPublicMobileMenus(): Promise<PublicNavigationItem[]> {
  const menu = await getMobileMenu()
  return menu.items.map((item) => ({ label: item.label, href: item.url, children: item.children.map((child) => ({ label: child.label, href: child.url })) }))
}

// 3. Banners
const FALLBACK_HERO_BANNER: PublicBanner = {
  id: 'hero-fallback', title: 'GIẢI PHÁP XE NÂNG TOÀN DIỆN', subtitle: 'KHANH NGUYÊN FORKLIFT',
  image: '/images/seed/hero/industrial-yard.jpg', href: '/san-pham', buttonText: 'Xem sản phẩm', position: 'HOME_HERO',
}

export async function getHomeHeroBanners(limit = 8, legacyImageId?: string | null): Promise<PublicBanner[]> {
  try {
    const dbBanners = await prisma.banner.findMany({
      where: { position: 'HOME_HERO', isVisible: true, deletedAt: null, imageId: { not: null }, image: { deletedAt: null } },
      include: { image: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: Math.min(8, Math.max(1, limit)),
    })
    const banners = dbBanners.filter((banner) => Boolean(banner.image?.url)).map(mapBannerToPublicBanner)
    if (banners.length) return banners
    if (legacyImageId) {
      const legacyImage = await prisma.mediaFile.findFirst({ where: { id: legacyImageId, deletedAt: null }, select: { url: true } })
      if (legacyImage?.url) return [{ ...FALLBACK_HERO_BANNER, id: 'hero-legacy-image', image: legacyImage.url }]
    }
    return [FALLBACK_HERO_BANNER]
  } catch (error) {
    logPublicDataFallback('getHomeHeroBanners', error)
    return [FALLBACK_HERO_BANNER]
  }
}

export const getHomeBanners = getHomeHeroBanners

// 4. Brands
export async function getVisibleBrands(limit = 20): Promise<PublicBrand[]> {
  try {
    const dbBrands = await prisma.brand.findMany({
      where: { isVisible: true, deletedAt: null },
      include: { logo: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      take: limit,
    })
    return dbBrands.map(mapBrandToPublicBrand)
  } catch (error) {
    logPublicDataFallback('getVisibleBrands', error)
    return homeData.brandNames.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }))
  }
}

// 5. Categories
export async function getVisibleCategories(): Promise<PublicCategory[]> {
  try {
    const [dbCategories, productCategories] = await Promise.all([
      prisma.category.findMany({
        where: { isVisible: true, deletedAt: null },
        include: { bannerImage: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
          category: { isVisible: true, deletedAt: null },
        },
        select: { categoryId: true },
        distinct: ['categoryId'],
      }),
    ])
    const categoryById = new Map(dbCategories.map((category) => [category.id, category]))
    const categoryIdsWithProducts = new Set<string>()

    for (const productCategory of productCategories) {
      let current = categoryById.get(productCategory.categoryId)
      const visited = new Set<string>()

      while (current && !visited.has(current.id)) {
        visited.add(current.id)
        categoryIdsWithProducts.add(current.id)
        current = current.parentId ? categoryById.get(current.parentId) : undefined
      }
    }

    return dbCategories
      .filter((category) => categoryIdsWithProducts.has(category.id))
      .map(mapCategoryToPublicCategory)
  } catch (error) {
    logPublicDataFallback('getVisibleCategories', error)
    return homeData.categories.map((c) => ({
      id: c.id,
      name: c.label,
      slug: c.href.replace('/', ''),
      subtitle: c.subtitle,
      icon: c.icon,
    }))
  }
}

async function getVisibleCategoryTreeIds(categorySlug: string) {
  const categories = await prisma.category.findMany({
    where: { isVisible: true, deletedAt: null },
    select: { id: true, parentId: true, slug: true },
  })
  const selected = categories.find((category) => category.slug === categorySlug)
  if (!selected) return []

  const ids = new Set([selected.id])
  let foundDescendant = true
  while (foundDescendant) {
    foundDescendant = false
    for (const category of categories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id)
        foundDescendant = true
      }
    }
  }
  return [...ids]
}

// 6. Featured Products
export async function getFeaturedProducts(limit = HOME_PRODUCT_MAX_LIMIT): Promise<PublicProductCard[]> {
  const take = clampHomeProductLimit(limit)
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
        showOnHome: true,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        category: true,
        brand: true,
        thumbnail: true,
        specs: { orderBy: { sortOrder: 'asc' }, take: 12 },
        reviews: { where: { status: 'APPROVED', deletedAt: null }, select: { name: true, rating: true, content: true, status: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      take,
    })
    return dbProducts.map(mapProductToPublicCard)
  } catch (error) {
    logPublicDataFallback('getFeaturedProducts', error)
    return homeData.featuredProducts.slice(0, take).map(mapStaticHomeProduct)
  }
}

export async function getHomeProductCategorySections(limit = HOME_PRODUCT_MAX_LIMIT): Promise<PublicProductCategorySection[]> {
  const perSectionLimit = clampHomeProductLimit(limit)

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: { isVisible: true, deletedAt: null },
        include: { bannerImage: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: {
          showOnHome: true,
          status: 'PUBLISHED',
          deletedAt: null,
          category: { isVisible: true, deletedAt: null },
        },
        include: {
          category: true,
          brand: true,
          thumbnail: true,
          specs: { orderBy: { sortOrder: 'asc' }, take: 12 },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
    ])

    const categoryById = new Map(categories.map((category) => [category.id, category]))
    const rootCategories = categories.filter((category) => !category.parentId)
    const grouped = new Map<string, PublicProductCard[]>()

    function resolveRootCategoryId(categoryId: string) {
      let current = categoryById.get(categoryId)
      const visited = new Set<string>()

      while (current?.parentId && !visited.has(current.id)) {
        visited.add(current.id)
        const parent = categoryById.get(current.parentId)
        if (!parent) break
        current = parent
      }

      return current && !current.parentId ? current.id : null
    }

    for (const product of products) {
      const rootCategoryId = resolveRootCategoryId(product.categoryId)
      if (!rootCategoryId) continue

      const currentProducts = grouped.get(rootCategoryId) || []
      if (currentProducts.length >= perSectionLimit) continue
      currentProducts.push(mapProductToPublicCard(product))
      grouped.set(rootCategoryId, currentProducts)
    }

    return rootCategories
      .map((category) => ({
        category: mapCategoryToPublicCategory(category),
        products: grouped.get(category.id) || [],
      }))
      .filter((section) => section.products.length > 0)
  } catch (error) {
    logPublicDataFallback('getHomeProductCategorySections', error)
    return []
  }
}

// 7. Services
export async function getVisibleServices(): Promise<PublicService[]> {
  try {
    const dbServices = await prisma.service.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      include: { image: true },
      orderBy: { sortOrder: 'asc' },
    })
    if (!dbServices || dbServices.length === 0) {
      return homeData.services.map((s, i) => ({
        id: `service-${i}`,
        title: s.title,
        slug: s.title.toLowerCase().replace(/\s+/g, '-'),
        description: s.subtitle,
        image: s.image,
      }))
    }
    return dbServices.map(mapServiceToPublicService)
  } catch (error) {
    logPublicDataFallback('getVisibleServices', error)
    return homeData.services.map((s, i) => ({
      id: `service-${i}`,
      title: s.title,
      slug: s.title.toLowerCase().replace(/\s+/g, '-'),
      description: s.subtitle,
      image: s.image,
    }))
  }
}

// 8. Testimonials
export async function getTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      where: { isVisible: true, deletedAt: null },
      include: { image: true },
      orderBy: { sortOrder: 'asc' },
    })
    if (!dbTestimonials || dbTestimonials.length === 0) {
      return homeData.testimonials.map((t, i) => ({
        id: `t-${i}`,
        name: t.name,
        location: t.location,
        quote: t.quote,
        image: t.image,
        rating: t.rating,
      }))
    }
    return dbTestimonials.map(mapTestimonialToPublicTestimonial)
  } catch (error) {
    logPublicDataFallback('getTestimonials', error)
    return homeData.testimonials.map((t, i) => ({
      id: `t-${i}`,
      name: t.name,
      location: t.location,
      quote: t.quote,
      image: t.image,
      rating: t.rating,
    }))
  }
}

// 9. Latest Posts
export async function getLatestPosts(): Promise<PublicPostCard[]> {
  try {
    const dbPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      include: { category: true, thumbnail: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
    if (!dbPosts || dbPosts.length === 0) {
      return homeData.latestPosts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        image: p.image,
        category: 'Tin tức',
        categorySlug: 'tin-tuc',
        slug: p.href.replace('/tin-tuc/', ''),
      }))
    }
    return dbPosts.map(mapPostToPublicPost)
  } catch (error) {
    logPublicDataFallback('getLatestPosts', error)
    return homeData.latestPosts.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      image: p.image,
      category: 'Tin tức',
      categorySlug: 'tin-tuc',
      slug: p.href.replace('/tin-tuc/', ''),
    }))
  }
}

// 10. Home Data aggregator
export async function getHomeData() {
  const homeConfig = await getSettingsByGroup('home.config', defaultSettings.homeConfig) as HomeConfigRuntime
  const featuredProductsEnabled = homeConfig.featuredProductsEnabled !== false
  const categoryProductSectionsEnabled = homeConfig.categoryProductSectionsEnabled !== false
  const featuredProductsLimit = clampHomeProductLimit(homeConfig.featuredProductsLimit)
  const categoryProductLimit = clampHomeProductLimit(homeConfig.categoryProductLimit)
  const transition = ['fade', 'slide', 'fade-zoom'].includes(String(homeConfig.heroSliderTransition)) ? String(homeConfig.heroSliderTransition) as PublicHeroSettings['transition'] : 'fade-zoom'
  const heroSettings: PublicHeroSettings = {
    enabled: homeConfig.heroEnabled !== false,
    overlayContentEnabled: homeConfig.heroOverlayContentEnabled !== false,
    textEnabled: homeConfig.heroTextEnabled !== false,
    ctaEnabled: homeConfig.heroCtaEnabled !== false,
    title: textValue(homeConfig.heroTitle, 'GIẢI PHÁP XE NÂNG TOÀN DIỆN'), subtitle: textValue(homeConfig.heroSubtitle, 'KHANH NGUYÊN FORKLIFT'),
    description: textValue(homeConfig.heroDescription), primaryCtaLabel: textValue(homeConfig.heroPrimaryCtaLabel, 'Xem sản phẩm'),
    primaryCtaUrl: textValue(homeConfig.heroPrimaryCtaUrl, '/san-pham'), secondaryCtaLabel: textValue(homeConfig.heroSecondaryCtaLabel, 'Nhận tư vấn'),
    secondaryCtaUrl: textValue(homeConfig.heroSecondaryCtaUrl, '/lien-he'), sliderEnabled: homeConfig.heroSliderEnabled !== false,
    autoplay: homeConfig.heroSliderAutoplay !== false, intervalMs: Math.min(15000, Math.max(3000, Number(homeConfig.heroSliderIntervalMs) || 5500)),
    transition, pauseOnHover: homeConfig.heroSliderPauseOnHover !== false, showArrows: homeConfig.heroSliderShowArrows !== false,
    showDots: homeConfig.heroSliderShowDots !== false, maxItems: Math.min(8, Math.max(1, Number(homeConfig.heroSliderMaxItems) || 8)),
    overlayOpacity: clampHeroOverlayOpacity(homeConfig.heroSliderOverlayOpacity),
  }

  const integerSetting = (value: unknown, fallback: number, min: number, max: number) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.floor(parsed))) : fallback
  }
  const brandSliderSettings = {
    enabled: homeConfig.brandsEnabled !== false,
    eyebrow: textValue(homeConfig.brandSectionEyebrow, 'THƯƠNG HIỆU'),
    title: textValue(homeConfig.brandSectionTitle, 'THƯƠNG HIỆU NỔI BẬT'),
    sliderEnabled: homeConfig.brandSliderEnabled !== false,
    autoplay: homeConfig.brandSliderAutoplay !== false,
    intervalMs: integerSetting(homeConfig.brandSliderIntervalMs, 3000, 2000, 15000),
    pauseOnHover: homeConfig.brandSliderPauseOnHover !== false,
    showArrows: homeConfig.brandSliderShowArrows !== false,
    loop: homeConfig.brandSliderLoop !== false,
    desktopItems: integerSetting(homeConfig.brandSliderDesktopItems, 6, 3, 8),
    tabletItems: integerSetting(homeConfig.brandSliderTabletItems, 4, 2, 6),
    mobileItems: integerSetting(homeConfig.brandSliderMobileItems, 2, 1, 3),
    maxItems: integerSetting(homeConfig.brandSliderMaxItems, 20, 1, 50),
  }
  const categorySliderSettings: PublicCategorySliderSettings = {
    enabled: homeConfig.categoriesEnabled !== false,
    sliderEnabled: homeConfig.categorySliderEnabled !== false,
    autoplay: homeConfig.categorySliderAutoplay !== false,
    intervalMs: integerSetting(homeConfig.categorySliderIntervalMs, 3500, 2000, 15000),
    pauseOnHover: homeConfig.categorySliderPauseOnHover !== false,
    showArrows: homeConfig.categorySliderShowArrows !== false,
    loop: homeConfig.categorySliderLoop !== false,
    desktopItems: integerSetting(homeConfig.categorySliderDesktopItems, 8, 4, 10),
    laptopItems: integerSetting(homeConfig.categorySliderLaptopItems, 6, 3, 8),
    tabletItems: integerSetting(homeConfig.categorySliderTabletItems, 4, 2, 6),
    mobileItems: integerSetting(homeConfig.categorySliderMobileItems, 2, 1, 3),
    maxItems: integerSetting(homeConfig.categorySliderMaxItems, 20, 1, 50),
  }

  const [
    siteConfig,
    navigation,
    mobileNavigation,
    categories,
    featuredProducts,
    productCategorySections,
    services,
    latestPosts,
    testimonials,
    brands,
    videoSection,
    heroBanners,
  ] = await Promise.all([
    getSiteSettings(),
    getPublicMenus(),
    getPublicMobileMenus(),
    categorySliderSettings.enabled ? getVisibleCategories() : Promise.resolve([]),
    featuredProductsEnabled ? getFeaturedProducts(featuredProductsLimit) : Promise.resolve([]),
    categoryProductSectionsEnabled ? getHomeProductCategorySections(categoryProductLimit) : Promise.resolve([]),
    getVisibleServices(),
    getLatestPosts(),
    getTestimonials(),
    brandSliderSettings.enabled ? getVisibleBrands(brandSliderSettings.maxItems) : Promise.resolve([]),
    getHomeVideoSection(homeConfig),
    getHomeHeroBanners(heroSettings.maxItems, typeof homeConfig.heroImageId === 'string' ? homeConfig.heroImageId : null),
  ])

  const footerMenu = await getFooterMenu()
  return {
    siteConfig,
    navigation,
    mobileNavigation,
    footerGroups: footerMenu.items.map((column) => ({
      title: column.label, links: column.children.length ? column.children.map((link) => ({ label: link.label, href: link.url })) : [{ label: column.label, href: column.url }],
    })),
    categories: categories.slice(0, categorySliderSettings.maxItems),
    categorySliderSettings,
    featuredProducts,
    productCategorySections,
    services,
    latestPosts,
    testimonials,
    stats: homeData.stats,
    brands,
    brandSliderSettings,
    videoSection,
    heroBanners,
    heroSettings,
  }
}

// 11. Product detail/lists
export async function getProductList(params: ProductListParams): Promise<ProductListResult> {
  try {
    const {
      q,
      category,
      brand,
      fuel,
      condition,
      capacity,
      liftHeight,
      minPrice,
      maxPrice,
      origin,
      manufactureYear,
      stockStatus,
      sort = 'latest',
      page = 1,
      limit = 12,
    } = params

    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      status: 'PUBLISHED',
      deletedAt: null,
      category: { isVisible: true, deletedAt: null },
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { name: { contains: q, mode: 'insensitive' } } },
      ]
    }

    if (category) {
      where.categoryId = { in: await getVisibleCategoryTreeIds(category) }
    }

    if (brand) {
      where.brand = { slug: brand }
    }

    if (fuel) {
      where.fuelType = fuel
    }

    if (condition) {
      where.condition = condition
    }

    if (capacity) {
      where.capacity = capacity
    }

    if (liftHeight) {
      where.liftHeight = liftHeight
    }

    if (origin) {
      where.origin = origin
    }

    if (manufactureYear) {
      where.manufactureYear = Number(manufactureYear)
    }

    if (stockStatus) {
      if (Object.values(StockStatus).includes(stockStatus as StockStatus)) {
        where.stockStatus = stockStatus as StockStatus
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = { sortOrder: 'asc' }
    if (sort === 'latest') orderBy = { createdAt: 'desc' }
    if (sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { sortOrder: 'asc' }]
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'best-seller') orderBy = [{ isBestSeller: 'desc' }, { sortOrder: 'asc' }]

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, thumbnail: true, specs: { orderBy: { sortOrder: 'asc' }, take: 12 } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return {
      items: items.map(mapProductToPublicCard),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    logPublicDataFallback('getProductList', error)

    // Hotfix: Fallback to static featuredProducts instead of returning empty list
    const mappedFallback = homeData.featuredProducts.map(mapStaticHomeProduct)

    return {
      items: mappedFallback,
      total: mappedFallback.length,
      page: 1,
      limit: params.limit || 12,
      totalPages: 1,
    }
  }
}

export async function getProductBySlug(slug: string): Promise<PublicProductDetail | null> {
  try {
    const dbProduct = await prisma.product.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: {
        category: true,
        brand: true,
        thumbnail: true,
        ogImage: true,
        images: {
          include: { media: true },
          orderBy: { sortOrder: 'asc' },
        },
        specs: { orderBy: { sortOrder: 'asc' } },
      },
    })
    if (!dbProduct) {
      return getStaticProductFallback(slug)
    }
    return mapProductToProductDetail(dbProduct)
  } catch (error) {
    logPublicDataFallback('getProductBySlug', error)
    return getStaticProductFallback(slug)
  }
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 6): Promise<PublicProductCard[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: { category: true, brand: true, thumbnail: true, specs: { orderBy: { sortOrder: 'asc' }, take: 12 } },
      take: limit,
      orderBy: { sortOrder: 'asc' },
    })
    return dbProducts.map(mapProductToPublicCard)
  } catch (error) {
    logPublicDataFallback('getRelatedProducts', error)
    return []
  }
}

// 12. Category details
export async function getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  try {
    const dbCategory = await prisma.category.findFirst({
      where: { slug, deletedAt: null },
      include: { bannerImage: true },
    })
    if (!dbCategory) return null
    return mapCategoryToPublicCategory(dbCategory)
  } catch (error) {
    logPublicDataFallback('getCategoryBySlug', error)
    return null
  }
}

export async function getProductsByCategorySlug(
  categorySlug: string,
  params: Omit<ProductListParams, 'category'>
): Promise<ProductListResult> {
  return getProductList({ ...params, category: categorySlug })
}

export async function getAllProductCategorySlugs(): Promise<string[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
      select: { slug: true },
    })
    return categories.map((c) => c.slug)
  } catch (error) {
    logPublicDataFallback('getAllProductCategorySlugs', error)
    return []
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true },
    })
    return products.map((p) => p.slug)
  } catch (error) {
    logPublicDataFallback('getAllProductSlugs', error)
    return []
  }
}

// 13. Service details
export async function getServiceList(): Promise<PublicService[]> {
  return getVisibleServices()
}

export async function getServiceBySlug(slug: string): Promise<PublicServiceDetail | null> {
  try {
    const dbService = await prisma.service.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { image: true, ogImage: true, faqs: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!dbService) return null
    return mapServiceToServiceDetail(dbService)
  } catch (error) {
    logPublicDataFallback('getServiceBySlug', error)
    return null
  }
}

export async function getAllServiceSlugs(): Promise<string[]> {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true },
    })
    return services.map((s) => s.slug)
  } catch (error) {
    logPublicDataFallback('getAllServiceSlugs', error)
    return []
  }
}

// 14. Blog Posts details
export async function getPostList(params: PostListParams): Promise<PostListResult> {
  try {
    const { q, category, page = 1, limit = 9 } = params
    const skip = (page - 1) * limit

    const where: Prisma.PostWhereInput = {
      status: 'PUBLISHED',
      deletedAt: null,
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { category: true, thumbnail: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return {
      items: items.map(mapPostToPublicPost),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    logPublicDataFallback('getPostList', error)
    const mappedFallback = homeData.latestPosts.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      image: p.image,
      category: 'Tin tức',
      categorySlug: 'tin-tuc',
      slug: p.href.replace('/tin-tuc/', ''),
    }))
    return {
      items: mappedFallback,
      total: mappedFallback.length,
      page: 1,
      limit: params.limit || 9,
      totalPages: 1,
    }
  }
}

export async function getPostBySlug(slug: string): Promise<PublicPostDetail | null> {
  try {
    const dbPost = await prisma.post.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { category: true, author: true, thumbnail: true, ogImage: true },
    })
    if (!dbPost) return null

    prisma.post.update({
      where: { id: dbPost.id },
      data: { viewCount: { increment: 1 } },
    }).catch(e => logPublicDataFallback('getPostBySlug:incrementView', e))

    return mapPostToPostDetail(dbPost)
  } catch (error) {
    logPublicDataFallback('getPostBySlug', error)
    return null
  }
}

export async function getPostCategoryBySlug(slug: string) {
  try {
    return await prisma.postCategory.findFirst({
      where: { slug, isVisible: true, deletedAt: null },
    })
  } catch (error) {
    logPublicDataFallback('getPostCategoryBySlug', error)
    return null
  }
}

export async function getPostsByCategorySlug(
  categorySlug: string,
  params: Omit<PostListParams, 'category'>
): Promise<PostListResult> {
  return getPostList({ ...params, category: categorySlug })
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true },
    })
    return posts.map((p) => p.slug)
  } catch (error) {
    logPublicDataFallback('getAllPostSlugs', error)
    return []
  }
}

export async function getAllPostCategorySlugs(): Promise<string[]> {
  try {
    const categories = await prisma.postCategory.findMany({
      where: { isVisible: true, deletedAt: null },
      select: { slug: true },
    })
    return categories.map((c) => c.slug)
  } catch (error) {
    logPublicDataFallback('getAllPostCategorySlugs', error)
    return []
  }
}

export function parseProductListParams(resolvedParams: ResolvedSearchParams): ProductListParams {
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseFloat(resolvedParams.minPrice) : undefined
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseFloat(resolvedParams.maxPrice) : undefined
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined
  const allowedSorts: NonNullable<ProductListParams['sort']>[] = ['latest', 'featured', 'price-asc', 'price-desc', 'best-seller']

  return {
    q: typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined,
    category: typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined,
    brand: typeof resolvedParams.brand === 'string' ? resolvedParams.brand : undefined,
    fuel: typeof resolvedParams.fuel === 'string' ? resolvedParams.fuel : undefined,
    condition: typeof resolvedParams.condition === 'string' ? resolvedParams.condition : undefined,
    capacity: typeof resolvedParams.capacity === 'string' ? resolvedParams.capacity : undefined,
    liftHeight: typeof resolvedParams.liftHeight === 'string' ? resolvedParams.liftHeight : undefined,
    origin: typeof resolvedParams.origin === 'string' ? resolvedParams.origin : undefined,
    manufactureYear: typeof resolvedParams.manufactureYear === 'string' ? resolvedParams.manufactureYear : undefined,
    stockStatus: typeof resolvedParams.stockStatus === 'string' ? resolvedParams.stockStatus : undefined,
    sort: sort && allowedSorts.includes(sort as NonNullable<ProductListParams['sort']>)
      ? (sort as NonNullable<ProductListParams['sort']>)
      : undefined,
    page,
    minPrice,
    maxPrice,
  }
}

export async function getProductFilterOptions(categorySlug?: string) {
  try {
    const where: Prisma.ProductWhereInput = {
      status: 'PUBLISHED',
      deletedAt: null,
      category: { isVisible: true, deletedAt: null },
    }

    if (categorySlug) {
      where.categoryId = { in: await getVisibleCategoryTreeIds(categorySlug) }
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        capacity: true,
        liftHeight: true,
        fuelType: true,
        condition: true,
        origin: true,
        manufactureYear: true,
        stockStatus: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    const unique = (values: (string | number | null | undefined)[]) =>
      Array.from(new Set(values.filter(Boolean).map(String))).sort()

    const brandsMap = new Map()
    const categoriesMap = new Map()

    for (const product of products) {
      if (product.brand) {
        brandsMap.set(product.brand.slug, product.brand)
      }

      if (product.category) {
        categoriesMap.set(product.category.slug, product.category)
      }
    }

    return {
      categories: Array.from(categoriesMap.values()),
      brands: Array.from(brandsMap.values()),
      capacities: unique(products.map((p) => p.capacity)),
      liftHeights: unique(products.map((p) => p.liftHeight)),
      fuelTypes: unique(products.map((p) => p.fuelType)),
      conditions: unique(products.map((p) => p.condition)),
      origins: unique(products.map((p) => p.origin)),
      manufactureYears: unique(products.map((p) => p.manufactureYear)).sort((a, b) => Number(b) - Number(a)),
      stockStatuses: unique(products.map((p) => p.stockStatus)),
    }
  } catch (error) {
    logPublicDataFallback('getProductFilterOptions', error)
    return {
      categories: [],
      brands: [],
      capacities: ['1.0 tấn', '1.5 tấn', '2.0 tấn', '2.5 tấn', '3.0 tấn', '5.0 tấn'],
      liftHeights: ['3.0 m', '4.0 m', '4.5 m', '6.0 m'],
      fuelTypes: ['Điện', 'Dầu', 'Xăng/Gas', 'Cơ/Tay'],
      conditions: ['Bãi', 'Mới'],
      origins: ['Nhật Bản', 'Trung Quốc', 'Hàn Quốc'],
      manufactureYears: ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
      stockStatuses: ['IN_STOCK', 'OUT_OF_STOCK', 'CONTACT', 'SOLD'],
    }
  }
}
