'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { X, Plus, Trash2 } from 'lucide-react'
import AdminButton from '../admin-button'

interface OrderCreatePanelProps {
  isOpen: boolean
  onClose: () => void
}

const tabs = ['Khách hàng', 'Sản phẩm', 'Thanh toán', 'Giao hàng', 'Quản trị']

const inputClass = 'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors'
const selectClass = 'w-full appearance-none bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-[color:var(--text)] focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors cursor-pointer'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ'
}

export default function OrderCreatePanel({ isOpen, onClose }: OrderCreatePanelProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[color:var(--bg)] border-l border-white/10 z-50 flex flex-col overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <h2 className="text-lg font-semibold text-white">Tạo đơn hàng mới</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 shrink-0 overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={clsx(
                    'px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap',
                    activeTab === i
                      ? 'bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20'
                      : 'text-[color:var(--muted)] hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === 0 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Tên khách hàng <span className="text-red-400">*</span></label>
                    <input className={inputClass} placeholder="Nhập tên khách hàng" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Công ty</label>
                    <input className={inputClass} placeholder="Tên công ty (nếu có)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">SĐT <span className="text-red-400">*</span></label>
                      <input className={inputClass} placeholder="0901 234 567" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Email</label>
                      <input className={inputClass} placeholder="email@example.com" type="email" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Địa chỉ</label>
                    <textarea className={clsx(inputClass, 'h-20 resize-none')} placeholder="Nhập địa chỉ khách hàng" />
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <h4 className="text-sm font-semibold text-[color:var(--silver)]">Danh sách sản phẩm</h4>

                  {/* Mock product row */}
                  <div className="bg-[color:var(--surface-2)] rounded-xl p-3 space-y-3">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-5">
                        <select className={selectClass}>
                          <option>Chọn sản phẩm</option>
                          <option>TOYOTA 8FB25</option>
                          <option>KOMATSU FD25T-17</option>
                          <option>MITSUBISHI RB14</option>
                          <option>TCM FD30T3</option>
                          <option>NIULI AC25</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input className={inputClass} type="number" defaultValue={1} min={1} />
                      </div>
                      <div className="col-span-3">
                        <input className={inputClass} defaultValue="425,000,000" />
                      </div>
                      <div className="col-span-1 text-right text-[color:var(--gold)] text-sm font-semibold">
                        {formatCurrency(425000000)}
                      </div>
                      <div className="col-span-1">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-red-400 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center text-[10px] text-[color:var(--muted)]">
                      <div className="col-span-5">Sản phẩm</div>
                      <div className="col-span-2">Số lượng</div>
                      <div className="col-span-3">Đơn giá</div>
                      <div className="col-span-1 text-right">Thành tiền</div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>

                  <AdminButton variant="ghost" size="sm">
                    <Plus className="w-3.5 h-3.5" /> Thêm sản phẩm
                  </AdminButton>

                  {/* Summary */}
                  <div className="bg-[color:var(--surface-2)] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-[color:var(--muted)]">
                      <span>Tạm tính</span>
                      <span className="text-white">{formatCurrency(425000000)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[color:var(--muted)]">
                      <span>Giảm giá</span>
                      <span className="text-white">0đ</span>
                    </div>
                    <div className="flex justify-between text-sm text-[color:var(--muted)]">
                      <span>Phí vận chuyển</span>
                      <span className="text-emerald-400">Miễn phí</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-sm font-medium text-white">Tổng tiền</span>
                      <span className="text-lg font-bold text-[color:var(--gold)]">{formatCurrency(425000000)}</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Tiền cọc</label>
                      <input className={inputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Còn lại</label>
                      <div className="bg-[color:var(--surface-3)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--gold)] font-semibold">
                        {formatCurrency(425000000)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Phương thức thanh toán</label>
                    <select className={selectClass}>
                      <option>Tiền mặt</option>
                      <option>Chuyển khoản</option>
                      <option>COD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Trạng thái thanh toán</label>
                    <select className={selectClass}>
                      <option>Chưa thanh toán</option>
                      <option>Đã cọc</option>
                      <option>Đã thanh toán</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 3 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Phương thức nhận hàng</label>
                    <select className={selectClass}>
                      <option>Khách tự nhận</option>
                      <option>Giao hàng</option>
                      <option>Giao + lắp đặt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Địa chỉ giao hàng</label>
                    <input className={inputClass} placeholder="Nhập địa chỉ giao hàng" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Người nhận</label>
                      <input className={inputClass} placeholder="Tên người nhận" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">SĐT người nhận</label>
                      <input className={inputClass} placeholder="0901 234 567" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Ngày dự kiến giao</label>
                    <input className={inputClass} type="date" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Ghi chú vận chuyển</label>
                    <textarea className={clsx(inputClass, 'h-20 resize-none')} placeholder="Ghi chú vận chuyển nếu có..." />
                  </div>
                </>
              )}

              {activeTab === 4 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Nguồn đơn</label>
                    <select className={selectClass}>
                      <option>Website</option>
                      <option>Admin</option>
                      <option>Điện thoại</option>
                      <option>Zalo</option>
                      <option>Facebook</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Nhân viên phụ trách</label>
                    <input className={inputClass} defaultValue="Admin" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Trạng thái đơn</label>
                    <select className={selectClass}>
                      <option>Chờ xác nhận</option>
                      <option>Đã xác nhận</option>
                      <option>Đang xử lý</option>
                      <option>Đang giao</option>
                      <option>Hoàn thành</option>
                      <option>Đã hủy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Ghi chú nội bộ</label>
                    <textarea className={clsx(inputClass, 'h-24 resize-none')} placeholder="Ghi chú nội bộ cho nhân viên..." />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 shrink-0 flex-wrap">
              <AdminButton variant="secondary" onClick={onClose}>Hủy bỏ</AdminButton>
              <AdminButton variant="secondary">Lưu nháp</AdminButton>
              <AdminButton>Lưu đơn hàng</AdminButton>
              <AdminButton>Lưu và in đơn</AdminButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
