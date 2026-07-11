import { getPostList, getVisibleCategories } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import BlogListPage from '@/components/blog/blog-list-page'
import type { Metadata } from 'next'
import JsonLd from '@/components/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { paginatedCanonical } from '@/lib/seo/canonical'
import { buildBreadcrumbSchema, buildItemListSchema, buildWebPageSchema } from '@/lib/seo/schemas'
import { getSeoConfig } from '@/lib/seo/config'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const page = typeof params.page === 'string' ? Number(params.page) : 1
  return buildPageMetadata({ title: 'Tin tức & Kinh nghiệm xe nâng', description: 'Kinh nghiệm vận hành, bảo dưỡng và lựa chọn xe nâng.',
    canonicalPath: paginatedCanonical('/tin-tuc', page), robotsIndex: !params.q, robotsFollow: true })
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined

  const [result, categories] = await Promise.all([
    getPostList({ q, page, limit: 9 }),
    getVisibleCategories(), // We can filter blog categories, but let's query base categories or handle custom folders
  ])
  const seoConfig = await getSeoConfig()
  const canonical = `${seoConfig.siteUrl}${paginatedCanonical('/tin-tuc', page)}`

  return (
    <><JsonLd data={[
      buildWebPageSchema({ name: 'Tin tức xe nâng', url: canonical, siteUrl: seoConfig.siteUrl, type: 'CollectionPage' }),
      buildItemListSchema(result.items.map((item) => ({ name: item.title, url: `${seoConfig.siteUrl}/tin-tuc/${item.slug}`, image: item.image }))),
      buildBreadcrumbSchema([{ label: 'Trang chủ', url: seoConfig.siteUrl }, { label: 'Tin tức', url: `${seoConfig.siteUrl}/tin-tuc` }]),
    ]} /><PublicPageShell>
      <BlogListPage
        result={result}
        currentParams={{ q, page }}
      />
    </PublicPageShell></>
  )
}
