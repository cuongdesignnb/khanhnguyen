import type { Metadata } from 'next'
import { getSeoConfig } from './config'
import { absoluteUrl } from './canonical'
import type { BuildMetadataInput } from './types'

export async function buildPageMetadata(input: BuildMetadataInput): Promise<Metadata> {
  const config = await getSeoConfig()
  const title = input.title || config.seo.defaultTitle
  const description = input.description || config.seo.defaultDescription
  const canonical = absoluteUrl(input.canonicalUrl || input.canonicalPath, config.siteUrl)!
  const image = absoluteUrl(input.ogImage || config.defaultOgImage || '/opengraph-image', config.siteUrl)
  return {
    title, description,
    alternates: { canonical },
    openGraph: {
      type: input.type || 'website', locale: 'vi_VN', siteName: config.seo.siteName,
      title: input.ogTitle || title, description: input.ogDescription || description,
      url: canonical, images: image ? [{ url: image, width: 1200, height: 630, alt: input.ogTitle || title }] : undefined,
      ...(input.type === 'article' ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime } : {}),
    },
    twitter: { card: config.seo.twitterCard, title: input.ogTitle || title, description: input.ogDescription || description, images: image ? [image] : undefined },
    robots: { index: input.robotsIndex ?? config.seo.robotsIndex, follow: input.robotsFollow ?? config.seo.robotsFollow },
  }
}

export const buildProductMetadata = buildPageMetadata
export const buildCategoryMetadata = buildPageMetadata
export const buildServiceMetadata = buildPageMetadata
export const buildPostMetadata = (input: BuildMetadataInput) => buildPageMetadata({ ...input, type: 'article' })
export const buildPostCategoryMetadata = buildPageMetadata
export async function buildNoIndexMetadata(title = 'Trang riêng tư'): Promise<Metadata> {
  return { title, robots: { index: false, follow: false, nocache: true } }
}

export async function buildBaseMetadata(): Promise<Metadata> {
  const config = await getSeoConfig()
  const image = absoluteUrl(config.defaultOgImage || '/opengraph-image', config.siteUrl)
  return {
    metadataBase: new URL(config.siteUrl), applicationName: config.seo.siteName,
    title: { default: config.seo.defaultTitle, template: config.seo.titleTemplate },
    description: config.seo.defaultDescription, keywords: [...config.seo.defaultKeywords],
    authors: [{ name: config.organization.organizationName }], creator: config.organization.organizationName, publisher: config.organization.organizationName,
    alternates: { canonical: config.siteUrl },
    openGraph: { type: 'website', locale: 'vi_VN', siteName: config.seo.siteName, title: config.seo.defaultTitle, description: config.seo.defaultDescription, url: config.siteUrl, images: image ? [image] : undefined },
    twitter: { card: config.seo.twitterCard, title: config.seo.defaultTitle, description: config.seo.defaultDescription, images: image ? [image] : undefined },
    robots: { index: config.seo.robotsIndex, follow: config.seo.robotsFollow },
    verification: { google: config.seo.googleVerificationCode || undefined, other: config.seo.bingVerificationCode ? { 'msvalidate.01': config.seo.bingVerificationCode } : undefined },
    icons: config.favicon ? { icon: config.favicon } : undefined,
  }
}
