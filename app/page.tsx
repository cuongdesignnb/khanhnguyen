import { getHomeData, getSiteSettings } from '@/lib/public-data'
import HomePageClient from '@/components/home/home-page-client'
import JsonLd from '@/components/seo/json-ld'
import { organizationSchema, localBusinessSchema } from '@/lib/schema'
import { getSiteUrl } from '@/lib/site-url'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: `${settings.name} | ${settings.tagline}`,
    description: settings.slogan || `${settings.name} chuyên cung cấp xe nâng, xe cẩu Nhật bãi uy tín.`,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${settings.name} | ${settings.tagline}`,
      description: settings.slogan || `${settings.name} chuyên cung cấp xe nâng, xe cẩu Nhật bãi uy tín.`,
      url: '/',
      siteName: settings.name,
      locale: 'vi_VN',
      type: 'website',
    },
  }
}

export default async function HomePage() {
  const data = await getHomeData()
  const origin = getSiteUrl()

  return (
    <>
      <JsonLd schema={organizationSchema(data.siteConfig, origin)} />
      <JsonLd schema={localBusinessSchema(data.siteConfig, origin)} />
      <HomePageClient data={data} />
    </>
  )
}
