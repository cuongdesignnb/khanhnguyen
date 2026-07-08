'use client'

import { PublicCategory, PublicBrand, ProductListParams } from '@/types/public'
import clsx from 'clsx'

interface ProductFilterSidebarProps {
  categories: PublicCategory[]
  brands: PublicBrand[]
  params: ProductListParams
  onChange: (newParams: Partial<ProductListParams>) => void
}

const FUEL_TYPES = [
  { label: 'Xe nâng điện', value: 'Điện' },
  { label: 'Xe nâng dầu', value: 'Dầu' },
  { label: 'Xe nâng xăng/gas', value: 'Xăng/Gas' },
  { label: 'Xe nâng tay', value: 'Cơ/Tay' },
]

const CONDITIONS = [
  { label: 'Xe cũ (Nhật bãi)', value: 'Bãi' },
  { label: 'Xe mới 100%', value: 'Mới' },
]

const CAPACITIES = [
  { label: 'Dưới 1.5 tấn', value: '1.0 tấn' },
  { label: '1.5 tấn', value: '1.5 tấn' },
  { label: '2.0 tấn', value: '2.0 tấn' },
  { label: '2.5 tấn', value: '2.5 tấn' },
  { label: '3.0 tấn', value: '3.0 tấn' },
  { label: 'Trên 3.0 tấn', value: '5.0 tấn' },
]

const LIFT_HEIGHTS = [
  { label: '3.0 mét', value: '3.0 m' },
  { label: '4.0 mét', value: '4.0 m' },
  { label: '4.5 mét', value: '4.5 m' },
  { label: '6.0 mét', value: '6.0 m' },
]

export default function ProductFilterSidebar({
  categories,
  brands,
  params,
  onChange,
}: ProductFilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* ── Categories Accordion ── */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Danh mục</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onChange({ category: '' })}
            className={clsx(
              'text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors font-medium',
              !params.category
                ? 'bg-[color:var(--gold)] text-black font-bold'
                : 'text-[color:var(--silver)] hover:bg-white/5 hover:text-white'
            )}
          >
            Tất cả danh mục
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onChange({ category: c.slug })}
              className={clsx(
                'text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors font-medium',
                params.category === c.slug
                  ? 'bg-[color:var(--gold)] text-black font-bold'
                  : 'text-[color:var(--silver)] hover:bg-white/5 hover:text-white'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Brands Accordion ── */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Thương hiệu</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => onChange({ brand: params.brand === b.slug ? '' : b.slug })}
              className={clsx(
                'px-3 py-1.5 text-xs font-semibold rounded-lg border transition',
                params.brand === b.slug
                  ? 'border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)] font-bold'
                  : 'border-white/10 bg-[color:var(--surface-3)] text-[color:var(--silver)] hover:border-white/20'
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Fuel Types ── */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Loại nhiên liệu</h3>
        <div className="flex flex-col gap-2">
          {FUEL_TYPES.map((f) => (
            <label key={f.value} className="flex items-center gap-2.5 text-sm text-[color:var(--silver)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={params.fuel === f.value}
                onChange={() => onChange({ fuel: params.fuel === f.value ? '' : f.value })}
                className="accent-[color:var(--gold)] h-4 w-4 rounded border-white/10 bg-[color:var(--surface-2)]"
              />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Conditions ── */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Tình trạng xe</h3>
        <div className="flex flex-col gap-2">
          {CONDITIONS.map((c) => (
            <label key={c.value} className="flex items-center gap-2.5 text-sm text-[color:var(--silver)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={params.condition === c.value}
                onChange={() => onChange({ condition: params.condition === c.value ? '' : c.value })}
                className="accent-[color:var(--gold)] h-4 w-4 rounded border-white/10 bg-[color:var(--surface-2)]"
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Capacity ── */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Tải trọng nâng</h3>
        <div className="flex flex-wrap gap-2">
          {CAPACITIES.map((c) => (
            <button
              key={c.value}
              onClick={() => onChange({ capacity: params.capacity === c.value ? '' : c.value })}
              className={clsx(
                'px-3 py-1.5 text-xs font-semibold rounded-lg border transition',
                params.capacity === c.value
                  ? 'border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)] font-bold'
                  : 'border-white/10 bg-[color:var(--surface-3)] text-[color:var(--silver)] hover:border-white/20'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lift Height ── */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Chiều cao nâng</h3>
        <div className="flex flex-wrap gap-2">
          {LIFT_HEIGHTS.map((h) => (
            <button
              key={h.value}
              onClick={() => onChange({ liftHeight: params.liftHeight === h.value ? '' : h.value })}
              className={clsx(
                'px-3 py-1.5 text-xs font-semibold rounded-lg border transition',
                params.liftHeight === h.value
                  ? 'border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)] font-bold'
                  : 'border-white/10 bg-[color:var(--surface-3)] text-[color:var(--silver)] hover:border-white/20'
              )}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
