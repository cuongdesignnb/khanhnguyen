import prisma from './prisma'
import * as homeData from '@/data/home'
import { logPublicDataFallback } from './public-db-safe'
import { toVietnameseSlug } from './slug'
import { defaultSettings } from '@/data/default-settings'
import { getSettingsByGroup } from './settings'
import { getFooterMenu, getHeaderMenu, getMobileMenu } from './menu'
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
  }
]

function getStaticProductFallback(slug: string): PublicProductDetail | null {
  const detailedMatch = fallbackProductDetails.find((p) => p.slug === slug)
  if (detailedMatch) return detailedMatch

  const homeMatch = homeData.featuredProducts.find(
    (p) => toVietnameseSlug((p as any).slug || p.id || p.name) === slug
  )
  if (homeMatch) {
    return {
      id: homeMatch.id,
      slug: toVietnameseSlug((homeMatch as any).slug || homeMatch.id || homeMatch.name),
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
        slug: toVietnameseSlug((p as any).slug || p.id || p.name),
        badge: p.badge,
        category: p.category,
        categorySlug: toVietnameseSlug(p.category),
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
      slug: toVietnameseSlug((p as any).slug || p.id || p.name),
      badge: p.badge,
      category: p.category,
      categorySlug: toVietnameseSlug(p.category),
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
    mobileNavigation,
    categories,
    featuredProducts,
    services,
    latestPosts,
    testimonials,
    brands,
  ] = await Promise.all([
    getSiteSettings(),
    getPublicMenus(),
    getPublicMobileMenus(),
    getVisibleCategories(),
    getFeaturedProducts(),
    getVisibleServices(),
    getLatestPosts(),
    getTestimonials(),
    getVisibleBrands(),
  ])

  const footerMenu = await getFooterMenu()
  return {
    siteConfig,
    navigation,
    mobileNavigation,
    footerGroups: footerMenu.items.map((column) => ({
      title: column.label, links: column.children.length ? column.children.map((link) => ({ label: link.label, href: link.url })) : [{ label: column.label, href: column.url }],
    })),
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
      origin,
      manufactureYear,
      stockStatus,
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
        { brand: { name: { contains: q, mode: 'insensitive' } } },
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

    if (origin) {
      where.origin = origin
    }

    if (manufactureYear) {
      where.manufactureYear = Number(manufactureYear)
    }

    if (stockStatus) {
      where.stockStatus = stockStatus
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      }
    }

    let orderBy: any = { sortOrder: 'asc' }
    if (sort === 'latest') orderBy = { createdAt: 'desc' }
    if (sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { sortOrder: 'asc' }]
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'best-seller') orderBy = [{ isBestSeller: 'desc' }, { sortOrder: 'asc' }]

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
      slug: toVietnameseSlug((p as any).slug || p.id || p.name),
      badge: p.badge || undefined,
      category: p.category,
      categorySlug: toVietnameseSlug(p.category),
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

export function parseProductListParams(resolvedParams: any): ProductListParams {
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseFloat(resolvedParams.minPrice) : undefined
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseFloat(resolvedParams.maxPrice) : undefined

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
    sort: typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as any) : undefined,
    page,
    minPrice,
    maxPrice,
  }
}

export async function getProductFilterOptions(categorySlug?: string) {
  try {
    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
    }

    if (categorySlug) {
      where.category = {
        OR: [
          { slug: categorySlug },
          { parent: { slug: categorySlug } },
        ],
      }
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
