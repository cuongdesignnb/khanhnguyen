import BannerAdminPage from '@/components/admin/banners/banner-admin-page'

const positions = ['HOME_HERO', 'HOME_PROMO', 'CATEGORY', 'POPUP', 'FOOTER'] as const

export default async function BannersPage({ searchParams }: { searchParams: Promise<{ position?: string }> }) {
  const position = (await searchParams).position
  const initialPosition = positions.includes(position as (typeof positions)[number]) ? position as (typeof positions)[number] : ''
  return <BannerAdminPage initialPosition={initialPosition} />
}
