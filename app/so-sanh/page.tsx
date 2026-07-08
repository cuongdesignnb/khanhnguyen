import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'So sánh xe nâng | Khanh Nguyên Forklift',
  description: 'So sánh thông số kỹ thuật, giá cả các dòng xe nâng Nhật bãi giúp bạn dễ dàng chọn lựa.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="So sánh sản phẩm" subtitle="So sánh thông số kỹ thuật các dòng xe nâng" />
    </PublicPageShell>
  )
}
