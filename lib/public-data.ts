import prisma from './prisma'
import * as homeData from '@/data/home'

export async function getSiteSettings() {
  try {
    const dbSettings = await prisma.setting.findMany()
    if (!dbSettings || dbSettings.length === 0) {
      return homeData.siteConfig
    }
    
    const config: Record<string, any> = { ...homeData.siteConfig }
    for (const s of dbSettings) {
      if (s.value !== null) {
        config[s.key] = s.value
      }
    }
    return config
  } catch (error) {
    console.error('getSiteSettings fallback to static:', error)
    return homeData.siteConfig
  }
}

export async function getFeaturedProducts() {
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
      },
      orderBy: { sortOrder: 'asc' },
    })

    if (!dbProducts || dbProducts.length === 0) {
      return homeData.featuredProducts
    }

    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      model: p.model || p.name,
      category: p.category.name,
      price: p.price ? p.price.toString() : null,
      priceLabel: p.priceLabel,
      image: p.thumbnail?.url || '/images/placeholder.jpg',
      badge: p.badge || undefined,
      specs: {},
    }))
  } catch (error) {
    console.error('getFeaturedProducts fallback to static:', error)
    return homeData.featuredProducts
  }
}

export async function getVisibleServices() {
  try {
    const dbServices = await prisma.service.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      include: { image: true },
      orderBy: { sortOrder: 'asc' },
    })
    
    if (!dbServices || dbServices.length === 0) {
      return homeData.services
    }

    return dbServices.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description || '',
      image: s.image?.url || '/images/placeholder.jpg',
      slug: s.slug,
    }))
  } catch (error) {
    console.error('getVisibleServices fallback to static:', error)
    return homeData.services
  }
}

export async function getLatestPosts() {
  try {
    const dbPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      include: { category: true, thumbnail: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })

    if (!dbPosts || dbPosts.length === 0) {
      return homeData.latestPosts
    }

    return dbPosts.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt || '',
      date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : '',
      category: p.category?.name || 'Tin tức',
      image: p.thumbnail?.url || '/images/placeholder.jpg',
      slug: p.slug,
    }))
  } catch (error) {
    console.error('getLatestPosts fallback to static:', error)
    return homeData.latestPosts
  }
}

export async function getVisibleCategories() {
  try {
    const dbCategories = await prisma.category.findMany({
      where: { isVisible: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    })

    if (!dbCategories || dbCategories.length === 0) {
      return homeData.categories
    }

    return dbCategories.map((c) => ({
      name: c.name,
      slug: c.slug,
      icon: c.icon || 'Folder',
    }))
  } catch (error) {
    console.error('getVisibleCategories fallback to static:', error)
    return homeData.categories
  }
}

export async function getHomeData() {
  const [settings, featuredProducts, services, latestPosts, categories] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
    getVisibleServices(),
    getLatestPosts(),
    getVisibleCategories(),
  ])

  return {
    siteConfig: settings,
    navigation: homeData.navigation,
    footerGroups: homeData.footerGroups,
    categories,
    featuredProducts,
    services,
    latestPosts,
    testimonials: homeData.testimonials,
    stats: homeData.stats,
  }
}
