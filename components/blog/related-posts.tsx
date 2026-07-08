'use client'

import BlogCard from './blog-card'
import { PublicPostCard } from '@/types/public'
import { SectionHeading } from '@/components/ui/section-heading'

interface RelatedPostsProps {
  posts: PublicPostCard[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section aria-label="Bài viết liên quan">
      <SectionHeading title="BÀI VIẾT LIÊN QUAN" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
