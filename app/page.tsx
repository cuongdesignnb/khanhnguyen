import { getHomeData, getSiteSettings } from '@/lib/public-data'
import HomePageClient from '@/components/home/home-page-client'
import JsonLd from '@/components/seo/json-ld'
import { buildOrganizationSchema, buildLocalBusinessSchema, buildWebSiteSchema, buildWebPageSchema } from '@/lib/seo/schemas'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSeoConfig } from '@/lib/seo/config'
import { getSettingGroup } from '@/lib/site-config/settings'
import type { HeaderConfig } from '@/types/header-settings'
import type { HeaderContact } from '@/lib/header/resolve-header-utility-item'
import type { ProductCardSettings } from '@/types/product-card-settings'
import type { Metadata } from 'next'
import { getResolvedFloatingContactConfig } from '@/lib/floating-contact'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildPageMetadata({ title: `${settings.name} | ${settings.tagline}`, description: settings.slogan, canonicalPath: '/' })
}

export default async function HomePage() {
  const [data, seoConfig, headerConfig, contactConfig, productCardConfig, floatingContactConfig] = await Promise.all([
    getHomeData(),
    getSeoConfig(),
    getSettingGroup('header.config'),
    getSettingGroup('contact.info'),
    getSettingGroup('products.config'),
    getResolvedFloatingContactConfig(),
  ])

  return (
    <>
      <JsonLd data={[
        ...(seoConfig.schemas.organizationEnabled ? [buildOrganizationSchema(seoConfig)] : []),
        ...(seoConfig.schemas.localBusinessEnabled ? [buildLocalBusinessSchema(seoConfig)] : []),
        buildWebSiteSchema(seoConfig),
        buildWebPageSchema({ name: seoConfig.seo.defaultTitle, description: seoConfig.seo.defaultDescription, url: seoConfig.siteUrl, siteUrl: seoConfig.siteUrl }),
      ]} />
      <HomePageClient
        data={data}
        headerConfig={headerConfig as unknown as HeaderConfig}
        contactConfig={contactConfig as HeaderContact}
        productCardConfig={productCardConfig as unknown as ProductCardSettings}
        floatingContactConfig={floatingContactConfig}
      />
    </>
  )
}
