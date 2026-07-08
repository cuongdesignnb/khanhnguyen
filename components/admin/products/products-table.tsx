'use client'

import Image from 'next/image'
import { Star, Pencil, Trash2 } from 'lucide-react'
import AdminStatusBadge from '../admin-status-badge'
import AdminPagination from '../admin-pagination'
import type { ProductAdminItem } from '@/types/admin'
import { formatCurrency } from '@/lib/format'

interface ProductsTableProps {
  products: ProductAdminItem[]
  loading: boolean
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (p: number) => void
  onEdit?: (product: ProductAdminItem) => void
  onDelete?: (id: string) => void
  onToggleVisibility?: (id: string, isVisible: boolean) => void
  onToggleFeatured?: (id: string, isFeatured: boolean) => void
}

export default function ProductsTable({
  products,
  loading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
}: ProductsTableProps) {
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[color:var(--surface)]/80">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Ảnh</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Tên sản phẩm</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Model</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">SKU</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Danh mục</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Thương hiệu</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Giá</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Nổi bật</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Hiển thị</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Ngày cập nhật</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="py-20 text-center text-[color:var(--muted)]">
                  <div className="flex justify-center">
                    <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-[color:var(--muted)]">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Image */}
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative border border-white/10 bg-black/20">
                      <Image
                        src={product.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-white text-sm">{product.name}</div>
                      <div className="text-xs text-[color:var(--muted)] line-clamp-1 max-w-[250px]">
                        {product.subtitle || 'Không có mô tả ngắn'}
                      </div>
                    </div>
                  </td>

                  {/* Model */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--silver)]">{product.model || '—'}</span>
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-4">
                    <span className="text-xs text-[color:var(--muted)] font-mono">{product.sku || '—'}</span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--muted)]">{product.category}</span>
                  </td>

                  {/* Brand */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--silver)]">{product.brand}</span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--gold)] font-semibold">
                      {product.price ? formatCurrency(product.price) : product.priceLabel}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured?.(product.id, product.isFeatured)}
                      className="p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          product.isFeatured
                            ? 'fill-[color:var(--gold)] text-[color:var(--gold)]'
                            : 'text-[color:var(--muted)]'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Visible toggle */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleVisibility?.(product.id, product.isVisible)}
                      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                        product.isVisible
                          ? 'bg-[color:var(--gold)]'
                          : 'bg-[color:var(--surface-3)] border border-white/10'
                      }`}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{ transform: product.isVisible ? 'translateX(18px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4">
                    <span className="text-xs text-[color:var(--muted)]">{product.updatedAt}</span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEdit?.(product)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete?.(product.id)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <span className="text-xs text-[color:var(--muted)]">
            Hiển thị {products.length} trong tổng số {total} sản phẩm
          </span>
          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
