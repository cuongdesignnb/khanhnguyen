'use client'

import { adminOrders } from '@/data/admin'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import AdminButton from '@/components/admin/admin-button'
import OrderTimeline from '@/components/admin/orders/order-timeline'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Pencil, Printer, Mail, RefreshCw } from 'lucide-react'

const order = adminOrders[0]

const sourceLabelMap: Record<string, string> = {
  website: 'Website',
  admin: 'Admin',
  phone: 'Điện thoại',
  zalo: 'Zalo',
  facebook: 'Facebook',
}

const deliveryLabelMap: Record<string, string> = {
  pickup: 'Khách tự nhận',
  delivery: 'Giao hàng',
  installation: 'Giao + lắp đặt',
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ'
}

const cardClass = 'border border-white/10 rounded-2xl bg-[color:var(--surface)]/80 p-5'
const sectionTitle = 'text-xs text-[color:var(--muted)] uppercase tracking-wider font-medium mb-3'
const infoRow = 'flex justify-between items-start py-2 border-b border-white/5 last:border-0'
const labelCell = 'text-xs text-[color:var(--muted)]'
const valueCell = 'text-sm text-white text-right'

export default function OrderDetailPage() {
  return (
    <>
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--gold)] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách đơn hàng
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold font-mono text-[color:var(--gold)]">{order.code}</h1>
          <AdminStatusBadge status={order.orderStatus} />
          <AdminStatusBadge status={order.paymentStatus} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton variant="secondary" size="sm" icon={<Pencil className="w-3.5 h-3.5" />}>
            Sửa
          </AdminButton>
          <AdminButton variant="secondary" size="sm" icon={<Printer className="w-3.5 h-3.5" />}>
            In đơn
          </AdminButton>
          <AdminButton variant="secondary" size="sm" icon={<Mail className="w-3.5 h-3.5" />}>
            Gửi email
          </AdminButton>
          <AdminButton variant="primary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Cập nhật trạng thái
          </AdminButton>
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products card */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Sản phẩm</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-[color:var(--surface-2)] rounded-xl"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium">{item.productName}</div>
                    <div className="text-xs text-[color:var(--muted)] mt-0.5">
                      Model: {item.model} · SKU: {item.sku}
                    </div>
                    <div className="text-xs text-[color:var(--muted)] mt-0.5">
                      SL: {item.quantity} × {formatAmount(item.unitPrice)}
                    </div>
                  </div>
                  <div className="text-sm text-[color:var(--gold)] font-semibold flex-shrink-0 self-center">
                    {formatAmount(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--muted)]">Tạm tính</span>
                <span className="text-white">{formatAmount(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--muted)]">Giảm giá</span>
                <span className="text-white">0đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--muted)]">Phí vận chuyển</span>
                <span className="text-emerald-400">Miễn phí</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-white/10 pt-2">
                <span className="text-white">Tổng tiền</span>
                <span className="text-[color:var(--gold)]">{formatAmount(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment card */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Thanh toán</h3>
            <div className="space-y-0">
              <div className={infoRow}>
                <span className={labelCell}>Tổng tiền</span>
                <span className="text-sm text-[color:var(--gold)] font-semibold">
                  {formatAmount(order.totalAmount)}
                </span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Đã thanh toán</span>
                <span className="text-sm text-emerald-400 font-semibold">
                  {formatAmount(order.depositAmount)}
                </span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Còn lại</span>
                <span className={valueCell}>{formatAmount(order.remainingAmount)}</span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Trạng thái</span>
                <AdminStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Timeline card */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Lịch sử đơn hàng</h3>
            <OrderTimeline />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer card */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Khách hàng</h3>
            <div className="space-y-0">
              <div className={infoRow}>
                <span className={labelCell}>Tên</span>
                <span className={valueCell}>{order.customerName}</span>
              </div>
              {order.company && (
                <div className={infoRow}>
                  <span className={labelCell}>Công ty</span>
                  <span className={`${valueCell} max-w-[160px]`}>{order.company}</span>
                </div>
              )}
              <div className={infoRow}>
                <span className={labelCell}>Điện thoại</span>
                <span className={valueCell}>{order.phone}</span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Email</span>
                <span className={`${valueCell} max-w-[160px] break-all`}>{order.email}</span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Địa chỉ</span>
                <span className={`${valueCell} max-w-[160px]`}>{order.address}</span>
              </div>
            </div>
          </div>

          {/* Shipping card */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Vận chuyển</h3>
            <div className="space-y-0">
              <div className={infoRow}>
                <span className={labelCell}>Phương thức</span>
                <span className={valueCell}>
                  {deliveryLabelMap[order.deliveryMethod] || order.deliveryMethod}
                </span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Địa chỉ giao</span>
                <span className={`${valueCell} max-w-[160px]`}>{order.address}</span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Nguồn đơn</span>
                <span className={valueCell}>
                  {sourceLabelMap[order.source] || order.source}
                </span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Dự kiến giao</span>
                <span className={valueCell}>23/05/2025</span>
              </div>
            </div>
          </div>

          {/* Internal notes card */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Ghi chú nội bộ</h3>
            {order.note && (
              <div className="bg-[color:var(--surface-2)] rounded-xl p-3 mb-2">
                <div className="text-[10px] text-[color:var(--muted)] mb-1">Ghi chú khách hàng</div>
                <div className="text-sm text-white">{order.note}</div>
              </div>
            )}
            {order.internalNote && (
              <div className="bg-[color:var(--surface-2)] rounded-xl p-3">
                <div className="text-[10px] text-[color:var(--muted)] mb-1">Ghi chú nội bộ</div>
                <div className="text-sm text-white">{order.internalNote}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
