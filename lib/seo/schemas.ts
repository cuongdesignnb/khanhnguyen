import { absoluteUrl } from './canonical'
import { compactObject } from './sanitize'
import type { BreadcrumbItem } from './types'
import { htmlToPlainText } from '@/lib/sanitize-html'

export function buildOrganizationSchema(config: any) {
  const { siteUrl, organization } = config
  return compactObject({ '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteUrl}#organization`,
    name: organization.organizationName, legalName: organization.legalName, description: organization.description,
    url: siteUrl, logo: absoluteUrl(organization.logoUrl, siteUrl), email: organization.email, telephone: organization.phone,
    sameAs: organization.socialLinks?.filter((url: string) => /^https?:\/\//.test(url)),
  })
}

export function buildLocalBusinessSchema(config: any) {
  const { siteUrl, organization } = config
  return compactObject({ '@context': 'https://schema.org', '@type': organization.businessType || 'LocalBusiness', '@id': `${siteUrl}#localbusiness`,
    name: organization.organizationName, description: organization.description, url: siteUrl,
    image: absoluteUrl(organization.logoUrl, siteUrl), telephone: organization.phone, email: organization.email,
    address: { '@type': 'PostalAddress', streetAddress: organization.address, addressLocality: organization.addressLocality,
      addressRegion: organization.addressRegion, postalCode: organization.postalCode, addressCountry: organization.addressCountry },
    geo: organization.latitude && organization.longitude ? { '@type': 'GeoCoordinates', latitude: organization.latitude, longitude: organization.longitude } : undefined,
    openingHoursSpecification: organization.openingHours?.map((entry: any) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: entry.days, opens: entry.opens, closes: entry.closes })),
    areaServed: organization.areaServed, sameAs: organization.socialLinks,
  })
}

export function buildWebSiteSchema(config: any) {
  return compactObject({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${config.siteUrl}#website`, url: config.siteUrl,
    name: config.seo.siteName, description: config.seo.defaultDescription, publisher: { '@id': `${config.siteUrl}#organization` } })
}

export function buildWebPageSchema(input: { name: string; description?: string | null; url: string; siteUrl: string; type?: string }) {
  return compactObject({ '@context': 'https://schema.org', '@type': input.type || 'WebPage', '@id': `${input.url}#webpage`, url: input.url,
    name: input.name, description: input.description, isPartOf: { '@id': `${input.siteUrl}#website` } })
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: item.url })) }
}

const availability: Record<string, string> = { IN_STOCK: 'InStock', OUT_OF_STOCK: 'OutOfStock', SOLD: 'SoldOut', PRE_ORDER: 'PreOrder', CONTACT: 'InStock' }
function conditionUrl(value?: string | null) {
  const text = (value || '').toLowerCase()
  if (text.includes('tân trang')) return 'https://schema.org/RefurbishedCondition'
  if (text.includes('mới') && !text.includes('nhật bãi')) return 'https://schema.org/NewCondition'
  return 'https://schema.org/UsedCondition'
}

export function buildProductSchema(product: any, config: any) {
  const url = `${config.siteUrl}/san-pham/${product.slug}`
  const price = product.price ? Number(product.price) : 0
  const reviews = (product.approvedReviews || []).filter((review: any) => review.status === 'APPROVED')
  const average = reviews.length ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length : 0
  return compactObject({ '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`, name: product.name, url,
    image: product.images.map((image: string) => absoluteUrl(image, config.siteUrl)), description: product.seoDescription || product.shortDescription || product.description,
    sku: product.sku, mpn: product.model, category: product.categoryName,
    brand: product.brandName ? { '@type': 'Brand', name: product.brandName } : undefined,
    itemCondition: conditionUrl(product.condition),
    offers: price > 0 ? { '@type': 'Offer', url, priceCurrency: 'VND', price,
      availability: `https://schema.org/${availability[product.stockStatus] || 'InStock'}`, itemCondition: conditionUrl(product.condition), seller: { '@id': `${config.siteUrl}#organization` } } : undefined,
    aggregateRating: reviews.length ? { '@type': 'AggregateRating', ratingValue: Number(average.toFixed(2)), reviewCount: reviews.length, bestRating: 5, worstRating: 1 } : undefined,
    review: reviews.map((review: any) => ({ '@type': 'Review', author: { '@type': 'Person', name: review.name }, reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 }, reviewBody: review.content })),
  })
}

export function buildArticleSchema(post: any, config: any) {
  const url = `${config.siteUrl}/tin-tuc/${post.slug}`
  return compactObject({ '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`, headline: post.title,
    description: post.seoDescription || post.excerpt, image: [absoluteUrl(post.ogImage || post.thumbnail, config.siteUrl)], url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }, datePublished: post.publishedAtIso, dateModified: post.updatedAtIso,
    author: { '@type': 'Person', name: post.authorName || config.organization.organizationName },
    publisher: { '@id': `${config.siteUrl}#organization` }, articleSection: post.categoryName, keywords: post.focusKeywords,
  })
}

export function buildServiceSchema(service: any, config: any) {
  const url = `${config.siteUrl}/dich-vu/${service.slug}`
  return compactObject({ '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`, name: service.title,
    description: htmlToPlainText(service.seoDescription || service.description), url, image: absoluteUrl(service.ogImage || service.image, config.siteUrl),
    provider: { '@id': `${config.siteUrl}#organization` }, areaServed: config.organization.areaServed, serviceType: service.title })
}

export function buildFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs.length) return null
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }
}

export function buildItemListSchema(items: Array<{ name: string; url: string; image?: string }>) {
  return compactObject({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: item.url, image: item.image })) })
}

export const buildContactPageSchema = (input: any) => buildWebPageSchema({ ...input, type: 'ContactPage' })
export const buildAboutPageSchema = (input: any) => buildWebPageSchema({ ...input, type: 'AboutPage' })
