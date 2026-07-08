import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giỏ hàng | Khanh Nguyên Forklift',
  description: 'Giỏ hàng xe nâng và linh kiện phụ tùng của bạn.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Giỏ hàng" subtitle="Quản lý yêu cầu báo giá của bạn" />
    </PublicPageShell>
  )
}
