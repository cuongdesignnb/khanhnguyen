'use client'

import { useState } from 'react'
import { adminProducts } from '@/data/admin'
import Image from 'next/image'
import { Star, Pencil, Copy, Trash2 } from 'lucide-react'
import AdminStatusBadge from '../admin-status-badge'
import type { ProductAdminItem } from '@/types/admin'

interface ProductsTableProps {
  onEdit?: (product: ProductAdminItem) => void
}

export default function ProductsTable({ onEdit }: ProductsTableProps) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(adminProducts.map((p) => [p.id, p.isVisible]))
  )
  const [featured, setFeatured] = useState<Record<string, boolean>>(
    Object.fromEntries(adminProducts.map((p) => [p.id, p.isFeatured]))
  )
  const [activePage, setActivePage] = useState(1)

  const toggleVisibility = (id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleFeatured = (id: string) => {
    setFeatured((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[color:var(--surface)]/80">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-10">
                <input type="checkbox" className="accent-[color:var(--gold)]" />
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Ảnh</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Tên sản phẩm</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Model</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">SKU</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Danh mục</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Thương hiệu</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Giá</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Nổi bật</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Hiển thị</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Ngày cập nhật</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {adminProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                {/* Checkbox */}
                <td className="py-3 px-3">
                  <input type="checkbox" className="accent-[color:var(--gold)]" />
                </td>

                {/* Image */}
                <td className="py-3 px-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="py-3 px-3">
                  <div>
                    <div className="font-medium text-white text-sm">{product.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">{product.subtitle}</div>
                  </div>
                </td>

                {/* Model */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--silver)]">{product.model}</span>
                </td>

                {/* SKU */}
                <td className="py-3 px-3">
                  <span className="text-xs text-[color:var(--muted)] font-mono">{product.sku}</span>
                </td>

                {/* Category */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--muted)]">{product.category}</span>
                </td>

                {/* Brand */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--silver)]">{product.brand}</span>
                </td>

                {/* Price */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--gold)] font-semibold">
                    {product.priceLabel}
                  </span>
                </td>

                {/* Featured */}
                <td className="py-3 px-3">
                  <Star
                    className={`w-4 h-4 cursor-pointer transition-colors ${
                      featured[product.id]
                        ? 'fill-[color:var(--gold)] text-[color:var(--gold)]'
                        : 'text-[color:var(--muted)]'
                    }`}
                    onClick={() => toggleFeatured(product.id)}
                  />
                </td>

                {/* Visible toggle */}
                <td className="py-3 px-3">
                  <button
                    onClick={() => toggleVisibility(product.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                      visibility[product.id]
                        ? 'bg-[color:var(--gold)]'
                        : 'bg-[color:var(--surface-3)]'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        visibility[product.id] ? 'translate-x-[18px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </td>

                {/* Date */}
                <td className="py-3 px-3">
                  <span className="text-xs text-[color:var(--muted)]">{product.updatedAt}</span>
                </td>

                {/* Actions */}
                <td className="py-3 px-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit?.(product)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-[color:var(--muted)]">
          Hiển thị 10 trong tổng số 128 sản phẩm
        </span>
        <div className="flex gap-1">
          {['«', '‹', 1, 2, 3, 4, '...', 13, '›', '»'].map((item, idx) => (
            <button
              key={idx}
              onClick={() => typeof item === 'number' && setActivePage(item)}
              className={`min-w-[32px] h-8 rounded-lg text-xs flex items-center justify-center cursor-pointer transition-colors ${
                item === activePage
                  ? 'bg-[color:var(--gold)] text-black font-semibold'
                  : 'bg-[color:var(--surface-2)] text-[color:var(--muted)] hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
