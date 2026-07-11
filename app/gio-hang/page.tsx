import PublicPageShell from '@/components/public/public-page-shell'
import QuoteCartPage from '@/components/sales/quote-cart-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giỏ hàng báo giá | Khanh Nguyên Forklift',
  description: 'Giỏ hàng xe nâng cần yêu cầu báo giá của bạn.',
  robots: { index: false, follow: false, nocache: true },
}

export default function Page() {
  return (
    <PublicPageShell>
      <QuoteCartPage />
    </PublicPageShell>
  )
}
