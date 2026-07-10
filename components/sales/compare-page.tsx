'use client'

import { useState, useEffect } from 'react'
import { useSalesContext } from './sales-provider'
import { GitCompare, Loader2, Trash2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PublicProductDetail } from '@/types/public'
import { toast } from './toast-notification'
import AddToCartButton from './add-to-cart-button'

export default function ComparePage() {
  const { compare, removeFromCompare, clearCompare } = useSalesContext()
  const [products, setProducts] = useState<PublicProductDetail[]>(null as any)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      if (compare.length === 0) {
        setProducts([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch('/api/products/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: compare }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setProducts(data.data.details || [])
          }
        }
      } catch (err) {
        console.error('Failed to fetch compare products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [compare])

  const handleRemove = (id: string, name: string) => {
    removeFromCompare(id)
    toast(`Đã xóa "${name}" khỏi so sánh`, 'info')
  }

  const handleClearAll = () => {
    clearCompare()
    toast('Đã xóa tất cả sản phẩm so sánh', 'info')
  }

  const specRows = [
    { label: 'Model', valueFn: (p: PublicProductDetail) => p.model || 'Chưa cập nhật' },
    { label: 'Danh mục', valueFn: (p: PublicProductDetail) => p.categoryName },
    { label: 'Thương hiệu', valueFn: (p: PublicProductDetail) => p.brandName || 'Nhật Bản' },
    { label: 'Tải trọng', valueFn: (p: PublicProductDetail) => p.capacity || 'Chưa cập nhật' },
    { label: 'Chiều cao nâng', valueFn: (p: PublicProductDetail) => p.liftHeight || 'Chưa cập nhật' },
    { label: 'Động cơ / Nhiên liệu', valueFn: (p: PublicProductDetail) => p.fuelType || 'Chưa cập nhật' },
    { label: 'Năm sản xuất', valueFn: (p: PublicProductDetail) => p.manufactureYear ? p.manufactureYear.toString() : 'Chưa cập nhật' },
    { label: 'Tình trạng', valueFn: (p: PublicProductDetail) => p.condition || 'Nhật bãi cũ' },
    { label: 'Xuất xứ', valueFn: (p: PublicProductDetail) => p.origin || 'Nhật Bản' },
  ]

  return (
    <div className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
            So sánh sản phẩm
          </h1>
          <p className="text-xs sm:text-sm text-[color:var(--muted)] mt-1">
            So sánh chi tiết thông số kỹ thuật xe nâng (tối đa 4 sản phẩm)
          </p>
        </div>
        {compare.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            <Trash2 size={14} />
            <span>Xóa tất cả</span>
          </button>
        )}
      </div>

      {loading && !products ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-[color:var(--gold)]" size={32} />
          <p className="text-sm text-[color:var(--muted)]">Đang tải thông tin so sánh...</p>
        </div>
      ) : compare.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[color:var(--surface-2)] border border-white/5 rounded-2xl">
          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <GitCompare size={32} className="text-[color:var(--muted)]" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase">Chưa có sản phẩm so sánh</h2>
          <p className="text-sm text-[color:var(--muted)] max-w-sm mt-2 mb-6">
            Chọn nút so sánh ở các trang sản phẩm hoặc thẻ sản phẩm để hiển thị so sánh tại đây.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[700px] table-fixed">
              <thead>
                <tr>
                  {/* First cell for labels */}
                  <th className="p-5 w-[200px] bg-black/20 text-xs font-black uppercase text-[color:var(--muted)] tracking-wider border-b border-r border-white/5">
                    Thông số kỹ thuật
                  </th>
                  {/* Product cells */}
                  {products?.map((p) => (
                    <th
                      key={p.id}
                      className="p-5 bg-black/10 border-b border-r border-white/5 last:border-r-0 align-top relative"
                    >
                      <button
                        onClick={() => handleRemove(p.id, p.name)}
                        className="absolute top-3 right-3 text-white/40 hover:text-red-400 p-1 transition-colors"
                        title="Xóa khỏi so sánh"
                        aria-label={`Xóa ${p.name} khỏi so sánh`}
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex flex-col gap-3 pt-3">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-black/40">
                          <Image
                            src={p.thumbnail || '/images/placeholder.jpg'}
                            alt={p.name}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug uppercase">
                            {p.name}
                          </h3>
                          <p className="text-sm font-black text-[color:var(--gold)]">
                            {p.priceLabel}
                          </p>
                        </div>
                        <AddToCartButton
                          productId={p.id}
                          productName={p.name}
                          variant="solid"
                          className="w-full py-2 text-xs font-extrabold mt-1"
                        />
                      </div>
                    </th>
                  ))}
                  {/* Empty headers to fill up to 4 columns */}
                  {Array.from({ length: Math.max(0, 4 - (products?.length || 0)) }).map((_, i) => (
                    <th key={`empty-h-${i}`} className="p-5 border-b border-r border-white/5 last:border-r-0 bg-black/5">
                      <div className="flex flex-col items-center justify-center py-20 text-[color:var(--muted)]">
                        <GitCompare size={24} className="stroke-1 opacity-40 mb-2" />
                        <span className="text-xs">Còn trống</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}
                  >
                    <td className="p-4 bg-black/20 font-bold text-xs sm:text-sm text-[color:var(--silver)] border-b border-r border-white/5">
                      {row.label}
                    </td>
                    {products?.map((p) => (
                      <td
                        key={p.id}
                        className="p-4 text-xs sm:text-sm text-white border-b border-r border-white/5 last:border-r-0"
                      >
                        {row.valueFn(p)}
                      </td>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - (products?.length || 0)) }).map((_, i) => (
                      <td key={`empty-td-${i}`} className="p-4 border-b border-r border-white/5 last:border-r-0 bg-black/5" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
