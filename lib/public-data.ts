import prisma from './prisma'
import * as homeData from '@/data/home'
import { logPublicDataFallback } from './public-db-safe'
import {
  mapSettingRowsToSiteConfig,
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
  mapMenuToNavigation,
} from './public-mappers'
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
  ProductListParams,
  ProductListResult,
  PostListParams,
  PostListResult,
} from '@/types/public'

// 1. Settings
export async function getSiteSettings(): Promise<PublicSiteConfig> {
  try {
    const dbSettings = await prisma.setting.findMany()
    const defaultSiteConfig: PublicSiteConfig = {
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
    if (!dbSettings || dbSettings.length === 0) {
      return defaultSiteConfig
    }
    return mapSettingRowsToSiteConfig(dbSettings, defaultSiteConfig)
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
    const dbMenus = await prisma.menu.findMany({
      where: { isVisible: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    })
    if (!dbMenus || dbMenus.length === 0) {
      return homeData.navigation
    }
    return mapMenuToNavigation(dbMenus)
  } catch (error) {
    logPublicDataFallback('getPublicMenus', error)
    return homeData.navigation
  }
}

// 3. Banners
export async function getHomeBanners(): Promise<PublicBanner[]> {
  try {
    const dbBanners = await prisma.banner.findMany({
      where: { isVisible: true, deletedAt: null },
      include: { image: true },
      orderBy: { sortOrder: 'asc' },
    })
    return dbBanners.map(mapBannerToPublicBanner)
  } catch (error) {
    logPublicDataFallback('getHomeBanners', error)
    return []
  }
}

// 4. Brands
export async function getVisibleBrands(): Promise<PublicBrand[]> {
  try {
    const dbBrands = await prisma.brand.findMany({
      where: { isVisible: true, deletedAt: null },
      include: { logo: true },
      orderBy: { sortOrder: 'asc' },
    })
    if (!dbBrands || dbBrands.length === 0) {
      return homeData.brandNames.map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      }))
    }
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
    const dbCategories = await prisma.category.findMany({
      where: { isVisible: true, deletedAt: null },
      include: { bannerImage: true },
      orderBy: { sortOrder: 'asc' },
    })
    if (!dbCategories || dbCategories.length === 0) {
      return homeData.categories.map((c) => ({
        id: c.id,
        name: c.label,
        slug: c.href.replace('/', ''),
        subtitle: c.subtitle,
        icon: c.icon,
      }))
    }
    return dbCategories.map(mapCategoryToPublicCategory)
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

// 6. Featured Products
export async function getFeaturedProducts(): Promise<PublicProductCard[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        category: true,
        brand: true,
        thumbnail: true,
        specs: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    })
    if (!dbProducts || dbProducts.length === 0) {
      return homeData.featuredProducts.map((p) => ({
        id: p.id,
        slug: p.id,
        badge: p.badge,
        category: p.category,
        categorySlug: p.category.toLowerCase().replace(/\s+/g, '-'),
        name: p.name,
        model: p.name,
        image: p.image,
        specs: p.specs,
        price: null,
        priceLabel: p.priceLabel,
      }))
    }
    return dbProducts.map(mapProductToPublicCard)
  } catch (error) {
    logPublicDataFallback('getFeaturedProducts', error)
    return homeData.featuredProducts.map((p) => ({
      id: p.id,
      slug: p.id,
      badge: p.badge,
      category: p.category,
      categorySlug: p.category.toLowerCase().replace(/\s+/g, '-'),
      name: p.name,
      model: p.name,
      image: p.image,
      specs: p.specs,
      price: null,
      priceLabel: p.priceLabel,
    }))
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
  const [
    siteConfig,
    navigation,
    categories,
    featuredProducts,
    services,
    latestPosts,
    testimonials,
    brands,
  ] = await Promise.all([
    getSiteSettings(),
    getPublicMenus(),
    getVisibleCategories(),
    getFeaturedProducts(),
    getVisibleServices(),
    getLatestPosts(),
    getTestimonials(),
    getVisibleBrands(),
  ])

  return {
    siteConfig,
    navigation,
    footerGroups: homeData.footerGroups,
    categories,
    featuredProducts,
    services,
    latestPosts,
    testimonials,
    stats: homeData.stats,
    brands,
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
      sort = 'latest',
      page = 1,
      limit = 12,
    } = params

    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = {
        OR: [
          { slug: category },
          { parent: { slug: category } },
        ],
      }
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

    if (minPrice !== undefined) {
      where.price = { gte: minPrice }
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice }
    }

    let orderBy: any = { sortOrder: 'asc' }
    if (sort === 'latest') {
      orderBy = { createdAt: 'desc' }
    } else if (sort === 'featured') {
      orderBy = { isFeatured: 'desc' }
    } else if (sort === 'price-asc') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' }
    } else if (sort === 'best-seller') {
      orderBy = { isBestSeller: 'desc' }
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, thumbnail: true },
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
    const mappedFallback = homeData.featuredProducts.map((p) => ({
      id: p.id,
      slug: p.id,
      badge: p.badge || undefined,
      category: p.category,
      categorySlug: p.category.toLowerCase().replace(/\s+/g, '-'),
      name: p.name,
      model: p.name,
      image: p.image,
      specs: p.specs,
      price: null,
      priceLabel: p.priceLabel,
    }))

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
    if (!dbProduct) return null
    return mapProductToProductDetail(dbProduct)
  } catch (error) {
    logPublicDataFallback('getProductBySlug', error)
    return null
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
      include: { category: true, brand: true, thumbnail: true },
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
      include: { image: true, faqs: { orderBy: { sortOrder: 'asc' } } },
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

    const where: any = {
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
    return {
      items: [],
      total: 0,
      page: 1,
      limit: params.limit || 9,
      totalPages: 0,
    }
  }
}

export async function getPostBySlug(slug: string): Promise<PublicPostDetail | null> {
  try {
    const dbPost = await prisma.post.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { category: true, thumbnail: true, ogImage: true },
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
