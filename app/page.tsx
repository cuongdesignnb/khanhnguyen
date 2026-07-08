import { getHomeData, getSiteSettings } from '@/lib/public-data'
import HomePageClient from '@/components/home/home-page-client'
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
  return <HomePageClient data={data} />
}
