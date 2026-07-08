import PublicPageShell from '@/components/public/public-page-shell'
import ComingSoonPage from '@/components/public/coming-soon-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách bảo hành | Khanh Nguyên Forklift',
  description: 'Chính sách bảo hành xe nâng Nhật bãi, xe cẩu tự hành và linh kiện ắc quy.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <ComingSoonPage title="Chính sách bảo hành" subtitle="Cam kết bảo hành uy tín dài hạn" />
    </PublicPageShell>
  )
}
