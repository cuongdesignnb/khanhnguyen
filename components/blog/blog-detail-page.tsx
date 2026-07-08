'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Eye } from 'lucide-react'
import Breadcrumb from '@/components/public/breadcrumb'
import BlogTableOfContents from './blog-table-of-contents'
import RelatedPosts from './related-posts'
import { PublicPostDetail, PublicPostCard } from '@/types/public'

interface BlogDetailPageProps {
  post: PublicPostDetail
  relatedPosts: PublicPostCard[]
}

export default function BlogDetailPage({ post, relatedPosts }: BlogDetailPageProps) {
  return (
    <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
      <Breadcrumb
        items={[
          { label: 'Tin tức', href: '/tin-tuc' },
          { label: post.categoryName, href: `/tin-tuc/danh-muc/${post.categorySlug}` },
          { label: post.title },
        ]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-6">
            {/* Header */}
            <header className="space-y-4">
              {/* Category */}
              <Link
                href={`/tin-tuc/danh-muc/${post.categorySlug}`}
                className="text-xs font-extrabold uppercase tracking-wider text-[color:var(--gold)] hover:underline"
              >
                {post.categoryName}
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight uppercase font-sans">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-[color:var(--muted)] border-b border-white/5 pb-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={14} />
                  <span>{post.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Eye size={14} />
                  <span>{post.viewCount} lượt xem</span>
                </span>
              </div>
            </header>

            {/* Thumbnail */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-[color:var(--surface-2)]">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover"
              />
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm sm:text-base font-bold text-[color:var(--silver)] leading-relaxed italic border-l-2 border-[color:var(--gold)] pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Content html body */}
            {post.content && (
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="text-sm sm:text-base text-[color:var(--silver)] leading-relaxed whitespace-pre-line space-y-4
                  [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:uppercase [&_h2]:tracking-wide
                  [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
                  [&_p]:leading-relaxed [&_p]:mb-4
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-4
                  [&_a]:text-[color:var(--gold)] [&_a]:hover:underline
                  [&_img]:rounded-lg [&_img]:border [&_img]:border-white/10 [&_img]:my-6 [&_img]:mx-auto"
              />
            )}
          </article>

          {/* Right Column sidebar - TOC */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-sm text-white tracking-wider mb-4 uppercase">
                MỤC LỤC BÀI VIẾT
              </h3>
              <BlogTableOfContents selector="article" />
            </div>
          </aside>
        </div>

        {/* Related Posts at bottom */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/5">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </div>
    </div>
  )
}
