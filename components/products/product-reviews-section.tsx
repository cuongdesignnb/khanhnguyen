'use client'

import { useState, useEffect } from 'react'
import ProductReviewForm from './product-review-form'
import ProductReviewList from './product-review-list'

interface ProductReviewsSectionProps {
  productId: string
  productSlug: string
}

export interface ReviewItem {
  id: string
  name: string
  rating: number
  content: string
  createdAt: string
  images: Array<{
    url: string
    alt: string
  }>
}

export default function ProductReviewsSection({ productId, productSlug }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch reviews from public API
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        const response = await fetch(`/api/public/products/${productSlug}/reviews`)
        const json = await response.json()
        if (json.success) {
          setReviews(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [productSlug, refreshTrigger])

  const handleReviewSuccess = () => {
    // Increment trigger to refresh list if needed
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <section className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
      <h3 className="font-extrabold uppercase text-base sm:text-lg text-white tracking-wider pb-3 border-b border-white/5 relative">
        ĐÁNH GIÁ SẢN PHẨM
        <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[color:var(--gold)]" />
      </h3>
      <p className="text-xs sm:text-sm text-[color:var(--muted)] -mt-2">
        Khách hàng đã sử dụng sản phẩm có thể để lại đánh giá thực tế.
      </p>

      {/* Grid: desktop 2 columns (Reviews list on left, form on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 items-start">
        {/* Left: Review List */}
        <div className="lg:col-span-7">
          <ProductReviewList reviews={reviews} loading={loading} />
        </div>

        {/* Right: Review Form */}
        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
          <ProductReviewForm productId={productId} onSuccess={handleReviewSuccess} />
        </div>
      </div>
    </section>
  )
}
