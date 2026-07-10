'use client'

import { useState, useEffect } from 'react'
import { useSalesContext } from '@/components/sales/sales-provider'
import { GitCompare, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { PublicProductDetail } from '@/types/public'
import { toast } from '@/components/sales/toast-notification'
import AddToCartButton from '@/components/sales/add-to-cart-button'

export default function AccountComparePage() {
  const { compare, removeFromCompare, clearCompare } = useSalesContext()
  const [products, setProducts] = useState<PublicProductDetail[]>([])
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
    { label: 'Thương hiệu', valueFn: (p: PublicProductDetail) => p.brandName || 'Komatsu/Toyota' },
    { label: 'Tải trọng', valueFn: (p: PublicProductDetail) => p.capacity || 'Chưa cập nhật' },
    { label: 'Chiều cao nâng', valueFn: (p: PublicProductDetail) => p.liftHeight || 'Chưa cập nhật' },
    { label: 'Nhiên liệu', valueFn: (p: PublicProductDetail) => p.fuelType || 'Chưa cập nhật' },
    { label: 'Năm SX', valueFn: (p: PublicProductDetail) => p.manufactureYear ? p.manufactureYear.toString() : 'Chưa cập nhật' },
    { label: 'Tình trạng', valueFn: (p: PublicProductDetail) => p.condition || 'Nhật bãi cũ' },
    { label: 'Xuất xứ', valueFn: (p: PublicProductDetail) => p.origin || 'Nhật Bản' },
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <span className="text-xs font-black tracking-widest text-[color:var(--gold)] uppercase">BẢNG SO SÁNH</span>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-white">SO SÁNH SẢN PHẨM</h1>
        </div>
        {compare.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>XÓA HẾT</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="animate-spin text-[color:var(--gold)]" size={32} />
          <p className="text-sm text-[color:var(--muted)]">Đang tải bảng so sánh...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-[color:var(--surface-3)] border border-white/5 rounded-2xl">
          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <GitCompare size={32} className="text-[color:var(--muted)]" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase">Bảng so sánh trống</h2>
          <p className="text-sm text-[color:var(--muted)] max-w-sm mt-2 mb-6">
            Chọn tối đa 4 sản phẩm để so sánh thông số kỹ thuật chi tiết của chúng.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center bg-[color:var(--gold)] hover:bg-[#e6c260] text-black font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition"
          >
            Thêm sản phẩm so sánh
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[color:var(--surface-3)]">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 font-bold text-[color:var(--muted)] uppercase w-[150px] shrink-0">Thông số</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 min-w-[200px] align-top">
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-black/20">
                        <img
                          src={p.images?.[0] || '/images/placeholder.jpg'}
                          alt={p.name}
                          className="object-cover w-full h-full"
                        />
                        <button
                          onClick={() => handleRemove(p.id, p.name)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-[color:var(--muted)] hover:text-red-400 transition cursor-pointer"
                          aria-label="Xóa khỏi bảng so sánh"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white line-clamp-2 min-h-[40px]">
                          <Link href={`/san-pham/${p.slug}`} className="hover:text-[color:var(--gold)] transition">
                            {p.name}
                          </Link>
                        </h4>
                        <div className="text-[color:var(--gold)] font-black mt-1">
                          {p.price ? Number(p.price).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}
                        </div>
                      </div>
                      <AddToCartButton productId={p.id} productName={p.name} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 font-extrabold text-white bg-black/5">{row.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-[color:var(--silver)] font-medium">
                      {row.valueFn(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
