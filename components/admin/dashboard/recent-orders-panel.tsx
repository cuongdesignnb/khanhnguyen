'use client'

import { adminOrders } from '@/data/admin'
import Link from 'next/link'
import AdminStatusBadge from '../admin-status-badge'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
}

export default function RecentOrdersPanel() {
  const recentOrders = adminOrders.slice(0, 4)

  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[color:var(--text)]">Đơn hàng gần đây</h3>
        <Link href="/admin/orders" className="text-xs text-[color:var(--gold)] hover:underline">
          Xem tất cả →
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-[color:var(--muted)] uppercase tracking-wider border-b border-white/10">
              <th className="text-left py-2.5 px-2 font-medium">Mã đơn</th>
              <th className="text-left py-2.5 px-2 font-medium">Khách hàng</th>
              <th className="text-right py-2.5 px-2 font-medium">Tổng tiền</th>
              <th className="text-left py-2.5 px-2 font-medium">Thanh toán</th>
              <th className="text-left py-2.5 px-2 font-medium">Trạng thái</th>
              <th className="text-left py-2.5 px-2 font-medium">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-2">
                  <span className="font-mono text-xs text-[color:var(--gold)]">{order.code}</span>
                </td>
                <td className="py-3 px-2 text-[color:var(--text)] text-xs">{order.customerName}</td>
                <td className="py-3 px-2 text-right">
                  <span className="text-xs font-medium text-[color:var(--gold)]">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <AdminStatusBadge status={order.paymentStatus} />
                </td>
                <td className="py-3 px-2">
                  <AdminStatusBadge status={order.orderStatus} />
                </td>
                <td className="py-3 px-2 text-[color:var(--muted)] text-xs">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
