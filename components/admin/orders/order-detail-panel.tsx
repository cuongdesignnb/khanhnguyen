'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Save, RefreshCw } from 'lucide-react'
import AdminButton from '../admin-button'
import AdminStatusBadge from '../admin-status-badge'
import OrderTimeline from './order-timeline'
import Image from 'next/image'
import type { OrderAdminItem } from '@/types/admin'
import { adminApi } from '@/lib/admin-api'
import { mapOrderToAdminItem } from '@/lib/admin-mappers'
import { toast } from '@/lib/toast'
import { formatCurrency } from '@/lib/format'

interface OrderDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  order: OrderAdminItem | null
  onSaved: () => void
}

const tabs = ['Thông tin đơn', 'Sản phẩm', 'Thanh toán', 'Vận chuyển', 'Lịch sử']

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

const selectClass =
  'bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50'

const infoRowClass = 'flex justify-between items-start py-2 border-b border-white/5'
const labelCellClass = 'text-xs text-[color:var(--muted)]'
const valueCellClass = 'text-sm text-white text-right font-medium'

export default function OrderDetailPanel({
  isOpen,
  onClose,
  order: partialOrder,
  onSaved,
}: OrderDetailPanelProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState<OrderAdminItem | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<any[]>([])

  // Edit states
  const [orderStatus, setOrderStatus] = useState<any>('PENDING')
  const [paymentStatus, setPaymentStatus] = useState<any>('UNPAID')
  const [depositAmount, setDepositAmount] = useState<number>(0)
  const [internalNote, setInternalNote] = useState('')

  // Load detailed order info from API (includes payments and timeline)
  useEffect(() => {
    if (isOpen && partialOrder?.id) {
      setLoading(true)
      adminApi
        .getOrderById(partialOrder.id)
        .then((res) => {
          const mapped = mapOrderToAdminItem(res)
          setOrder(mapped)
          setOrderStatus(res.orderStatus)
          setPaymentStatus(res.paymentStatus)
          setDepositAmount(res.depositAmount ? Number(res.depositAmount) : 0)
          setInternalNote(res.internalNote || '')

          // Map db timeline to UI timeline format
          if (res.timeline) {
            setTimelineEvents(
              res.timeline.map((t: any) => {
                const dt = new Date(t.createdAt)
                return {
                  date: dt.toLocaleDateString('vi-VN'),
                  time: dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  description: t.description,
                  type: t.type.toLowerCase(),
                }
              })
            )
          } else {
            setTimelineEvents([])
          }
        })
        .catch((err) => {
          console.error('Lỗi lấy chi tiết đơn hàng:', err)
          toast.error('Không thể tải chi tiết đơn hàng')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setOrder(null)
      setTimelineEvents([])
    }
  }, [isOpen, partialOrder])

  if (!partialOrder) return null

  const handleSaveChanges = async () => {
    if (!order) return
    setSaving(true)
    try {
      await adminApi.updateOrder(order.id, {
        orderStatus,
        paymentStatus,
        depositAmount,
        internalNote,
      })
      toast.success('Cập nhật đơn hàng thành công')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi cập nhật đơn hàng')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[color:var(--surface)] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Chi tiết đơn hàng</h2>
                <span className="text-sm text-[color:var(--gold)] font-mono">{partialOrder.code}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto bg-black/20">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-3 text-sm cursor-pointer font-medium transition-colors whitespace-nowrap ${
                    activeTab === idx
                      ? 'text-[color:var(--gold)] border-b-2 border-[color:var(--gold)]'
                      : 'text-[color:var(--muted)] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : order ? (
                <>
                  {/* Tab 0: Thông tin đơn */}
                  {activeTab === 0 && (
                    <>
                      {/* Order info */}
                      <div className="space-y-0">
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Mã đơn</span>
                          <span className="text-sm text-[color:var(--gold)] font-mono font-semibold">
                            {order.code}
                          </span>
                        </div>
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Trạng thái đơn</span>
                          <select
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                            className={selectClass}
                          >
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="PROCESSING">Đang xử lý</option>
                            <option value="SHIPPING">Đang giao</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select>
                        </div>
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Thanh toán</span>
                          <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            className={selectClass}
                          >
                            <option value="UNPAID">Chưa thanh toán</option>
                            <option value="PARTIAL">Đã cọc</option>
                            <option value="PAID">Đã thanh toán</option>
                            <option value="REFUNDED">Đã hoàn tiền</option>
                          </select>
                        </div>
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Nguồn</span>
                          <span className={valueCellClass}>
                            {sourceLabelMap[order.source] || order.source}
                          </span>
                        </div>
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Phương thức giao</span>
                          <span className={valueCellClass}>
                            {deliveryLabelMap[order.deliveryMethod] || order.deliveryMethod}
                          </span>
                        </div>
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Ngày tạo</span>
                          <span className={valueCellClass}>{order.createdAt}</span>
                        </div>
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Cập nhật</span>
                          <span className={valueCellClass}>{order.updatedAt}</span>
                        </div>
                        <div className={infoRowClass}>
                          <span className={labelCellClass}>Phụ trách</span>
                          <span className={valueCellClass}>{order.assignedTo}</span>
                        </div>
                      </div>

                      {/* Customer info */}
                      <div className="mt-4 border-t border-white/5 pt-4">
                        <h3 className="text-xs text-[color:var(--muted)] uppercase tracking-wider mb-3 font-semibold">
                          Thông tin khách hàng
                        </h3>
                        <div className="space-y-0">
                          <div className={infoRowClass}>
                            <span className={labelCellClass}>Khách hàng</span>
                            <span className={valueCellClass}>{order.customerName}</span>
                          </div>
                          {order.company && (
                            <div className={infoRowClass}>
                              <span className={labelCellClass}>Công ty</span>
                              <span className={valueCellClass}>{order.company}</span>
                            </div>
                          )}
                          <div className={infoRowClass}>
                            <span className={labelCellClass}>Điện thoại</span>
                            <span className={valueCellClass}>{order.phone}</span>
                          </div>
                          <div className={infoRowClass}>
                            <span className={labelCellClass}>Email</span>
                            <span className={valueCellClass}>{order.email || '—'}</span>
                          </div>
                          <div className={infoRowClass}>
                            <span className={labelCellClass}>Địa chỉ</span>
                            <span className={`${valueCellClass} max-w-[200px] truncate`}>{order.address || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
                        <h3 className="text-xs text-[color:var(--muted)] uppercase tracking-wider font-semibold">
                          Ghi chú
                        </h3>
                        {order.note && (
                          <div className="bg-[color:var(--surface-2)] rounded-xl p-3">
                            <div className="text-[10px] text-[color:var(--muted)] mb-1">Ghi chú khách hàng</div>
                            <div className="text-xs text-white">{order.note}</div>
                          </div>
                        )}
                        <div>
                          <label className="text-[10px] text-[color:var(--muted)] uppercase mb-1 block">Ghi chú nội bộ</label>
                          <textarea
                            value={internalNote}
                            onChange={(e) => setInternalNote(e.target.value)}
                            placeholder="Ghi chú theo dõi đơn hàng..."
                            className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 h-20 resize-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Tab 1: Sản phẩm */}
                  {activeTab === 1 && (
                    <>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-3 bg-[color:var(--surface-2)] rounded-xl border border-white/5"
                          >
                            <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0 bg-black/20">
                              <Image
                                src={item.image || '/images/placeholder.jpg'}
                                alt={item.productName}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white font-medium truncate">{item.productName}</div>
                              <div className="text-[10px] text-[color:var(--muted)] mt-0.5">
                                Model: {item.model || '—'} · SKU: {item.sku || '—'}
                              </div>
                              <div className="text-xs text-[color:var(--muted)] mt-1">
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
                      <div className="border-t border-white/10 pt-4 space-y-2 mt-4">
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
                    </>
                  )}

                  {/* Tab 2: Thanh toán */}
                  {activeTab === 2 && (
                    <div className="space-y-4">
                      <div className="bg-[color:var(--surface-2)] rounded-xl p-4 space-y-3 border border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[color:var(--muted)]">Tổng tiền đơn hàng</span>
                          <span className="text-base text-[color:var(--gold)] font-bold">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[color:var(--muted)]">Đã đặt cọc / Thanh toán</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(Number(e.target.value))}
                              className="w-28 bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white text-right outline-none focus:border-[color:var(--gold)]/50"
                            />
                            <span className="text-xs text-[color:var(--muted)]">đ</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[color:var(--muted)]">Còn lại phải thu</span>
                          <span className="text-sm text-white font-semibold">
                            {formatCurrency(order.totalAmount - depositAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-xs text-[color:var(--muted)]">Trạng thái thanh toán</span>
                          <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            className={selectClass}
                          >
                            <option value="UNPAID">Chưa thanh toán</option>
                            <option value="PARTIAL">Đã cọc</option>
                            <option value="PAID">Đã thanh toán</option>
                            <option value="REFUNDED">Đã hoàn tiền</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Vận chuyển */}
                  {activeTab === 3 && (
                    <div className="bg-[color:var(--surface-2)] rounded-xl p-4 space-y-3 border border-white/5">
                      <div className={infoRowClass}>
                        <span className={labelCellClass}>Phương thức nhận hàng</span>
                        <span className={valueCellClass}>
                          {deliveryLabelMap[order.deliveryMethod] || order.deliveryMethod}
                        </span>
                      </div>
                      <div className={infoRowClass}>
                        <span className={labelCellClass}>Địa chỉ giao nhận</span>
                        <span className={`${valueCellClass} max-w-[200px] truncate`}>{order.address || '—'}</span>
                      </div>
                      <div className={infoRowClass}>
                        <span className={labelCellClass}>Người nhận hàng</span>
                        <span className={valueCellClass}>{order.customerName}</span>
                      </div>
                      <div className={infoRowClass}>
                        <span className={labelCellClass}>Số điện thoại</span>
                        <span className={valueCellClass}>{order.phone}</span>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Lịch sử */}
                  {activeTab === 4 && <OrderTimeline timeline={timelineEvents} />}
                </>
              ) : (
                <div className="text-center py-10 text-xs text-[color:var(--muted)]">
                  Không thể tìm thấy đơn hàng.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex gap-3 justify-end bg-black/20">
              <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
                Đóng
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleSaveChanges}
                loading={saving}
                icon={<Save className="w-4 h-4" />}
                disabled={loading || !order}
              >
                Cập nhật đơn
              </AdminButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
