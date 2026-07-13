export interface PublicSiteConfig {
  name: string
  tagline: string
  slogan: string
  hotline: string
  secondaryHotline: string
  email: string
  showroom: string
  branch: string
  workingHours: string
  facebookLink?: string
  zaloLink?: string
  youtubeLink?: string
  tiktokLink?: string
  logoUrl?: string
}

export interface PublicNavigationItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export interface PublicCategory {
  id: string
  name: string
  slug: string
  subtitle: string
  icon: string
  description?: string
  bannerImage?: string
}

export interface PublicBrand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
}

export interface PublicProductSpec {
  key?: string
  label: string
  value: string
  sortOrder?: number
}

export interface PublicProductCard {
  id: string
  slug: string
  badge?: string
  category: string
  categorySlug: string
  name: string
  model: string
  image: string
  specs: PublicProductSpec[]
  price: string | null
  priceLabel: string
}

export interface PublicProductDetail {
  id: string
  slug: string
  sku: string | null
  name: string
  model: string | null
  categoryId: string
  categoryName: string
  categorySlug: string
  brandId: string | null
  brandName: string | null
  brandSlug: string | null
  thumbnail: string
  images: string[]
  specs: PublicProductSpec[]
  price: string | null
  priceLabel: string
  badge: string | null
  status: string
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'CONTACT' | 'SOLD'
  isFeatured: boolean
  isBestSeller: boolean
  capacity: string | null
  liftHeight: string | null
  fuelType: string | null
  manufactureYear: number | null
  forkLength: string | null
  condition: string | null
  origin: string | null
  shortDescription: string | null
  description: string | null
  advantages: string[]
  warrantyPolicy: string | null
  seoTitle: string | null
  seoDescription: string | null
  ogImage: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  robotsIndex: boolean
  robotsFollow: boolean
  approvedReviews: { name: string; rating: number; content: string; status: 'APPROVED' }[]
}

export interface PublicService {
  id: string
  title: string
  slug: string
  description: string
  image: string
}

export interface PublicServiceFAQ {
  question: string
  answer: string
}

export interface PublicServiceDetail {
  id: string
  title: string
  slug: string
  subtitle: string | null
  description: string | null
  content: string | null
  image: string
  benefits: string[]
  process: { title: string; description: string }[]
  faqs: PublicServiceFAQ[]
  ctaTitle: string | null
  ctaDescription: string | null
  ctaButtonText: string | null
  ctaButtonHref: string | null
  seoTitle: string | null
  seoDescription: string | null
  ogImage: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  robotsIndex: boolean
  robotsFollow: boolean
}

export interface PublicPostCard {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  category: string
  categorySlug: string
  slug: string
}

export interface PublicPostDetail {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  thumbnail: string
  categoryName: string
  categorySlug: string
  publishedAt: string
  viewCount: number
  seoTitle: string | null
  seoDescription: string | null
  ogImage: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  robotsIndex: boolean
  robotsFollow: boolean
  publishedAtIso: string | null
  updatedAtIso: string
  authorName: string | null
}

export interface PublicPostCategory {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface PublicTestimonial {
  id: string
  name: string
  location: string
  quote: string
  image: string
  rating: number
}

export interface PublicBanner {
  id: string
  title: string
  subtitle: string | null
  image: string
  href: string | null
  buttonText: string | null
  position: 'HOME_HERO' | 'HOME_PROMO' | 'CATEGORY' | 'POPUP' | 'FOOTER'
}

export interface PublicHeroSettings {
  enabled: boolean
  overlayContentEnabled: boolean
  textEnabled: boolean
  ctaEnabled: boolean
  title: string
  subtitle: string
  description: string
  primaryCtaLabel: string
  primaryCtaUrl: string
  secondaryCtaLabel: string
  secondaryCtaUrl: string
  sliderEnabled: boolean
  autoplay: boolean
  intervalMs: number
  transition: 'fade' | 'slide' | 'fade-zoom'
  pauseOnHover: boolean
  showArrows: boolean
  showDots: boolean
  maxItems: number
  overlayOpacity: number
}

export interface PublicProductCategorySection {
  category: PublicCategory
  products: PublicProductCard[]
}

export type { PublicHomeVideoSection } from './home-video'
import type { PublicHomeVideoSection } from './home-video'

export interface PublicHomeData {
  siteConfig: PublicSiteConfig
  navigation: PublicNavigationItem[]
  mobileNavigation: PublicNavigationItem[]
  footerGroups: { title: string; links: { label: string; href: string }[] }[]
  categories: PublicCategory[]
  featuredProducts: PublicProductCard[]
  productCategorySections: PublicProductCategorySection[]
  heroBanners: PublicBanner[]
  heroSettings: PublicHeroSettings
  videoSection: PublicHomeVideoSection
  services: PublicService[]
  latestPosts: PublicPostCard[]
  testimonials: PublicTestimonial[]
  stats: { value: number; suffix: string; label: string; icon: string }[]
  brands: PublicBrand[]
}

export interface ProductListParams {
  q?: string
  category?: string
  brand?: string
  fuel?: string
  condition?: string
  capacity?: string
  liftHeight?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'latest' | 'featured' | 'price-asc' | 'price-desc' | 'best-seller'
  page?: number
  limit?: number
  origin?: string
  manufactureYear?: string
  stockStatus?: string
}

export interface ProductListResult {
  items: PublicProductCard[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PostListParams {
  q?: string
  category?: string
  page?: number
  limit?: number
}

export interface PostListResult {
  items: PublicPostCard[]
  total: number
  page: number
  limit: number
  totalPages: number
}
