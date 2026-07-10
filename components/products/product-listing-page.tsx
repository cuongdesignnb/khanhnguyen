'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Filter, X, Search } from 'lucide-react'
import PageHero from '@/components/public/page-hero'
import Breadcrumb from '@/components/public/breadcrumb'
import ProductFilterSidebar from './product-filter-sidebar'
import ProductSortBar from './product-sort-bar'
import ProductGrid from './product-grid'
import ProductPagination from './product-pagination'
import ProductListEmpty from './product-list-empty'
import { ProductListResult, PublicCategory, PublicBrand, ProductListParams } from '@/types/public'

interface ProductListingPageProps {
  result: ProductListResult
  categories: PublicCategory[]
  brands: PublicBrand[]
  currentParams: ProductListParams
}

const stockStatusLabels: Record<string, string> = {
  IN_STOCK: 'Còn hàng',
  OUT_OF_STOCK: 'Hết hàng',
  CONTACT: 'Liên hệ',
  SOLD: 'Đã bán',
}

export default function ProductListingPage({
  result,
  categories,
  brands,
  currentParams,
}: ProductListingPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [searchVal, setSearchVal] = useState(currentParams.q || '')

  const updateFilters = (newParams: Partial<ProductListParams>) => {
    const updated = { ...currentParams, ...newParams }
    if (newParams.page === undefined) {
      updated.page = 1 // Reset page when filters change
    }

    const query = new URLSearchParams()
    Object.entries(updated).forEach(([key, val]) => {
      if (
        val !== undefined &&
        val !== null &&
        val !== '' &&
        !(key === 'page' && Number(val) === 1)
      ) {
        query.set(key, String(val))
      }
    })

    const qs = query.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: searchVal })
  }

  const clearAllFilters = () => {
    setSearchVal('')
    router.push(pathname)
  }

  const activeFiltersCount = Object.entries(currentParams).filter(([key, val]) => {
    if (key === 'page' || key === 'limit' || key === 'sort') return false
    return val !== undefined && val !== null && val !== ''
  }).length

  return (
    <div className="bg-[color:var(--surface)] min-h-screen text-white">
      <PageHero title="DANH SÁCH SẢN PHẨM" subtitle="Chất lượng Nhật bãi – Hoạt động bền bỉ – Bảo hành uy tín" />
      <Breadcrumb items={[{ label: 'Sản phẩm' }]} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
        {/* Mobile Search & Filter toggle */}
        <div className="flex gap-3 mb-6 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="search"
              placeholder="Tìm theo tên xe, model, SKU, thương hiệu..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]"
            />
            <Search className="absolute left-3.5 top-3 text-[color:var(--muted)]" size={16} />
          </form>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[color:var(--surface-2)] border border-white/10 rounded-lg text-sm text-[color:var(--silver)] font-semibold hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] cursor-pointer"
          >
            <Filter size={16} />
            <span>Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center bg-[color:var(--gold)] text-black font-bold text-xs rounded-full size-5">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 space-y-6 max-h-[85vh] overflow-y-auto overscroll-contain scrollbar-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h2 className="font-bold text-base text-white tracking-wide">BỘ LỌC TÌM KIẾM</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[color:var(--gold)] hover:underline font-medium cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
              <ProductFilterSidebar
                categories={categories}
                brands={brands}
                params={currentParams}
                onChange={updateFilters}
              />
            </div>
          </aside>

          {/* Product Listing Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar (Sort / Search) */}
            <div className="hidden lg:flex items-center justify-between bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-5 py-3">
              <form onSubmit={handleSearchSubmit} className="relative w-96">
                <input
                  type="search"
                  placeholder="Tìm theo tên xe, model, SKU, thương hiệu..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-[color:var(--surface)] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]"
                />
                <Search className="absolute left-3 top-2.5 text-[color:var(--muted)]" size={15} />
              </form>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[color:var(--muted)] font-medium">
                  Tìm thấy <strong className="text-white">{result.total}</strong> sản phẩm
                </span>
                <ProductSortBar sort={currentParams.sort || 'latest'} onChange={(sort) => updateFilters({ sort })} />
              </div>
            </div>

            {/* Mobile Toolbar (showing Active Filters summary only) */}
            <div className="flex lg:hidden items-center justify-between">
              <span className="text-xs text-[color:var(--muted)] font-medium">
                Tìm thấy <strong className="text-white">{result.total}</strong> sản phẩm
              </span>
              <ProductSortBar sort={currentParams.sort || 'latest'} onChange={(sort) => updateFilters({ sort })} />
            </div>

            {/* Active Filters list */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-[color:var(--muted)] font-medium">Bộ lọc đang chọn:</span>
                {currentParams.q && (
                  <FilterBadge label={`Từ khóa: ${currentParams.q}`} onRemove={() => updateFilters({ q: '' })} />
                )}
                {currentParams.category && (
                  <FilterBadge
                    label={`Danh mục: ${categories.find((c) => c.slug === currentParams.category)?.name || currentParams.category}`}
                    onRemove={() => updateFilters({ category: '' })}
                  />
                )}
                {currentParams.brand && (
                  <FilterBadge
                    label={`Thương hiệu: ${brands.find((b) => b.slug === currentParams.brand)?.name || currentParams.brand}`}
                    onRemove={() => updateFilters({ brand: '' })}
                  />
                )}
                {currentParams.fuel && (
                  <FilterBadge label={`Nhiên liệu: ${currentParams.fuel}`} onRemove={() => updateFilters({ fuel: '' })} />
                )}
                {currentParams.condition && (
                  <FilterBadge label={`Tình trạng: ${currentParams.condition === 'Bãi' ? 'Xe cũ (Nhật bãi)' : 'Mới'}`} onRemove={() => updateFilters({ condition: '' })} />
                )}
                {currentParams.capacity && (
                  <FilterBadge label={`Tải trọng: ${currentParams.capacity}`} onRemove={() => updateFilters({ capacity: '' })} />
                )}
                {currentParams.liftHeight && (
                  <FilterBadge label={`Chiều cao nâng: ${currentParams.liftHeight}`} onRemove={() => updateFilters({ liftHeight: '' })} />
                )}
                {currentParams.origin && (
                  <FilterBadge label={`Xuất xứ: ${currentParams.origin}`} onRemove={() => updateFilters({ origin: '' })} />
                )}
                {currentParams.manufactureYear && (
                  <FilterBadge label={`Năm SX: ${currentParams.manufactureYear}`} onRemove={() => updateFilters({ manufactureYear: '' })} />
                )}
                {currentParams.stockStatus && (
                  <FilterBadge label={`Trạng thái: ${stockStatusLabels[currentParams.stockStatus] || currentParams.stockStatus}`} onRemove={() => updateFilters({ stockStatus: '' })} />
                )}
                {currentParams.minPrice !== undefined && (
                  <FilterBadge label={`Giá từ: ${currentParams.minPrice.toLocaleString('vi-VN')} đ`} onRemove={() => updateFilters({ minPrice: undefined })} />
                )}
                {currentParams.maxPrice !== undefined && (
                  <FilterBadge label={`Giá đến: ${currentParams.maxPrice.toLocaleString('vi-VN')} đ`} onRemove={() => updateFilters({ maxPrice: undefined })} />
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[color:var(--gold)] hover:underline font-semibold cursor-pointer"
                >
                  Xóa hết
                </button>
              </div>
            )}

            {/* Product Grid / Empty State */}
            {result.items.length > 0 ? (
              <>
                <ProductGrid products={result.items} />
                <ProductPagination
                  currentPage={result.page}
                  totalPages={result.totalPages}
                  onChange={(page) => updateFilters({ page })}
                />
              </>
            ) : (
              <ProductListEmpty onClear={clearAllFilters} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          {/* Panel */}
          <div className="relative ml-auto flex h-full w-[88vw] max-w-[380px] flex-col bg-[color:var(--surface)] border-l border-[color:var(--line-gold)] shadow-2xl p-5 overflow-y-auto pb-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
              <h2 className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                <Filter size={16} className="text-[color:var(--gold)]" />
                <span>BỘ LỌC TÌM KIẾM</span>
                {activeFiltersCount > 0 && (
                  <span className="flex items-center justify-center bg-[color:var(--gold)] text-black font-bold text-xs rounded-full size-5">
                    {activeFiltersCount}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-[color:var(--muted)] hover:text-white cursor-pointer"
                aria-label="Đóng bộ lọc"
              >
                <X size={20} />
              </button>
            </div>
            <ProductFilterSidebar
              categories={categories}
              brands={brands}
              params={currentParams}
              onChange={updateFilters}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function FilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[color:var(--surface-3)] border border-white/10 text-xs text-[color:var(--silver)] font-medium px-2.5 py-1 rounded-full">
      <span>{label}</span>
      <button onClick={onRemove} className="text-[color:var(--muted)] hover:text-white transition cursor-pointer" aria-label="Xóa bộ lọc">
        <X size={12} />
      </button>
    </span>
  )
}
