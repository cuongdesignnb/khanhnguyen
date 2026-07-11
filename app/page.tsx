import { getHomeData, getSiteSettings } from '@/lib/public-data'
import HomePageClient from '@/components/home/home-page-client'
import JsonLd from '@/components/seo/json-ld'
import { buildOrganizationSchema, buildLocalBusinessSchema, buildWebSiteSchema, buildWebPageSchema } from '@/lib/seo/schemas'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSeoConfig } from '@/lib/seo/config'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildPageMetadata({ title: `${settings.name} | ${settings.tagline}`, description: settings.slogan, canonicalPath: '/' })
}

export default async function HomePage() {
  const data = await getHomeData()
  const seoConfig = await getSeoConfig()

  return (
    <>
      <JsonLd data={[
        ...(seoConfig.schemas.organizationEnabled ? [buildOrganizationSchema(seoConfig)] : []),
        ...(seoConfig.schemas.localBusinessEnabled ? [buildLocalBusinessSchema(seoConfig)] : []),
        buildWebSiteSchema(seoConfig),
        buildWebPageSchema({ name: seoConfig.seo.defaultTitle, description: seoConfig.seo.defaultDescription, url: seoConfig.siteUrl, siteUrl: seoConfig.siteUrl }),
      ]} />
      <HomePageClient data={data} />
    </>
  )
}
