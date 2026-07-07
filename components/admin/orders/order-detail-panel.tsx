'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import AdminButton from '../admin-button'
import AdminStatusBadge from '../admin-status-badge'
import OrderTimeline from './order-timeline'
import Image from 'next/image'
import type { OrderAdminItem } from '@/types/admin'

interface OrderDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  order: OrderAdminItem | null
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

function formatAmount(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ'
}

const infoRowClass = 'flex justify-between items-start py-2 border-b border-white/5'
const labelCellClass = 'text-xs text-[color:var(--muted)]'
const valueCellClass = 'text-sm text-white text-right'

export default function OrderDetailPanel({
  isOpen,
  onClose,
  order,
}: OrderDetailPanelProps) {
  const [activeTab, setActiveTab] = useState(0)

  if (!order) return null

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
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[color:var(--surface)] border-l border-white/10 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[color:var(--text)]">
                  Chi tiết đơn hàng
                </h2>
                <span className="text-sm text-[color:var(--gold)] font-mono">{order.code}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors whitespace-nowrap ${
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
                      <AdminStatusBadge status={order.orderStatus} />
                    </div>
                    <div className={infoRowClass}>
                      <span className={labelCellClass}>Thanh toán</span>
                      <AdminStatusBadge status={order.paymentStatus} />
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
                  <div className="mt-4">
                    <h3 className="text-xs text-[color:var(--muted)] uppercase tracking-wider mb-3 font-medium">
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
                        <span className={valueCellClass}>{order.email}</span>
                      </div>
                      <div className={infoRowClass}>
                        <span className={labelCellClass}>Địa chỉ</span>
                        <span className={`${valueCellClass} max-w-[200px]`}>{order.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {(order.note || order.internalNote) && (
                    <div className="mt-4">
                      <h3 className="text-xs text-[color:var(--muted)] uppercase tracking-wider mb-3 font-medium">
                        Ghi chú
                      </h3>
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
                  )}
                </>
              )}

              {/* Tab 1: Sản phẩm */}
              {activeTab === 1 && (
                <>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 bg-[color:var(--surface-2)] rounded-xl"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium">{item.productName}</div>
                          <div className="text-xs text-[color:var(--muted)]">
                            Model: {item.model} · SKU: {item.sku}
                          </div>
                          <div className="text-xs text-[color:var(--muted)] mt-1">
                            SL: {item.quantity} × {formatAmount(item.unitPrice)}
                          </div>
                        </div>
                        <div className="text-sm text-[color:var(--gold)] font-semibold flex-shrink-0">
                          {formatAmount(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="border-t border-white/10 pt-4 space-y-2 mt-4">
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
                </>
              )}

              {/* Tab 2: Thanh toán */}
              {activeTab === 2 && (
                <>
                  <div className="bg-[color:var(--surface-2)] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[color:var(--muted)]">Tổng tiền</span>
                      <span className="text-lg text-[color:var(--gold)] font-bold">
                        {formatAmount(order.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[color:var(--muted)]">Đã thanh toán</span>
                      <span className="text-sm text-emerald-400 font-semibold">
                        {formatAmount(order.depositAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[color:var(--muted)]">Còn lại</span>
                      <span className="text-sm text-white font-semibold">
                        {formatAmount(order.remainingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-sm text-[color:var(--muted)]">Trạng thái</span>
                      <AdminStatusBadge status={order.paymentStatus} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <AdminButton variant="primary" className="flex-1 justify-center">
                      Ghi nhận thanh toán
                    </AdminButton>
                    <AdminButton variant="secondary" className="flex-1 justify-center">
                      In phiếu thu
                    </AdminButton>
                  </div>
                </>
              )}

              {/* Tab 3: Vận chuyển */}
              {activeTab === 3 && (
                <>
                  <div className="bg-[color:var(--surface-2)] rounded-xl p-4 space-y-3">
                    <div className={infoRowClass}>
                      <span className={labelCellClass}>Phương thức</span>
                      <span className={valueCellClass}>
                        {deliveryLabelMap[order.deliveryMethod] || order.deliveryMethod}
                      </span>
                    </div>
                    <div className={infoRowClass}>
                      <span className={labelCellClass}>Địa chỉ giao</span>
                      <span className={`${valueCellClass} max-w-[200px]`}>{order.address}</span>
                    </div>
                    <div className={infoRowClass}>
                      <span className={labelCellClass}>Người nhận</span>
                      <span className={valueCellClass}>{order.customerName}</span>
                    </div>
                    <div className={infoRowClass}>
                      <span className={labelCellClass}>SĐT</span>
                      <span className={valueCellClass}>{order.phone}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <AdminButton variant="secondary" className="w-full justify-center">
                      Cập nhật giao hàng
                    </AdminButton>
                  </div>
                </>
              )}

              {/* Tab 4: Lịch sử */}
              {activeTab === 4 && <OrderTimeline />}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex gap-3 justify-end">
              <AdminButton variant="secondary" onClick={onClose}>
                Đóng
              </AdminButton>
              <AdminButton variant="primary">Cập nhật đơn</AdminButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
