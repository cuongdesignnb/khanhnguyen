'use client'

import { Search } from 'lucide-react'

interface ProductsFilterBarProps {
  params: any
  setParams: (p: any) => void
  categories: any[]
  brands: any[]
}

export default function ProductsFilterBar({
  params,
  setParams,
  categories,
  brands,
}: ProductsFilterBarProps) {
  const selectClass =
    'bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] appearance-none w-full focus:outline-none focus:border-[color:var(--gold)]/50'
  const labelClass = 'text-[10px] text-[color:var(--muted)] uppercase tracking-wider mb-1 block'

  const handleClearFilters = () => {
    setParams({
      categoryId: '',
      brandId: '',
      status: '',
      stockStatus: '',
      isFeatured: '',
      showOnHome: '',
      q: '',
      page: 1,
    })
  }

  return (
    <div className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 mb-6 space-y-4">
      {/* Row 1: Selects */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className={labelClass}>Danh mục</label>
          <select
            className={selectClass}
            value={params.categoryId || ''}
            onChange={(e) => setParams({ categoryId: e.target.value })}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Thương hiệu</label>
          <select
            className={selectClass}
            value={params.brandId || ''}
            onChange={(e) => setParams({ brandId: e.target.value })}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Nổi bật</label>
          <select
            className={selectClass}
            value={params.isFeatured || ''}
            onChange={(e) => setParams({ isFeatured: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="true">Có nổi bật</option>
            <option value="false">Không nổi bật</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Trang chủ</label>
          <select
            className={selectClass}
            value={params.showOnHome || ''}
            onChange={(e) => setParams({ showOnHome: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="true">Hiện trang chủ</option>
            <option value="false">Ẩn trang chủ</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Trạng thái</label>
          <select
            className={selectClass}
            value={params.status || ''}
            onChange={(e) => setParams({ status: e.target.value })}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đang hiển thị</option>
            <option value="HIDDEN">Đã ẩn</option>
            <option value="SOLD">Đã bán</option>
            <option value="DRAFT">Nháp</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Kho hàng</label>
          <select
            className={selectClass}
            value={params.stockStatus || ''}
            onChange={(e) => setParams({ stockStatus: e.target.value })}
          >
            <option value="">Tất cả trạng thái kho</option>
            <option value="IN_STOCK">Còn hàng</option>
            <option value="OUT_OF_STOCK">Hết hàng</option>
            <option value="CONTACT">Liên hệ</option>
            <option value="SOLD">Đã bán</option>
          </select>
        </div>
      </div>

      {/* Row 2: Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)]" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên / model / SKU..."
          value={params.q || ''}
          onChange={(e) => setParams({ q: e.target.value })}
          className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]/50"
        />
      </div>

      {/* Row 3: Actions */}
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2">
          <button
            className="text-[color:var(--danger)] bg-transparent border border-[color:var(--danger)]/20 text-xs rounded-full px-3 py-1 cursor-pointer hover:bg-[color:var(--danger)]/10 transition-colors"
            onClick={handleClearFilters}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  )
}
