import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hướng dẫn mua hàng | Khanh Nguyên Forklift',
  description: 'Quy trình chọn mua xe nâng Nhật bãi, thanh toán và vận chuyển bàn giao.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Hướng dẫn mua hàng" subtitle="Quy trình mua xe nâng tại Khanh Nguyên" />
    </PublicPageShell>
  )
}
