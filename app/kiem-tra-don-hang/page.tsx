import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiểm tra đơn hàng | Khanh Nguyên Forklift',
  description: 'Tra cứu thông tin, tiến độ giao hàng xe nâng của bạn nhanh chóng và chính xác.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Kiểm tra đơn hàng" subtitle="Tra cứu tiến độ đơn hàng xe nâng" />
    </PublicPageShell>
  )
}
