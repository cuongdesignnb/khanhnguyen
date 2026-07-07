'use client'

import { useState } from 'react'
import { adminOrders } from '@/data/admin'
import AdminStatusBadge from '../admin-status-badge'
import { Eye, Pencil, Printer, Phone, MoreVertical } from 'lucide-react'
import type { OrderAdminItem } from '@/types/admin'

interface OrdersTableProps {
  onView?: (order: OrderAdminItem) => void
}

const sourceLabel: Record<string, string> = {
  website: 'Website',
  admin: 'Admin',
  phone: 'Điện thoại',
  zalo: 'Zalo',
  facebook: 'Facebook',
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ'
}

export default function OrdersTable({ onView }: OrdersTableProps) {
  const [activePage, setActivePage] = useState(1)

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[color:var(--surface)]/80">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-10">
                <input type="checkbox" className="accent-[color:var(--gold)]" />
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Mã đơn</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Khách hàng</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">SĐT</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Sản phẩm</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Tổng tiền</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Thanh toán</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Trạng thái đơn</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Nguồn</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Phụ trách</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Ngày tạo</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {adminOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                {/* Checkbox */}
                <td className="py-3 px-3">
                  <input type="checkbox" className="accent-[color:var(--gold)]" />
                </td>

                {/* Code */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--gold)] font-mono font-semibold">
                    {order.code}
                  </span>
                </td>

                {/* Customer */}
                <td className="py-3 px-3">
                  <div>
                    <div className="text-sm text-white font-medium">{order.customerName}</div>
                    {order.company && (
                      <div className="text-xs text-[color:var(--muted)]">{order.company}</div>
                    )}
                  </div>
                </td>

                {/* Phone */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--muted)]">{order.phone}</span>
                </td>

                {/* Products */}
                <td className="py-3 px-3">
                  <div className="text-sm text-[color:var(--silver)]">
                    {order.items.map((item) => item.productName).join(', ')}
                  </div>
                  <div className="text-xs text-[color:var(--muted)]">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--gold)] font-semibold">
                    {formatAmount(order.totalAmount)}
                  </span>
                </td>

                {/* Payment status */}
                <td className="py-3 px-3">
                  <AdminStatusBadge status={order.paymentStatus} />
                </td>

                {/* Order status */}
                <td className="py-3 px-3">
                  <AdminStatusBadge status={order.orderStatus} />
                </td>

                {/* Source */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--muted)]">
                    {sourceLabel[order.source] || order.source}
                  </span>
                </td>

                {/* Assigned to */}
                <td className="py-3 px-3">
                  <span className="text-sm text-[color:var(--muted)]">{order.assignedTo}</span>
                </td>

                {/* Date */}
                <td className="py-3 px-3">
                  <span className="text-xs text-[color:var(--muted)]">{order.createdAt}</span>
                </td>

                {/* Actions */}
                <td className="py-3 px-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onView?.(order)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors">
                      <MoreVertical className="w-4 h-4" />
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
          Hiển thị 5 trong tổng số 48 đơn hàng
        </span>
        <div className="flex gap-1">
          {['«', '‹', 1, 2, 3, 4, '...', 10, '›', '»'].map((item, idx) => (
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
