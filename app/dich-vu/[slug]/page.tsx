import { getServiceBySlug } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import ServiceDetailPage from '@/components/services/service-detail-page'
import JsonLd from '@/components/seo/json-ld'
import { faqSchema, breadcrumbSchema } from '@/lib/schema'
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
  return {
    title: `${service.title} | Khanh Nguyên Forklift`,
    description: service.seoDescription || service.description || `${service.title} chuyên nghiệp, uy tín tại TP.HCM và các tỉnh lân cận. Hỗ trợ tận tâm 24/7.`,
    alternates: {
      canonical: `/dich-vu/${service.slug}`,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const service = await getServiceBySlug(resolvedParams.slug)
  if (!service) {
    notFound()
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://khanhnguyenforklift.vn'
  
  const breadcrumbs = [
    { label: 'Trang chủ', url: origin },
    { label: 'Dịch vụ', url: `${origin}/dich-vu` },
    { label: service.title, url: `${origin}/dich-vu/${service.slug}` },
  ]

  return (
    <>
      <JsonLd schema={breadcrumbSchema(breadcrumbs)} />
      {service.faqs && service.faqs.length > 0 && (
        <JsonLd schema={faqSchema(service.faqs)} />
      )}
      <PublicPageShell>
        <ServiceDetailPage service={service} />
      </PublicPageShell>
    </>
  )
}
