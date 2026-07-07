'use client'

import { dashboardFeaturedProducts } from '@/data/admin'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, Pencil, MoreVertical } from 'lucide-react'

export default function FeaturedProductsTable() {
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
              <th className="text-left py-2.5 px-2 font-medium">#</th>
              <th className="text-left py-2.5 px-2 font-medium">Hình ảnh</th>
              <th className="text-left py-2.5 px-2 font-medium">Model</th>
              <th className="text-left py-2.5 px-2 font-medium">Danh mục</th>
              <th className="text-left py-2.5 px-2 font-medium">Trạng thái</th>
              <th className="text-left py-2.5 px-2 font-medium">Ngày cập nhật</th>
              <th className="text-left py-2.5 px-2 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {dashboardFeaturedProducts.map((product) => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-2 text-[color:var(--muted)]">{product.id}</td>
                <td className="py-3 px-2">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[color:var(--surface-2)]">
                    <Image
                      src={product.image}
                      alt={product.model}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </td>
                <td className="py-3 px-2 font-medium text-[color:var(--text)]">{product.model}</td>
                <td className="py-3 px-2 text-[color:var(--muted)]">{product.category}</td>
                <td className="py-3 px-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400">
                    Hiển thị
                  </span>
                </td>
                <td className="py-3 px-2 text-[color:var(--muted)] text-xs">{product.date}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
