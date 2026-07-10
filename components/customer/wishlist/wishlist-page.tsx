'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/ui/product-card'
import { useSalesContext } from '@/components/sales/sales-provider'

type WishlistItem = {
  id: string
  productId: string
  createdAt: string
  product: {
    id: string
    slug: string
    badge?: string
    category: string
    categorySlug: string
    brand?: string | null
    name: string
    model: string
    image: string
    specs: { label: string; value: string }[]
    price: string | null
    priceLabel: string
  }
}

export default function WishlistPage() {
  const router = useRouter()
  const { removeFromWishlist } = useSalesContext()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadWishlist() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/customer/wishlist', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      })

      const result = await response.json().catch(() => null)

      if (response.status === 401) {
        router.replace('/dang-nhap?redirect=/tai-khoan/yeu-thich')
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || 'Không thể tải danh sách yêu thích')
      }

      setItems(Array.isArray(result?.data) ? result.data : [])
    } catch (error: any) {
      setError(error?.message || 'Không thể tải danh sách yêu thích')
    } finally {
      setLoading(false)
    }
  }

  async function removeWishlist(productId: string) {
    try {
      const response = await fetch(`/api/customer/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      })

      const result = await response.json().catch(() => null)

      if (response.status === 401) {
        router.replace('/dang-nhap?redirect=/tai-khoan/yeu-thich')
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || 'Không thể xóa sản phẩm khỏi yêu thích')
      }

      removeFromWishlist(productId)
      await loadWishlist()
    } catch (error: any) {
      alert(error?.message || 'Không thể xóa sản phẩm khỏi yêu thích')
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Sản phẩm yêu thích</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Danh sách các sản phẩm bạn đã lưu để xem lại sau.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-2)] p-6 text-sm text-[color:var(--muted)]">
          Đang tải danh sách yêu thích...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-sm font-semibold text-red-300">{error}</p>
          <button
            type="button"
            onClick={loadWishlist}
            className="mt-3 rounded-lg bg-[color:var(--gold)] px-4 py-2 text-xs font-bold text-black"
          >
            Tải lại
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-2)] p-8 text-center">
          <h2 className="text-lg font-bold text-white">
            Bạn chưa có sản phẩm yêu thích nào
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Hãy lưu lại các sản phẩm bạn quan tâm để dễ dàng xem lại và yêu cầu báo giá.
          </p>
          <a
            href="/san-pham"
            className="mt-5 inline-flex rounded-xl bg-[color:var(--gold)] px-5 py-3 text-sm font-bold text-black"
          >
            Xem sản phẩm
          </a>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="space-y-3">
              <ProductCard product={item.product} />

              <button
                type="button"
                onClick={() => removeWishlist(item.productId)}
                className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20 cursor-pointer"
              >
                Xóa khỏi yêu thích
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
