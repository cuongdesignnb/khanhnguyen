import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tài khoản | Khanh Nguyên Forklift',
  description: 'Quản lý thông tin tài khoản mua hàng của bạn tại Khanh Nguyên Forklift.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Tài khoản khách hàng" subtitle="Quản lý thông tin cá nhân của bạn" />
    </PublicPageShell>
  )
}
