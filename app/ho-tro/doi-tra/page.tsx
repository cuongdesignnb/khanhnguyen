import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách đổi trả | Khanh Nguyên Forklift',
  description: 'Chính sách đổi trả xe nâng, linh kiện và phụ tùng nếu có lỗi từ nhà sản xuất.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Chính sách đổi trả" subtitle="Hỗ trợ đổi trả linh kiện khi phát sinh lỗi" />
    </PublicPageShell>
  )
}
