'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { PublicPostCard } from '@/types/public'

interface BlogCardProps {
  post: PublicPostCard
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group bg-[color:var(--surface-2)] border border-white/10 rounded-xl overflow-hidden hover:border-[color:var(--line-gold)] transition-all flex flex-col h-full">
      {/* Image */}
      <div className="aspect-[16/10] relative overflow-hidden bg-black/20">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Metadata */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--muted)] font-medium">
              <Calendar size={12} />
              <span>{post.date}</span>
            </span>
            <Link
              href={`/tin-tuc/danh-muc/${post.categorySlug}`}
              className="text-[10px] font-extrabold uppercase tracking-wider text-[color:var(--gold)] hover:underline"
            >
              {post.category}
            </Link>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-white group-hover:text-[color:var(--gold)] transition-colors line-clamp-2 leading-snug">
            <Link href={`/tin-tuc/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-[color:var(--muted)] line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <Link
          href={`/tin-tuc/${post.slug}`}
          className="text-xs font-bold text-[color:var(--gold)] hover:underline flex items-center gap-1 mt-3"
        >
          <span>Xem chi tiết</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  )
}
