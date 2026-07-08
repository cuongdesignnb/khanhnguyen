import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thanh toán & Giao hàng | Khanh Nguyên Forklift',
  description: 'Các hình thức thanh toán chuyển khoản, tiền mặt và chính sách vận chuyển giao hàng toàn quốc.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Thanh toán & Giao hàng" subtitle="Chính sách vận chuyển bàn giao xe nâng" />
    </PublicPageShell>
  )
}
