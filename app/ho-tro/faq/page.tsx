import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp | Khanh Nguyên Forklift',
  description: 'Giải đáp các thắc mắc của khách hàng về xe nâng Nhật bãi, ắc quy xe nâng, chế độ bảo dưỡng định kỳ.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Câu hỏi thường gặp" subtitle="Giải đáp thắc mắc của khách hàng" />
    </PublicPageShell>
  )
}
