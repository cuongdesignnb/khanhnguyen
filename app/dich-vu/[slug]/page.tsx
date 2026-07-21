import { getServiceBySlug } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import ServiceDetailPage from '@/components/services/service-detail-page'
import JsonLd from '@/components/seo/json-ld'
import { buildFaqSchema, buildBreadcrumbSchema, buildServiceSchema } from '@/lib/seo/schemas'
import { buildServiceMetadata } from '@/lib/seo/metadata'
import { getSeoConfig } from '@/lib/seo/config'
import { htmlToPlainText } from '@/lib/sanitize-html'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const service = await getServiceBySlug(resolvedParams.slug)
  if (!service) {
    return { title: 'Không tìm thấy dịch vụ' }
  }
  return buildServiceMetadata({ title: service.seoTitle || service.title, description: htmlToPlainText(service.seoDescription || service.description),
    canonicalPath: `/dich-vu/${service.slug}`, canonicalUrl: service.canonicalUrl, ogTitle: service.ogTitle,
    ogDescription: service.ogDescription, ogImage: service.ogImage || service.image, robotsIndex: service.robotsIndex, robotsFollow: service.robotsFollow })
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const service = await getServiceBySlug(resolvedParams.slug)
  if (!service) {
    notFound()
  }

  const seoConfig = await getSeoConfig()
  const origin = seoConfig.siteUrl
  
  const breadcrumbs = [
    { label: 'Trang chủ', url: origin },
    { label: 'Dịch vụ', url: `${origin}/dich-vu` },
    { label: service.title, url: `${origin}/dich-vu/${service.slug}` },
  ]

  return (
    <>
      {seoConfig.schemas.serviceEnabled && <JsonLd data={buildServiceSchema(service, seoConfig)} />}
      {seoConfig.schemas.breadcrumbEnabled && <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />}
      {seoConfig.schemas.faqEnabled && service.faqs && service.faqs.length > 0 && (
        <JsonLd data={buildFaqSchema(service.faqs)} />
      )}
      <PublicPageShell>
        <ServiceDetailPage service={service} />
      </PublicPageShell>
    </>
  )
}
