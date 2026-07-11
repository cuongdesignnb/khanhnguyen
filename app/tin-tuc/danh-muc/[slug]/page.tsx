import { getPostsByCategorySlug, getPostCategoryBySlug } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import BlogListPage from '@/components/blog/blog-list-page'
import type { Metadata } from 'next'
import JsonLd from '@/components/seo/json-ld'
import { buildPostCategoryMetadata } from '@/lib/seo/metadata'
import { getSeoConfig } from '@/lib/seo/config'
import { buildWebPageSchema, buildItemListSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = await getPostCategoryBySlug(resolvedParams.slug)
  if (!category) {
    return { title: 'Không tìm thấy danh mục' }
  }
  const query = await searchParams
  const page = typeof query.page === 'string' ? Math.max(1, Number(query.page) || 1) : 1
  const searching = typeof query.q === 'string' && query.q.length > 0
  const canonicalPath = `/tin-tuc/danh-muc/${category.slug}${page > 1 ? `?page=${page}` : ''}`
  return buildPostCategoryMetadata({ title: category.seoTitle || `Tin tức ${category.name}`, description: category.seoDescription || category.description || `Các bài viết chuyên mục ${category.name}.`, canonicalPath, canonicalUrl: category.canonicalUrl, ogTitle: category.ogTitle, ogDescription: category.ogDescription, robotsIndex: searching ? false : category.robotsIndex, robotsFollow: category.robotsFollow })
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
  const config = await getSeoConfig()
  const url = `${config.siteUrl}/tin-tuc/danh-muc/${category.slug}${page > 1 ? `?page=${page}` : ''}`
  const items = (result.items || []).map((post: any) => ({ name: post.title, url: `${config.siteUrl}/tin-tuc/${post.slug}`, image: post.image }))
  const schemas = [buildWebPageSchema({ name: category.name, description: category.seoDescription || category.description, url, siteUrl: config.siteUrl, type: 'CollectionPage' }), buildItemListSchema(items), buildBreadcrumbSchema([{ label: 'Trang chủ', url: config.siteUrl }, { label: 'Tin tức', url: `${config.siteUrl}/tin-tuc` }, { label: category.name, url: `${config.siteUrl}/tin-tuc/danh-muc/${category.slug}` }])]

  return (
    <PublicPageShell>
      <JsonLd data={schemas} />
      <BlogListPage
        result={result}
        categoryName={category.name}
        categorySlug={category.slug}
        currentParams={{ q, page }}
      />
    </PublicPageShell>
  )
}
