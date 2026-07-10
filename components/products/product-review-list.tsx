'use client'

import { Star } from 'lucide-react'
import { ReviewItem } from './product-reviews-section'

interface ProductReviewListProps {
  reviews: ReviewItem[]
  loading: boolean
}

export default function ProductReviewList({ reviews, loading }: ProductReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-5">
            <div className="size-10 rounded-full bg-white/5 shrink-0" />
            <div className="space-y-2.5 flex-1">
              <div className="h-3 w-1/4 bg-white/5 rounded" />
              <div className="h-3 w-1/6 bg-white/5 rounded" />
              <div className="h-10 w-full bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-black/10">
        <p className="text-xs sm:text-sm text-[color:var(--muted)]">
          Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên để lại đánh giá.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {reviews.map((review) => {
        const firstLetter = review.name ? review.name.charAt(0).toUpperCase() : 'K'
        const dateStr = new Date(review.createdAt).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })

        return (
          <div key={review.id} className="flex gap-4 items-start border-b border-white/5 pb-5 last:border-b-0 last:pb-0">
            {/* Avatar Circle */}
            <div className="size-10 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20 flex items-center justify-center shrink-0 font-extrabold text-sm select-none">
              {firstLetter}
            </div>

            {/* Content info */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                  {review.name}
                </span>
                <span className="text-[10px] text-[color:var(--muted)] font-medium">
                  {dateStr}
                </span>
              </div>

              {/* Stars display */}
              <div className="flex items-center gap-0.5 text-[color:var(--gold)]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    fill={star <= review.rating ? 'currentColor' : 'transparent'}
                    className="stroke-[1.5]"
                  />
                ))}
              </div>

              {/* Message */}
              <p className="text-xs sm:text-sm text-[color:var(--silver)] leading-relaxed whitespace-pre-wrap">
                {review.content}
              </p>

              {/* Attached review images */}
              {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {review.images.map((img, imgIdx) => (
                    <a
                      key={imgIdx}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative size-16 sm:size-20 rounded-lg overflow-hidden border border-white/5 bg-neutral-900 group hover:border-[color:var(--gold)]/30 transition-colors"
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="object-cover size-full group-hover:scale-105 transition-transform"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
