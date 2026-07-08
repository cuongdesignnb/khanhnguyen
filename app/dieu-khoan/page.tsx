import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | Khanh Nguyên Forklift',
  description: 'Các điều khoản sử dụng website khanhnguyenforklift.vn.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Điều khoản sử dụng" subtitle="Các điều khoản quy định chung khi sử dụng website" />
    </PublicPageShell>
  )
}
