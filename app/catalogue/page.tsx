import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tải Catalogue | Khanh Nguyên Forklift',
  description: 'Tải tài liệu catalogue xe nâng Nhật bãi Toyota, Komatsu, Mitsubishi, TCM... Đầy đủ thông tin thông số kỹ thuật chi tiết.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Tải Catalogue" subtitle="Tải tài liệu kỹ thuật xe nâng chính hãng" />
    </PublicPageShell>
  )
}
