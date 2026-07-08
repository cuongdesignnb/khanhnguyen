import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | Khanh Nguyên Forklift',
  description: 'Chính sách bảo mật thông tin khách hàng tại Khanh Nguyên Forklift.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Chính sách bảo mật" subtitle="Bảo mật tuyệt đối thông tin khách hàng" />
    </PublicPageShell>
  )
}
