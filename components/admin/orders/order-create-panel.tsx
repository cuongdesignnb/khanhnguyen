'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { X, Plus, Trash2 } from 'lucide-react'
import AdminButton from '../admin-button'
import { adminApi } from '@/lib/admin-api'
import { toast } from '@/lib/toast'

interface OrderCreatePanelProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

const tabs = ['Khách hàng', 'Sản phẩm', 'Thanh toán', 'Giao hàng', 'Quản trị']

const inputClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors'
const selectClass =
  'w-full appearance-none bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-[color:var(--text)] focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors cursor-pointer'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ'
}

export default function OrderCreatePanel({
  isOpen,
  onClose,
  onSaved,
}: OrderCreatePanelProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)

  // Products from API
  const [productList, setProductList] = useState<any[]>([])

  // Form states
  const [customerName, setCustomerName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  // Selected items list
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      productId: string
      productName: string
      quantity: number
      unitPrice: number
      model: string
      sku: string
    }>
  >([])

  // Payment states
  const [depositAmount, setDepositAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER' | 'COD'>('TRANSFER')
  const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PARTIAL' | 'PAID'>('UNPAID')

  // Shipping states
  const [deliveryMethod, setDeliveryMethod] = useState<'PICKUP' | 'DELIVERY' | 'INSTALLATION'>('DELIVERY')
  const [expectedDeliveryAt, setExpectedDeliveryAt] = useState('')
  const [note, setNote] = useState('')

  // Admin states
  const [source, setSource] = useState<'WEBSITE' | 'ADMIN' | 'PHONE' | 'ZALO' | 'FACEBOOK'>('ADMIN')
  const [orderStatus, setOrderStatus] = useState<'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED'>('PENDING')
  const [internalNote, setInternalNote] = useState('')

  // Load products list for selection
  useEffect(() => {
    if (isOpen) {
      adminApi
        .getProducts({ limit: 100 })
        .then((res) => {
          setProductList(res?.items || [])
        })
        .catch((err) => console.error('Lỗi tải sản phẩm:', err))
    }
  }, [isOpen])

  // Reset form
  useEffect(() => {
    if (isOpen) {
      setCustomerName('')
      setCompany('')
      setPhone('')
      setEmail('')
      setAddress('')
      setSelectedItems([])
      setDepositAmount(0)
      setPaymentMethod('TRANSFER')
      setPaymentStatus('UNPAID')
      setDeliveryMethod('DELIVERY')
      setExpectedDeliveryAt('')
      setNote('')
      setSource('ADMIN')
      setOrderStatus('PENDING')
      setInternalNote('')
      setActiveTab(0)
    }
  }, [isOpen])

  const handleAddItem = () => {
    setSelectedItems((prev) => [
      ...prev,
      {
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        model: '',
        sku: '',
      },
    ])
  }

  const handleRemoveItem = (idx: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleItemProductChange = (idx: number, prodId: string) => {
    const prod = productList.find((p) => p.id === prodId)
    if (!prod) return

    setSelectedItems((prev) => {
      const next = [...prev]
      next[idx] = {
        productId: prod.id,
        productName: prod.name,
        quantity: next[idx].quantity || 1,
        unitPrice: prod.price ? Number(prod.price) : 0,
        model: prod.model || '',
        sku: prod.sku || '',
      }
      return next
    })
  }

  const handleItemQtyChange = (idx: number, qty: number) => {
    setSelectedItems((prev) => {
      const next = [...prev]
      next[idx].quantity = Math.max(1, qty)
      return next
    })
  }

  const handleItemPriceChange = (idx: number, price: number) => {
    setSelectedItems((prev) => {
      const next = [...prev]
      next[idx].unitPrice = price
      return next
    })
  }

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const remainingAmount = totalAmount - depositAmount

  const handleSaveOrder = async () => {
    if (!customerName || !phone) {
      toast.error('Vui lòng điền tên khách hàng và số điện thoại.')
      setActiveTab(0)
      return
    }

    const itemsPayload = selectedItems.filter((item) => item.productId)
    if (itemsPayload.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.')
      setActiveTab(1)
      return
    }

    setSaving(true)
    try {
      const payload = {
        customerName,
        company: company || null,
        phone,
        email: email || null,
        address: address || null,
        totalAmount,
        depositAmount,
        remainingAmount,
        discountAmount: 0,
        shippingFee: 0,
        orderStatus,
        paymentStatus,
        source,
        deliveryMethod,
        paymentMethod,
        note: note || null,
        internalNote: internalNote || null,
        expectedDeliveryAt: expectedDeliveryAt ? new Date(expectedDeliveryAt).toISOString() : null,
        items: itemsPayload.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          model: item.model || null,
          sku: item.sku || null,
        })),
      }

      await adminApi.createOrder(payload)
      toast.success('Tạo đơn hàng thành công')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi tạo đơn hàng')
    } finally {
      setSaving(false)
    }
  }

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
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[color:var(--bg)] border-l border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <h2 className="text-lg font-semibold text-white">Tạo đơn hàng mới</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 shrink-0 overflow-x-auto bg-black/10 pb-2">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={clsx(
                    'px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap border',
                    activeTab === i
                      ? 'bg-[color:var(--gold)] text-black border-[color:var(--gold)]'
                      : 'text-[color:var(--muted)] hover:text-white hover:bg-white/5 border-white/10'
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
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                      Tên khách hàng <span className="text-red-400">*</span>
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Nhập tên khách hàng"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Công ty</label>
                    <input
                      className={inputClass}
                      placeholder="Tên công ty (nếu có)"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                        Số điện thoại <span className="text-red-400">*</span>
                      </label>
                      <input
                        className={inputClass}
                        placeholder="0901 234 567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Email</label>
                      <input
                        className={inputClass}
                        placeholder="email@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Địa chỉ</label>
                    <textarea
                      className={clsx(inputClass, 'h-20 resize-none')}
                      placeholder="Nhập địa chỉ giao hàng / lập hợp đồng..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-[color:var(--silver)]">Danh sách sản phẩm</h4>
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      onClick={handleAddItem}
                    >
                      Thêm sản phẩm
                    </AdminButton>
                  </div>

                  {selectedItems.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-[color:var(--muted)] text-sm">
                      Đơn hàng chưa có sản phẩm nào. Nhấp thêm sản phẩm để chọn.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedItems.map((item, idx) => (
                        <div key={idx} className="bg-[color:var(--surface-2)] rounded-xl p-3 border border-white/5 space-y-3">
                          <div className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-4">
                              <select
                                className={selectClass}
                                value={item.productId}
                                onChange={(e) => handleItemProductChange(idx, e.target.value)}
                              >
                                <option value="">Chọn sản phẩm</option>
                                {productList.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-2">
                              <input
                                className={inputClass}
                                type="number"
                                value={item.quantity}
                                min={1}
                                onChange={(e) => handleItemQtyChange(idx, Number(e.target.value))}
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                className={inputClass}
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleItemPriceChange(idx, Number(e.target.value))}
                              />
                            </div>
                            <div className="col-span-2 text-right text-[color:var(--gold)] text-sm font-semibold truncate">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </div>
                            <div className="col-span-1 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-rose-400 hover:text-rose-300 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-12 gap-3 items-center text-[9px] text-[color:var(--muted)] tracking-wider uppercase font-medium">
                            <div className="col-span-4">Sản phẩm</div>
                            <div className="col-span-2">Số lượng</div>
                            <div className="col-span-3">Đơn giá (đ)</div>
                            <div className="col-span-2 text-right">Thành tiền</div>
                            <div className="col-span-1"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-[color:var(--surface-2)] border border-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-[color:var(--muted)]">
                      <span>Tạm tính</span>
                      <span className="text-white">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[color:var(--muted)]">
                      <span>Phí vận chuyển</span>
                      <span className="text-emerald-400">Miễn phí</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-sm font-medium text-white">Tổng tiền đơn</span>
                      <span className="text-lg font-bold text-[color:var(--gold)]">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Tiền đặt cọc (đ)</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Còn lại phải thu</label>
                      <div className="bg-[color:var(--surface-3)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--gold)] font-semibold">
                        {formatCurrency(remainingAmount)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Phương thức thanh toán</label>
                    <select
                      className={selectClass}
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                    >
                      <option value="CASH">Tiền mặt</option>
                      <option value="TRANSFER">Chuyển khoản ngân hàng</option>
                      <option value="COD">Thanh toán khi nhận xe (COD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Trạng thái thanh toán</label>
                    <select
                      className={selectClass}
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as any)}
                    >
                      <option value="UNPAID">Chưa thanh toán</option>
                      <option value="PARTIAL">Đã đặt cọc</option>
                      <option value="PAID">Đã thanh toán đủ</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 3 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Phương thức giao hàng</label>
                    <select
                      className={selectClass}
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value as any)}
                    >
                      <option value="PICKUP">Khách tự nhận tại Showroom</option>
                      <option value="DELIVERY">Vận chuyển giao xe tận nơi</option>
                      <option value="INSTALLATION">Vận chuyển giao xe + Hỗ trợ lắp ráp bàn giao</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Ngày dự kiến giao</label>
                    <input
                      className={inputClass}
                      type="date"
                      value={expectedDeliveryAt}
                      onChange={(e) => setExpectedDeliveryAt(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Ghi chú giao nhận</label>
                    <textarea
                      className={clsx(inputClass, 'h-20 resize-none')}
                      placeholder="Các lưu ý đặc biệt khi bàn giao xe..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeTab === 4 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Nguồn đơn hàng</label>
                    <select
                      className={selectClass}
                      value={source}
                      onChange={(e) => setSource(e.target.value as any)}
                    >
                      <option value="ADMIN">Tạo bởi Admin</option>
                      <option value="WEBSITE">Website</option>
                      <option value="PHONE">Gọi điện hotline</option>
                      <option value="ZALO">Kênh Zalo OA</option>
                      <option value="FACEBOOK">Facebook Fanpage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Trạng thái đơn hàng</label>
                    <select
                      className={selectClass}
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value as any)}
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="PROCESSING">Đang xử lý chuẩn bị xe</option>
                      <option value="SHIPPING">Đang vận chuyển</option>
                      <option value="COMPLETED">Đã hoàn thành bàn giao</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Ghi chú nội bộ</label>
                    <textarea
                      className={clsx(inputClass, 'h-24 resize-none')}
                      placeholder="Ghi chú kỹ thuật hoặc tiến độ lưu nội bộ..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 shrink-0 flex-wrap bg-black/10">
              <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
                Hủy bỏ
              </AdminButton>
              <AdminButton
                onClick={handleSaveOrder}
                loading={saving}
                disabled={!customerName || !phone || selectedItems.length === 0}
              >
                Lưu đơn hàng
              </AdminButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
