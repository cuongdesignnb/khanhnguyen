import { PublicSiteConfig, PublicProductDetail, PublicServiceDetail, PublicPostDetail } from '@/types/public'

export function organizationSchema(config: PublicSiteConfig, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': config.name,
    'url': origin,
    'logo': `${origin}/images/logo.png`,
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': config.hotline,
        'contactType': 'customer service',
        'areaServed': 'VN',
        'availableLanguage': 'Vietnamese',
      },
    ],
    'sameAs': [
      config.facebookLink || '#',
      config.youtubeLink || '#',
    ],
  }
}

export function localBusinessSchema(config: PublicSiteConfig, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': config.name,
    'description': config.tagline,
    'url': origin,
    'telephone': config.hotline,
    'email': config.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': config.showroom,
      'addressLocality': 'Bình Tân',
      'addressRegion': 'Hồ Chí Minh',
      'addressCountry': 'VN',
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'opens': '07:30',
        'closes': '17:30',
      },
    ],
  }
}

export function productSchema(product: PublicProductDetail, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': product.images,
    'description': product.shortDescription || product.name,
    'sku': product.sku || product.id,
    'mpn': product.model || undefined,
    'brand': {
      '@type': 'Brand',
      'name': product.brandName || 'Khanh Nguyên',
    },
    'offers': {
      '@type': 'Offer',
      'url': `${origin}/san-pham/${product.slug}`,
      'priceCurrency': 'VND',
      'price': product.price || '0',
      'priceSpecification': {
        '@type': 'PriceSpecification',
        'price': product.price || '0',
        'priceCurrency': 'VND',
        'valueAddedTaxIncluded': true,
      },
      'availability':
        product.stockStatus === 'IN_STOCK'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Khanh Nguyên Forklift',
      },
    },
  }
}

export function articleSchema(post: PublicPostDetail, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': post.title,
    'image': [post.thumbnail],
    'datePublished': post.publishedAt,
    'author': {
      '@type': 'Person',
      'name': 'Ban Biên Tập Khanh Nguyên',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Khanh Nguyên Forklift',
      'logo': {
        '@type': 'ImageObject',
        'url': `${origin}/images/logo.png`,
      },
    },
    'description': post.excerpt || post.title,
  }
}

export function breadcrumbSchema(items: { label: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': item.label,
      'item': item.url || undefined,
    })),
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}
