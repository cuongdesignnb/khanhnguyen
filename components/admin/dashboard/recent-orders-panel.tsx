'use client'

import { useState, useEffect } from 'react'
import { adminOrders } from '@/data/admin'
import Link from 'next/link'
import AdminStatusBadge from '../admin-status-badge'
import { adminApi } from '@/lib/admin-api'
import { mapOrderToAdminItem } from '@/lib/admin-mappers'
import type { OrderAdminItem } from '@/types/admin'
import { formatCurrency } from '@/lib/format'

export default function RecentOrdersPanel() {
  const [orders, setOrders] = useState<OrderAdminItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .getOrders({ page: 1, limit: 4 })
      .then((res) => {
        if (res.items) {
          setOrders(res.items.map(mapOrderToAdminItem))
        } else {
          setOrders(adminOrders.slice(0, 4))
        }
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách đơn hàng gần đây:', err)
        setOrders(adminOrders.slice(0, 4))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-[color:var(--muted)]">
                  Đang tải đơn hàng...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-[color:var(--muted)]">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2">
                    <span className="font-mono text-xs text-[color:var(--gold)] font-semibold">{order.code}</span>
                  </td>
                  <td className="py-3 px-2 text-[color:var(--text)] text-xs font-medium">{order.customerName}</td>
                  <td className="py-3 px-2 text-right font-medium">
                    <span className="text-xs text-[color:var(--gold)]">
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
