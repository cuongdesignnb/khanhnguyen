import { getPostBySlug, getPostList } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import BlogDetailPage from '@/components/blog/blog-detail-page'
import JsonLd from '@/components/seo/json-ld'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
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
  return {
    title: `${post.title} | Khanh Nguyên Forklift`,
    description: post.seoDescription || post.excerpt || `${post.title} - Chuyên mục tin tức kinh nghiệm xe nâng Khanh Nguyên.`,
    alternates: {
      canonical: `/tin-tuc/${post.slug}`,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)
  if (!post) {
    notFound()
  }

  const recentPostsResult = await getPostList({ limit: 4 })
  const relatedPosts = recentPostsResult.items.filter((p) => p.id !== post.id).slice(0, 3)

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://khanhnguyenforklift.vn'
  
  const breadcrumbs = [
    { label: 'Trang chủ', url: origin },
    { label: 'Tin tức', url: `${origin}/tin-tuc` },
    { label: post.categoryName, url: `${origin}/tin-tuc/danh-muc/${post.categorySlug}` },
    { label: post.title, url: `${origin}/tin-tuc/${post.slug}` },
  ]

  return (
    <>
      <JsonLd schema={articleSchema(post, origin)} />
      <JsonLd schema={breadcrumbSchema(breadcrumbs)} />
      <PublicPageShell>
        <BlogDetailPage post={post} relatedPosts={relatedPosts} />
      </PublicPageShell>
    </>
  )
}
