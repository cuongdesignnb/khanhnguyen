import { getPostsByCategorySlug, getPostCategoryBySlug } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import BlogListPage from '@/components/blog/blog-list-page'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = await getPostCategoryBySlug(resolvedParams.slug)
  if (!category) {
    return { title: 'Không tìm thấy danh mục' }
  }
  return {
    title: `Tin tức ${category.name} | Khanh Nguyên Forklift`,
    description: category.seoDescription || category.description || `Các bài viết chuyên mục ${category.name} tại Khanh Nguyên Forklift.`,
    alternates: {
      canonical: `/tin-tuc/danh-muc/${category.slug}`,
    },
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const category = await getPostCategoryBySlug(resolvedParams.slug)
  if (!category) {
    notFound()
  }

  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined

  const result = await getPostsByCategorySlug(resolvedParams.slug, { q, page, limit: 9 })

  return (
    <PublicPageShell>
      <BlogListPage
        result={result}
        categoryName={category.name}
        categorySlug={category.slug}
        currentParams={{ q, page }}
      />
    </PublicPageShell>
  )
}
