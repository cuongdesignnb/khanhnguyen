'use client'

import { useState, useEffect } from 'react'
import { dashboardFeaturedProducts } from '@/data/admin'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, Pencil } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { mapProductToAdminItem } from '@/lib/admin-mappers'
import type { ProductAdminItem } from '@/types/admin'

export default function FeaturedProductsTable() {
  const [products, setProducts] = useState<ProductAdminItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .getProducts({ page: 1, limit: 5 })
      .then((res) => {
        if (res.items) {
          setProducts(res.items.map(mapProductToAdminItem))
        } else {
          setProducts(dashboardFeaturedProducts.map(mapProductToAdminItem as any))
        }
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách sản phẩm nổi bật:', err)
        setProducts(dashboardFeaturedProducts.map(mapProductToAdminItem as any))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[color:var(--text)]">Sản phẩm nổi bật</h3>
        <Link href="/admin/products" className="text-xs text-[color:var(--gold)] hover:underline">
          Xem tất cả →
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-[color:var(--muted)] uppercase tracking-wider border-b border-white/10">
              <th className="text-left py-2.5 px-2 font-medium">Model</th>
              <th className="text-left py-2.5 px-2 font-medium">Hình ảnh</th>
              <th className="text-left py-2.5 px-2 font-medium">Thương hiệu</th>
              <th className="text-left py-2.5 px-2 font-medium">Danh mục</th>
              <th className="text-left py-2.5 px-2 font-medium">Trạng thái</th>
              <th className="text-left py-2.5 px-2 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-[color:var(--muted)]">
                  Đang tải sản phẩm...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-[color:var(--muted)]">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2 font-medium text-[color:var(--text)] text-xs">
                    {product.name}
                  </td>
                  <td className="py-3 px-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[color:var(--surface-2)] border border-white/10">
                      <Image
                        src={product.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-[color:var(--muted)] text-xs font-semibold">{product.brand}</td>
                  <td className="py-3 px-2 text-[color:var(--muted)] text-xs">{product.category}</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400">
                      Hiển thị
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/products`} className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
