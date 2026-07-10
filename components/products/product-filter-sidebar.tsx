'use client'

import { useState, useEffect } from 'react'
import { PublicCategory, PublicBrand, ProductListParams } from '@/types/public'
import clsx from 'clsx'

interface ProductFilterSidebarProps {
  categories: PublicCategory[]
  brands: PublicBrand[]
  params: ProductListParams
  onChange: (newParams: Partial<ProductListParams>) => void
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
      <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
        {title}
      </h3>
      {children}
    </div>
  )
}

const selectClass =
  'w-full rounded-xl border border-white/10 bg-[color:var(--surface)] px-3 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)] cursor-pointer'

const stockStatusLabels: Record<string, string> = {
  IN_STOCK: 'Còn hàng',
  OUT_OF_STOCK: 'Hết hàng',
  CONTACT: 'Liên hệ',
  SOLD: 'Đã bán',
}

export default function ProductFilterSidebar({
  categories: initialCategories,
  brands: initialBrands,
  params,
  onChange,
}: ProductFilterSidebarProps) {
  const [options, setOptions] = useState<any>(null)

  useEffect(() => {
    const cat = params.category || ''
    fetch(`/api/public/product-filter-options${cat ? `?category=${cat}` : ''}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setOptions(res.data)
        }
      })
      .catch(console.error)
  }, [params.category])

  const categoriesList = options?.categories || initialCategories
  const brandsList = options?.brands || initialBrands
  const capacitiesList = options?.capacities || []
  const liftHeightsList = options?.liftHeights || []
  const fuelTypesList = options?.fuelTypes || ['Điện', 'Dầu', 'Xăng/Gas', 'Cơ/Tay']
  const conditionsList = options?.conditions || ['Bãi', 'Mới']
  const originsList = options?.origins || []
  const manufactureYearsList = options?.manufactureYears || []
  const stockStatusesList = options?.stockStatuses || []

  return (
    <div className="space-y-5">
      {/* ── Group: Danh mục ── */}
      <FilterGroup title="Danh mục">
        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-1">
          <button
            onClick={() => onChange({ category: '' })}
            className={clsx(
              'text-left text-xs py-2 px-3 rounded-lg transition-colors font-medium cursor-pointer',
              !params.category
                ? 'bg-[color:var(--gold)] text-black font-bold'
                : 'text-[color:var(--silver)] hover:bg-white/5 hover:text-white'
            )}
          >
            Tất cả danh mục
          </button>
          {categoriesList.map((c: any) => (
            <button
              key={c.id}
              onClick={() => onChange({ category: c.slug })}
              className={clsx(
                'text-left text-xs py-2 px-3 rounded-lg transition-colors font-medium cursor-pointer',
                params.category === c.slug
                  ? 'bg-[color:var(--gold)] text-black font-bold'
                  : 'text-[color:var(--silver)] hover:bg-white/5 hover:text-white'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* ── Group: Thương hiệu ── */}
      <FilterGroup title="Thương hiệu">
        <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-1">
          {brandsList.map((b: any) => (
            <button
              key={b.id}
              onClick={() => onChange({ brand: params.brand === b.slug ? '' : b.slug })}
              className={clsx(
                'px-2.5 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer',
                params.brand === b.slug
                  ? 'border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)] font-bold'
                  : 'border-white/10 bg-[color:var(--surface-3)] text-[color:var(--silver)] hover:border-white/20'
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* ── Group: Thông số kỹ thuật ── */}
      <FilterGroup title="Thông số kỹ thuật">
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Tải trọng nâng</label>
            <select
              value={params.capacity || ''}
              onChange={(e) => onChange({ capacity: e.target.value })}
              className={selectClass}
            >
              <option value="">Tất cả tải trọng</option>
              {capacitiesList.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Chiều cao nâng</label>
            <select
              value={params.liftHeight || ''}
              onChange={(e) => onChange({ liftHeight: e.target.value })}
              className={selectClass}
            >
              <option value="">Tất cả chiều cao</option>
              {liftHeightsList.map((lh: string) => (
                <option key={lh} value={lh}>
                  {lh}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Nhiên liệu</label>
            <select
              value={params.fuel || ''}
              onChange={(e) => onChange({ fuel: e.target.value })}
              className={selectClass}
            >
              <option value="">Tất cả nhiên liệu</option>
              {fuelTypesList.map((ft: string) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterGroup>

      {/* ── Group: Tình trạng & Xuất xứ ── */}
      <FilterGroup title="Tình trạng & Xuất xứ">
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Tình trạng</label>
            <select
              value={params.condition || ''}
              onChange={(e) => onChange({ condition: e.target.value })}
              className={selectClass}
            >
              <option value="">Tất cả tình trạng</option>
              {conditionsList.map((cond: string) => (
                <option key={cond} value={cond}>
                  {cond === 'Bãi' ? 'Xe cũ (Nhật bãi)' : cond === 'Mới' ? 'Xe mới 100%' : cond}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Xuất xứ</label>
            <select
              value={params.origin || ''}
              onChange={(e) => onChange({ origin: e.target.value })}
              className={selectClass}
            >
              <option value="">Tất cả xuất xứ</option>
              {originsList.map((orig: string) => (
                <option key={orig} value={orig}>
                  {orig}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Năm sản xuất</label>
            <select
              value={params.manufactureYear || ''}
              onChange={(e) => onChange({ manufactureYear: e.target.value })}
              className={selectClass}
            >
              <option value="">Tất cả năm SX</option>
              {manufactureYearsList.map((yr: string) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Trạng thái hàng</label>
            <select
              value={params.stockStatus || ''}
              onChange={(e) => onChange({ stockStatus: e.target.value })}
              className={selectClass}
            >
              <option value="">Tất cả trạng thái</option>
              {stockStatusesList.map((st: string) => (
                <option key={st} value={st}>
                  {stockStatusLabels[st] || st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterGroup>

      {/* ── Group: Khoảng giá ── */}
      <FilterGroup title="Khoảng giá">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Giá từ (VNĐ)</label>
            <input
              type="number"
              placeholder="Min"
              value={params.minPrice || ''}
              onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full rounded-xl border border-white/10 bg-[color:var(--surface)] px-3 py-2 text-xs text-white outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[color:var(--muted)] mb-1 block uppercase font-bold">Đến (VNĐ)</label>
            <input
              type="number"
              placeholder="Max"
              value={params.maxPrice || ''}
              onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full rounded-xl border border-white/10 bg-[color:var(--surface)] px-3 py-2 text-xs text-white outline-none focus:border-[color:var(--gold)]"
            />
          </div>
        </div>
      </FilterGroup>
    </div>
  )
}
