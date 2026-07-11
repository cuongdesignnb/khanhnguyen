import { getPostBySlug, getPostList } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import BlogDetailPage from '@/components/blog/blog-detail-page'
import JsonLd from '@/components/seo/json-ld'
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { buildPostMetadata } from '@/lib/seo/metadata'
import { getSeoConfig } from '@/lib/seo/config'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)
  if (!post) {
    return { title: 'Không tìm thấy bài viết' }
  }
  return buildPostMetadata({ title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt,
    canonicalPath: `/tin-tuc/${post.slug}`, canonicalUrl: post.canonicalUrl, ogTitle: post.ogTitle,
    ogDescription: post.ogDescription, ogImage: post.ogImage || post.thumbnail, robotsIndex: post.robotsIndex,
    robotsFollow: post.robotsFollow, publishedTime: post.publishedAtIso || undefined, modifiedTime: post.updatedAtIso })
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)
  if (!post) {
    notFound()
  }

  const recentPostsResult = await getPostList({ limit: 4 })
  const relatedPosts = recentPostsResult.items.filter((p) => p.id !== post.id).slice(0, 3)

  const seoConfig = await getSeoConfig()
  const origin = seoConfig.siteUrl
  
  const breadcrumbs = [
    { label: 'Trang chủ', url: origin },
    { label: 'Tin tức', url: `${origin}/tin-tuc` },
    { label: post.categoryName, url: `${origin}/tin-tuc/danh-muc/${post.categorySlug}` },
    { label: post.title, url: `${origin}/tin-tuc/${post.slug}` },
  ]

  return (
    <>
      {seoConfig.schemas.articleEnabled && <JsonLd data={buildArticleSchema(post, seoConfig)} />}
      {seoConfig.schemas.breadcrumbEnabled && <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />}
      <PublicPageShell>
        <BlogDetailPage post={post} relatedPosts={relatedPosts} />
      </PublicPageShell>
    </>
  )
}
