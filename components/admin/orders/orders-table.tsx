'use client'

import AdminStatusBadge from '../admin-status-badge'
import AdminPagination from '../admin-pagination'
import { Eye, Pencil, Printer, Phone } from 'lucide-react'
import type { OrderAdminItem } from '@/types/admin'
import { formatCurrency, getStatusLabel } from '@/lib/format'

interface OrdersTableProps {
  orders: OrderAdminItem[]
  loading: boolean
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (p: number) => void
  onView?: (order: OrderAdminItem) => void
  onEdit?: (order: OrderAdminItem) => void
}

const sourceLabel: Record<string, string> = {
  website: 'Website',
  admin: 'Admin',
  phone: 'Điện thoại',
  zalo: 'Zalo',
  facebook: 'Facebook',
}

export default function OrdersTable({
  orders,
  loading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onView,
  onEdit,
}: OrdersTableProps) {
  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[color:var(--surface)]/80">
        <table className="w-full min-w-[1200px] text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Mã đơn</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Khách hàng</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">SĐT</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Sản phẩm</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Tổng tiền</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Thanh toán</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Trạng thái đơn</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Nguồn</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Phụ trách</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Ngày tạo</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="py-20 text-center">
                  <div className="flex justify-center">
                    <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-[color:var(--muted)]">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => onView?.(order)}
                >
                  {/* Code */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <span
                      onClick={() => onView?.(order)}
                      className="text-sm text-[color:var(--gold)] font-mono font-semibold hover:underline cursor-pointer"
                    >
                      {order.code}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-sm text-white font-medium">{order.customerName}</div>
                      {order.company && (
                        <div className="text-xs text-[color:var(--muted)]">{order.company}</div>
                      )}
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--muted)]">{order.phone}</span>
                  </td>

                  {/* Products */}
                  <td className="py-3 px-4">
                    <div className="text-sm text-[color:var(--silver)] line-clamp-1 max-w-[200px]">
                      {order.items.map((item) => item.productName).join(', ')}
                    </div>
                    <div className="text-xs text-[color:var(--muted)]">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--gold)] font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </td>

                  {/* Payment status */}
                  <td className="py-3 px-4">
                    <AdminStatusBadge status={order.paymentStatus} />
                  </td>

                  {/* Order status */}
                  <td className="py-3 px-4">
                    <AdminStatusBadge status={order.orderStatus} />
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--muted)]">
                      {sourceLabel[order.source] || order.source}
                    </span>
                  </td>

                  {/* Assigned to */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[color:var(--muted)]">{order.assignedTo}</span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4">
                    <span className="text-xs text-[color:var(--muted)]">{order.createdAt}</span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onView?.(order)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(order)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePhoneClick(order.phone)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
                      >
                        <Phone className="w-4 h-4" />
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
            Hiển thị {orders.length} trong tổng số {total} đơn hàng
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
