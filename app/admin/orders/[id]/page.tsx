'use client'

import { useState, useEffect } from 'react'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import AdminButton from '@/components/admin/admin-button'
import OrderTimeline from '@/components/admin/orders/order-timeline'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Pencil, Printer, Mail, RefreshCw, Save, X } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { mapOrderToAdminItem } from '@/lib/admin-mappers'
import { useAdminDetail } from '@/hooks/use-admin-detail'
import { toast } from '@/lib/toast'
import { formatCurrency, formatDate } from '@/lib/format'
import { adminOrders } from '@/data/admin'

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

const cardClass = 'border border-white/10 rounded-2xl bg-[color:var(--surface)]/80 p-5'
const sectionTitle = 'text-xs text-[color:var(--muted)] uppercase tracking-wider font-semibold mb-3'
const infoRow = 'flex justify-between items-start py-2 border-b border-white/5 last:border-0'
const labelCell = 'text-xs text-[color:var(--muted)]'
const valueCell = 'text-sm text-white text-right font-medium'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [showStatusSelect, setShowStatusSelect] = useState(false)
  const [statusVal, setStatusVal] = useState('PENDING')

  // Resolve params promise safely
  useEffect(() => {
    params.then((p) => {
      setOrderId(p.id)
    }).catch(console.error)
  }, [params])

  const {
    data: order,
    loading,
    error,
    reload,
  } = useAdminDetail({
    id: orderId,
    fetcher: async (id) => {
      const res = await adminApi.getOrderById(id)
      return mapOrderToAdminItem(res)
    },
    fallbackData: mapOrderToAdminItem(adminOrders[0]),
  })

  // Pre-fill status state when order loads
  useEffect(() => {
    if (order) {
      // Find original uppercase status
      setStatusVal(order.orderStatus.toUpperCase())
    }
  }, [order])

  const handleUpdateStatus = async () => {
    if (!orderId) return
    setUpdating(true)
    try {
      await adminApi.updateOrder(orderId, { orderStatus: statusVal })
      toast.success('Cập nhật trạng thái đơn hàng thành công')
      setShowStatusSelect(false)
      reload()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi cập nhật trạng thái')
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmail = () => {
    if (order?.email) {
      window.open(`mailto:${order.email}?subject=Đơn hàng ${order.code}`)
    } else {
      toast.error('Khách hàng này không đăng ký email')
    }
  }

  if (loading) {
    return (
      <div className="py-40 flex justify-center">
        <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="py-20 text-center">
        <p className="text-rose-400 font-semibold mb-4">Không thể tải thông tin đơn hàng</p>
        <Link href="/admin/orders" className="text-[color:var(--gold)] underline text-sm">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    )
  }

  if (!order) return null

  // Map timeline events
  const timelineEvents = (order as any).timeline || []

  return (
    <>
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--gold)] mb-4 transition-colors w-fit"
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
          {showStatusSelect ? (
            <div className="flex gap-1.5 items-center bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1">
              <select
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value)}
                className="bg-transparent text-xs text-white border-0 outline-none pr-6 cursor-pointer"
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="PROCESSING">Đang xử lý</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
              <AdminButton size="sm" onClick={handleUpdateStatus} loading={updating}>
                <Save className="w-3 h-3" />
              </AdminButton>
              <button
                onClick={() => setShowStatusSelect(false)}
                className="text-[color:var(--muted)] hover:text-white p-1 hover:bg-white/5 rounded-lg text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <AdminButton
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => setShowStatusSelect(true)}
            >
              Cập nhật trạng thái
            </AdminButton>
          )}
          <AdminButton
            variant="secondary"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            In đơn
          </AdminButton>
          <AdminButton
            variant="secondary"
            size="sm"
            icon={<Mail className="w-3.5 h-3.5" />}
            onClick={handleSendEmail}
          >
            Gửi email
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
                  className="flex gap-3 p-3 bg-[color:var(--surface-2)] border border-white/5 rounded-xl"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0 bg-black/20">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{item.productName}</div>
                    <div className="text-xs text-[color:var(--muted)] mt-0.5">
                      Model: {item.model || '—'} · SKU: {item.sku || '—'}
                    </div>
                    <div className="text-xs text-[color:var(--muted)] mt-0.5">
                      SL: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </div>
                  </div>
                  <div className="text-sm text-[color:var(--gold)] font-semibold flex-shrink-0 self-center">
                    {formatCurrency(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--muted)]">Tạm tính</span>
                <span className="text-white">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--muted)]">Phí vận chuyển</span>
                <span className="text-emerald-400">Miễn phí</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-white/10 pt-2">
                <span className="text-white">Tổng tiền</span>
                <span className="text-[color:var(--gold)]">{formatCurrency(order.totalAmount)}</span>
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
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Đã thanh toán</span>
                <span className="text-sm text-emerald-400 font-semibold">
                  {formatCurrency(order.depositAmount)}
                </span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Còn lại phải thu</span>
                <span className={valueCell}>{formatCurrency(order.totalAmount - order.depositAmount)}</span>
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
            <OrderTimeline timeline={timelineEvents} />
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
                  <span className={`${valueCell} max-w-[160px] truncate`}>{order.company}</span>
                </div>
              )}
              <div className={infoRow}>
                <span className={labelCell}>Điện thoại</span>
                <span className={valueCell}>{order.phone}</span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Email</span>
                <span className={`${valueCell} max-w-[160px] break-all`}>{order.email || '—'}</span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Địa chỉ</span>
                <span className={`${valueCell} max-w-[160px] truncate`}>{order.address || '—'}</span>
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
                <span className={`${valueCell} max-w-[160px] truncate`}>{order.address || '—'}</span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Nguồn đơn</span>
                <span className={valueCell}>
                  {sourceLabelMap[order.source] || order.source}
                </span>
              </div>
              <div className={infoRow}>
                <span className={labelCell}>Dự kiến giao</span>
                <span className={valueCell}>
                  {order.expectedDeliveryAt ? formatDate(order.expectedDeliveryAt) : 'Chưa xếp lịch'}
                </span>
              </div>
            </div>
          </div>

          {/* Internal notes card */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Ghi chú</h3>
            {order.note && (
              <div className="bg-[color:var(--surface-2)] rounded-xl p-3 mb-2 border border-white/5">
                <div className="text-[10px] text-[color:var(--muted)] mb-1">Ghi chú khách hàng</div>
                <div className="text-xs text-white leading-relaxed">{order.note}</div>
              </div>
            )}
            <div className="bg-[color:var(--surface-2)] rounded-xl p-3 border border-white/5">
              <div className="text-[10px] text-[color:var(--muted)] mb-1">Ghi chú nội bộ</div>
              <div className="text-xs text-white leading-relaxed">{order.internalNote || 'Không có ghi chú nội bộ.'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
