'use client'

import { useState, useEffect } from 'react'
import { useSalesContext } from './sales-provider'
import { ProductCard } from '../ui/product-card'
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { PublicProductCard } from '@/types/public'

export default function WishlistPage() {
  const { wishlist } = useSalesContext()
  const [products, setProducts] = useState<PublicProductCard[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      if (wishlist.length === 0) {
        setProducts([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch('/api/products/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: wishlist }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setProducts(data.data.cards || [])
          }
        }
      } catch (err) {
        console.error('Failed to fetch wishlist products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [wishlist])

  return (
    <div className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
          Sản phẩm yêu thích
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--muted)] mt-1">
          Danh sách xe nâng và phụ kiện bạn đang quan tâm
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-[color:var(--gold)]" size={32} />
          <p className="text-sm text-[color:var(--muted)]">Đang tải danh sách yêu thích...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[color:var(--surface-2)] border border-white/5 rounded-2xl">
          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Heart size={32} className="text-[color:var(--muted)]" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase">Danh sách yêu thích trống</h2>
          <p className="text-sm text-[color:var(--muted)] max-w-sm mt-2 mb-6">
            Bạn chưa lưu sản phẩm nào. Hãy bấm nút trái tim tại các sản phẩm để lưu lại tại đây.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
