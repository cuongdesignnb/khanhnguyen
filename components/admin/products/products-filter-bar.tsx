'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

const filterChips = [
  { key: 'visibility', label: 'Hiển thị: Đang hiển thị' },
  { key: 'weight', label: 'Tải trọng: Tất cả' },
  { key: 'category', label: 'Danh mục: Tất cả' },
  { key: 'brand', label: 'Thương hiệu: Tất cả' },
]

export default function ProductsFilterBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [chips, setChips] = useState(filterChips)

  const selectClass =
    'bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] appearance-none w-full focus:outline-none focus:border-[color:var(--gold)]/50'
  const labelClass = 'text-[10px] text-[color:var(--muted)] uppercase tracking-wider mb-1 block'

  return (
    <div className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 mb-6 space-y-4">
      {/* Row 1: Selects */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className={labelClass}>Danh mục</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả danh mục</option>
            <option>Xe nâng điện</option>
            <option>Xe nâng dầu</option>
            <option>Xe nâng tay</option>
            <option>Xe cẩu</option>
            <option>Bình điện</option>
            <option>Phụ tùng</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Thương hiệu</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả thương hiệu</option>
            <option>TOYOTA</option>
            <option>KOMATSU</option>
            <option>MITSUBISHI</option>
            <option>TCM</option>
            <option>NIULI</option>
            <option>NISSAN</option>
            <option>HELI</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Tải trọng</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả tải trọng</option>
            <option>1 - 2 tấn</option>
            <option>2 - 3 tấn</option>
            <option>3 - 5 tấn</option>
            <option>5 - 10 tấn</option>
            <option>Trên 10 tấn</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Nhiên liệu</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả nhiên liệu</option>
            <option>Điện</option>
            <option>Dầu Diesel</option>
            <option>Gas LPG</option>
            <option>Tay (thủ công)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Trạng thái</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả trạng thái</option>
            <option>Đang hiển thị</option>
            <option>Đã ẩn</option>
            <option>Đã bán</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Giá</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả mức giá</option>
            <option>Dưới 200 triệu</option>
            <option>200 - 400 triệu</option>
            <option>400 - 600 triệu</option>
            <option>Trên 600 triệu</option>
          </select>
        </div>
      </div>

      {/* Row 2: Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)]" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên / model / SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]/50"
        />
      </div>

      {/* Row 3: Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          className="text-[color:var(--danger)] bg-transparent border border-[color:var(--danger)]/20 text-xs rounded-full px-3 py-1 cursor-pointer hover:bg-[color:var(--danger)]/10 transition-colors"
          onClick={() => setChips(filterChips)}
        >
          Xóa bộ lọc
        </button>
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="bg-[color:var(--surface-2)] border border-white/10 text-xs text-[color:var(--muted)] rounded-full px-3 py-1 inline-flex items-center gap-1.5"
          >
            {chip.label}
            <button
              onClick={() => setChips((prev) => prev.filter((c) => c.key !== chip.key))}
              className="hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
