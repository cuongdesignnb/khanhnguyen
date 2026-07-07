'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

const filterChips = [
  { key: 'status', label: 'Trạng thái: Chờ xác nhận' },
  { key: 'payment', label: 'Thanh toán: Đã cọc' },
  { key: 'source', label: 'Nguồn: Website' },
]

export default function OrdersFilterBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [chips, setChips] = useState(filterChips)

  const selectClass =
    'bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] appearance-none w-full focus:outline-none focus:border-[color:var(--gold)]/50'
  const labelClass = 'text-[10px] text-[color:var(--muted)] uppercase tracking-wider mb-1 block'

  return (
    <div className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 mb-6 space-y-4">
      {/* Row 1: Selects */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Trạng thái đơn</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả</option>
            <option>Chờ xác nhận</option>
            <option>Đã xác nhận</option>
            <option>Đang xử lý</option>
            <option>Đang giao</option>
            <option>Hoàn thành</option>
            <option>Đã hủy</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Thanh toán</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả</option>
            <option>Chưa thanh toán</option>
            <option>Đã cọc</option>
            <option>Đã thanh toán</option>
            <option>Đã hoàn tiền</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Nguồn đơn</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả</option>
            <option>Website</option>
            <option>Admin</option>
            <option>Điện thoại</option>
            <option>Zalo</option>
            <option>Facebook</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Phương thức</label>
          <select className={selectClass} defaultValue="">
            <option value="">Tất cả</option>
            <option>Khách tự nhận</option>
            <option>Giao hàng</option>
            <option>Giao + lắp đặt</option>
          </select>
        </div>
      </div>

      {/* Row 2: Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)]" />
        <input
          type="text"
          placeholder="Tìm theo mã đơn, khách hàng, SĐT, SKU, model..."
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
