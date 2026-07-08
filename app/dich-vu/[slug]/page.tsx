import { getServiceBySlug } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import ServiceDetailPage from '@/components/services/service-detail-page'
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

  return (
    <PublicPageShell>
      <ServiceDetailPage service={service} />
    </PublicPageShell>
  )
}
