import { getServiceList } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import ServicesListPage from '@/components/services/services-list-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dịch vụ xe nâng | Khanh Nguyên Forklift',
  description: 'Dịch vụ cho thuê xe nâng Nhật bãi giá rẻ, sửa chữa xe nâng lưu động, bảo dưỡng định kỳ xe nâng, cung cấp linh kiện ắc quy chính hãng.',
  alternates: { canonical: '/dich-vu' },
}

export default async function Page() {
  const services = await getServiceList()

  return (
    <PublicPageShell>
      <ServicesListPage services={services} />
    </PublicPageShell>
  )
}
