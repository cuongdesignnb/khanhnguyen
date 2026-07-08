import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích | Khanh Nguyên Forklift',
  description: 'Danh sách các sản phẩm xe nâng bạn đã quan tâm và lưu lại.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Sản phẩm yêu thích" subtitle="Danh sách xe nâng bạn quan tâm" />
    </PublicPageShell>
  )
}
