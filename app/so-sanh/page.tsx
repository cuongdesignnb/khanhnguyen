import PublicPageShell from '@/components/public/public-page-shell'
import ComparePage from '@/components/sales/compare-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'So sánh xe nâng | Khanh Nguyên Forklift',
  description: 'So sánh chi tiết cấu hình, thông số tải trọng và động cơ các dòng xe nâng Nhật bãi.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComparePage />
    </PublicPageShell>
  )
}
