import PublicPageShell from '@/components/public/public-page-shell'
import OrderLookupPage from '@/components/sales/order-lookup-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiểm tra đơn hàng | Khanh Nguyên Forklift',
  description: 'Tra cứu tiến độ thực hiện đơn hàng xe nâng và yêu cầu báo giá của bạn.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <OrderLookupPage />
    </PublicPageShell>
  )
}
