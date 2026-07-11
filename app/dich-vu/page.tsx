import { getServiceList } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import ServicesListPage from '@/components/services/services-list-page'
import type { Metadata } from 'next'
import JsonLd from '@/components/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildBreadcrumbSchema, buildItemListSchema, buildWebPageSchema } from '@/lib/seo/schemas'
import { getSeoConfig } from '@/lib/seo/config'

export async function generateMetadata(): Promise<Metadata> { return buildPageMetadata({ title: 'Dịch vụ xe nâng', description: 'Cho thuê, sửa chữa và bảo dưỡng xe nâng chuyên nghiệp.', canonicalPath: '/dich-vu' }) }

export default async function Page() {
  const services = await getServiceList()
  const seoConfig = await getSeoConfig()

  return (
    <><JsonLd data={[
      buildWebPageSchema({ name: 'Dịch vụ xe nâng', url: `${seoConfig.siteUrl}/dich-vu`, siteUrl: seoConfig.siteUrl, type: 'CollectionPage' }),
      buildItemListSchema(services.map((item) => ({ name: item.title, url: `${seoConfig.siteUrl}/dich-vu/${item.slug}`, image: item.image }))),
      buildBreadcrumbSchema([{ label: 'Trang chủ', url: seoConfig.siteUrl }, { label: 'Dịch vụ', url: `${seoConfig.siteUrl}/dich-vu` }]),
    ]} /><PublicPageShell>
      <ServicesListPage services={services} />
    </PublicPageShell></>
  )
}
