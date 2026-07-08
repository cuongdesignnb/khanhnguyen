'use client'

import { ProductListParams } from '@/types/public'

interface ProductSortBarProps {
  sort: string
  onChange: (sort: ProductListParams['sort']) => void
}

const SORT_OPTIONS = [
  { label: 'Mới cập nhật', value: 'latest' },
  { label: 'Sản phẩm nổi bật', value: 'featured' },
  { label: 'Giá: Thấp đến Cao', value: 'price-asc' },
  { label: 'Giá: Cao đến Thấp', value: 'price-desc' },
  { label: 'Sản phẩm bán chạy', value: 'best-seller' },
]

export default function ProductSortBar({ sort, onChange }: ProductSortBarProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="product-sort" className="text-xs text-[color:var(--muted)] font-medium whitespace-nowrap">
        Sắp xếp theo:
      </label>
      <select
        id="product-sort"
        value={sort}
        onChange={(e) => onChange(e.target.value as any)}
        className="bg-[color:var(--surface)] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[color:var(--silver)] focus:outline-none focus:border-[color:var(--gold)] cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[color:var(--surface-2)]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
