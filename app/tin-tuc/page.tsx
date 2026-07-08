import { getPostList, getVisibleCategories } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import BlogListPage from '@/components/blog/blog-list-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức & Kinh nghiệm xe nâng | Khanh Nguyên Forklift',
  description: 'Chuyên mục chia sẻ kinh nghiệm vận hành xe nâng an toàn, hướng dẫn bảo dưỡng ắc quy bình điện, tư vấn lựa chọn mua xe nâng Nhật bãi tốt nhất.',
  alternates: { canonical: '/tin-tuc' },
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined

  const [result, categories] = await Promise.all([
    getPostList({ q, page, limit: 9 }),
    getVisibleCategories(), // We can filter blog categories, but let's query base categories or handle custom folders
  ])

  return (
    <PublicPageShell>
      <BlogListPage
        result={result}
        currentParams={{ q, page }}
      />
    </PublicPageShell>
  )
}
