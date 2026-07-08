'use client'

import { Search } from 'lucide-react'

interface OrdersFilterBarProps {
  params: any
  setParams: (p: any) => void
}

export default function OrdersFilterBar({ params, setParams }: OrdersFilterBarProps) {
  const selectClass =
    'bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] appearance-none w-full focus:outline-none focus:border-[color:var(--gold)]/50'
  const labelClass = 'text-[10px] text-[color:var(--muted)] uppercase tracking-wider mb-1 block'

  const handleClearFilters = () => {
    setParams({
      orderStatus: '',
      paymentStatus: '',
      source: '',
      deliveryMethod: '',
      q: '',
      page: 1,
    })
  }

  return (
    <div className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 mb-6 space-y-4">
      {/* Row 1: Selects */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Trạng thái đơn</label>
          <select
            className={selectClass}
            value={params.orderStatus || ''}
            onChange={(e) => setParams({ orderStatus: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPING">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Thanh toán</label>
          <select
            className={selectClass}
            value={params.paymentStatus || ''}
            onChange={(e) => setParams({ paymentStatus: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="UNPAID">Chưa thanh toán</option>
            <option value="PARTIAL">Đã cọc</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Nguồn đơn</label>
          <select
            className={selectClass}
            value={params.source || ''}
            onChange={(e) => setParams({ source: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="WEBSITE">Website</option>
            <option value="ADMIN">Admin</option>
            <option value="PHONE">Điện thoại</option>
            <option value="ZALO">Zalo</option>
            <option value="FACEBOOK">Facebook</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Phương thức nhận hàng</label>
          <select
            className={selectClass}
            value={params.deliveryMethod || ''}
            onChange={(e) => setParams({ deliveryMethod: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="PICKUP">Khách tự nhận</option>
            <option value="DELIVERY">Giao hàng</option>
            <option value="INSTALLATION">Giao + lắp đặt</option>
          </select>
        </div>
      </div>

      {/* Row 2: Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)]" />
        <input
          type="text"
          placeholder="Tìm theo mã đơn, tên khách hàng, SĐT..."
          value={params.q || ''}
          onChange={(e) => setParams({ q: e.target.value })}
          className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]/50"
        />
      </div>

      {/* Row 3: Actions */}
      <div className="flex gap-2 items-center justify-between">
        <button
          className="text-[color:var(--danger)] bg-transparent border border-[color:var(--danger)]/20 text-xs rounded-full px-3 py-1 cursor-pointer hover:bg-[color:var(--danger)]/10 transition-colors animate-fade-in"
          onClick={handleClearFilters}
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  )
}
