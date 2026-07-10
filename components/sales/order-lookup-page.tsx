'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ClipboardList, Search, Loader2, Package, Calendar, User, Phone, CheckCircle2, ChevronRight } from 'lucide-react'
import { toast } from './toast-notification'
import clsx from 'clsx'

interface OrderItem {
  id: string
  productName: string
  model: string | null
  sku: string | null
  imageUrl: string | null
  quantity: number
  unitPrice: string
  totalPrice: string
}

interface TimelineEvent {
  id: string
  type: string
  title: string
  description: string | null
  createdAt: string
}

interface OrderDetail {
  code: string
  customerName: string
  company: string | null
  phone: string
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED'
  deliveryMethod: 'PICKUP' | 'DELIVERY' | 'INSTALLATION'
  paymentMethod: string | null
  totalAmount: string
  depositAmount: string
  remainingAmount: string
  createdAt: string
  items: OrderItem[]
  timeline: TimelineEvent[]
}

const statusSteps = [
  { key: 'PENDING', label: 'Chờ duyệt' },
  { key: 'CONFIRMED', label: 'Xác nhận' },
  { key: 'PROCESSING', label: 'Đang xử lý' },
  { key: 'SHIPPING', label: 'Giao hàng' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
]

const statusColorMap = {
  PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  CONFIRMED: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  PROCESSING: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
  SHIPPING: 'text-[color:var(--gold)] bg-[color:var(--gold)]/10 border-[color:var(--gold)]/30',
  COMPLETED: 'text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/30',
  CANCELLED: 'text-[color:var(--danger)] bg-[color:var(--danger)]/10 border-[color:var(--danger)]/30',
}

const statusTextMap = {
  PENDING: 'Chờ duyệt',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  COMPLETED: 'Đã hoàn thành',
  CANCELLED: 'Đã hủy',
}

const paymentTextMap = {
  UNPAID: 'Chưa thanh toán',
  PARTIAL: 'Thanh toán một phần',
  PAID: 'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền',
}

const deliveryTextMap = {
  PICKUP: 'Nhận tại showroom',
  DELIVERY: 'Giao hàng tận nơi',
  INSTALLATION: 'Lắp đặt tận nơi',
}

export default function OrderLookupPage() {
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<OrderDetail | null>(null)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      toast('Vui lòng nhập mã yêu cầu / đơn hàng', 'error')
      return
    }
    if (!phone.trim()) {
      toast('Vui lòng nhập số điện thoại để xác minh', 'error')
      return
    }

    setLoading(true)
    setOrder(null)

    try {
      const res = await fetch('/api/order-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), phone: phone.trim() }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrder(data.data)
        toast('Tra cứu thông tin thành công')
      } else {
        toast(data.message || 'Không tìm thấy thông tin đơn hàng', 'error')
      }
    } catch (err) {
      console.error('Order lookup error:', err)
      toast('Lỗi hệ thống khi tra cứu đơn hàng', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Calculate current active step index for visual tracker
  const getActiveStepIndex = (currentStatus: string) => {
    if (currentStatus === 'CANCELLED') return -1
    return statusSteps.findIndex((step) => step.key === currentStatus)
  }

  const activeStepIdx = order ? getActiveStepIndex(order.orderStatus) : -1

  return (
    <div className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
          Tra cứu đơn hàng & Yêu cầu
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--muted)] mt-1">
          Theo dõi tiến độ xử lý yêu cầu báo giá hoặc tình trạng giao xe nâng của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel - col 4 */}
        <div className="lg:col-span-4 bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-[color:var(--gold)]" size={20} />
            <h2 className="text-sm font-black uppercase text-white tracking-wider">
              Nhập thông tin tra cứu
            </h2>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="lookup-code" className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider">
                Mã yêu cầu / Mã đơn hàng
              </label>
              <input
                id="lookup-code"
                type="text"
                required
                placeholder="Ví dụ: BG-2026-0001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white placeholder:text-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lookup-phone" className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider">
                Số điện thoại liên hệ
              </label>
              <input
                id="lookup-phone"
                type="tel"
                required
                placeholder="Ví dụ: 0903385225"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white placeholder:text-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] disabled:bg-neutral-800 text-black font-extrabold text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Đang truy vấn...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Kiểm tra tiến độ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results panel - col 8 */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[color:var(--surface-2)] border border-white/5 rounded-2xl gap-3">
              <Loader2 className="animate-spin text-[color:var(--gold)]" size={32} />
              <p className="text-sm text-[color:var(--muted)]">Đang kết nối hệ thống dữ liệu...</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[color:var(--surface-2)] border border-white/10 rounded-2xl">
                <div>
                  <p className="text-xs text-[color:var(--muted)] font-medium">Mã đơn hàng / Yêu cầu:</p>
                  <h3 className="text-xl font-mono font-black text-white mt-0.5">{order.code}</h3>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-[color:var(--muted)] font-medium">Trạng thái:</span>
                  <span
                    className={clsx(
                      'text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider',
                      statusColorMap[order.orderStatus] || 'text-white border-white/20 bg-white/5'
                    )}
                  >
                    {statusTextMap[order.orderStatus] || order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Status Visual Tracker */}
              {order.orderStatus !== 'CANCELLED' && (
                <div className="p-6 bg-[color:var(--surface-2)] border border-white/10 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider mb-6">
                    Tiến độ thực hiện
                  </h4>
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                    {/* Background Progress Line */}
                    <div className="absolute left-4 top-2 bottom-2 md:left-2 md:right-2 md:top-[15px] md:bottom-auto h-full w-[2px] md:h-[2px] md:w-full bg-white/5 z-0" />
                    {/* Active Progress Line */}
                    {activeStepIdx > 0 && (
                      <div
                        className="absolute left-4 top-2 md:left-2 md:top-[15px] md:bottom-auto w-[2px] md:h-[2px] bg-[color:var(--gold)] z-0 transition-all duration-500"
                        style={{
                          height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(activeStepIdx / (statusSteps.length - 1)) * 100}%` : '2px',
                          width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(activeStepIdx / (statusSteps.length - 1)) * 100}%` : '2px',
                        }}
                      />
                    )}

                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= activeStepIdx
                      const isCurrent = idx === activeStepIdx

                      return (
                        <div
                          key={step.key}
                          className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 z-10 w-full md:w-auto relative"
                        >
                          <div
                            className={clsx(
                              'size-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors duration-300',
                              isCompleted
                                ? 'bg-[color:var(--gold)] text-black border-[color:var(--gold)]'
                                : 'bg-black border-white/10 text-[color:var(--muted)]',
                              isCurrent && 'ring-4 ring-[color:var(--gold)]/20'
                            )}
                          >
                            {isCompleted ? <CheckCircle2 size={16} className="text-black fill-transparent" /> : idx + 1}
                          </div>
                          <span
                            className={clsx(
                              'text-xs font-bold transition-colors duration-300',
                              isCompleted ? 'text-white' : 'text-[color:var(--muted)]'
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Order Info & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer and Delivery info */}
                <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider pb-2 border-b border-white/5">
                    Thông tin khách hàng
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2.5">
                      <User size={16} className="text-[color:var(--muted)] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[color:var(--muted)] font-medium">Người mua hàng:</p>
                        <p className="font-bold text-white mt-0.5">{order.customerName}</p>
                        {order.company && <p className="text-xs text-[color:var(--silver)] mt-0.5">{order.company}</p>}
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <Phone size={16} className="text-[color:var(--muted)] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[color:var(--muted)] font-medium">Số điện thoại liên hệ:</p>
                        <p className="font-bold text-white mt-0.5">{order.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <Package size={16} className="text-[color:var(--muted)] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[color:var(--muted)] font-medium">Phương thức giao hàng:</p>
                        <p className="font-bold text-white mt-0.5">
                          {deliveryTextMap[order.deliveryMethod] || order.deliveryMethod}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <Calendar size={16} className="text-[color:var(--muted)] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[color:var(--muted)] font-medium">Thời gian yêu cầu:</p>
                        <p className="font-bold text-white mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Log */}
                <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider pb-2 border-b border-white/5">
                    Lịch sử cập nhật
                  </h4>

                  <div className="relative border-l border-white/10 pl-4 ml-2 space-y-4 max-h-[220px] overflow-y-auto">
                    {order.timeline.length === 0 ? (
                      <p className="text-xs text-[color:var(--muted)] py-4">Chưa có cập nhật lịch trình nào.</p>
                    ) : (
                      order.timeline.map((event) => (
                        <div key={event.id} className="relative">
                          <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-[color:var(--gold)] border border-black" />
                          <p className="text-xs text-[color:var(--muted)] font-semibold">
                            {new Date(event.createdAt).toLocaleDateString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </p>
                          <h5 className="text-sm font-bold text-white mt-0.5 leading-snug">{event.title}</h5>
                          {event.description && (
                            <p className="text-xs text-[color:var(--muted)] mt-0.5 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider pb-2 border-b border-white/5">
                  Chi tiết sản phẩm
                </h4>

                <div className="divide-y divide-white/5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="relative size-12 rounded overflow-hidden border border-white/5 bg-black/40 shrink-0">
                        <Image
                          src={item.imageUrl || '/images/placeholder.jpg'}
                          alt={item.productName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-white truncate uppercase">{item.productName}</h5>
                        <div className="flex gap-3 text-xs text-[color:var(--muted)] mt-1 font-medium">
                          {item.model && (
                            <span>
                              Model: <span className="text-white font-bold">{item.model}</span>
                            </span>
                          )}
                          <span>
                            Số lượng: <span className="text-white font-bold">{item.quantity}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-[color:var(--gold)]">
                          {parseInt(item.totalPrice) > 0
                            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                parseInt(item.totalPrice)
                              )
                            : 'Liên hệ'}
                        </p>
                        {parseInt(item.unitPrice) > 0 && item.quantity > 1 && (
                          <p className="text-[10px] text-[color:var(--muted)] mt-0.5 font-medium">
                            Đơn giá:{' '}
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              parseInt(item.unitPrice)
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[color:var(--muted)]">Thanh toán:</span>
                    <span className="font-bold text-white">
                      {paymentTextMap[order.paymentStatus] || order.paymentStatus}
                    </span>
                  </div>
                  {parseInt(order.depositAmount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[color:var(--muted)]">Đã đặt cọc:</span>
                      <span className="font-bold text-[color:var(--success)] font-sans">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          parseInt(order.depositAmount)
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/5 pt-2.5">
                    <span className="text-base font-black text-white uppercase tracking-wider">Tổng cộng:</span>
                    <span className="text-base font-black text-[color:var(--gold)]">
                      {parseInt(order.totalAmount) > 0
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            parseInt(order.totalAmount)
                          )
                        : 'Liên hệ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[color:var(--surface-2)] border border-white/5 rounded-2xl text-[color:var(--muted)]">
              <ClipboardList size={40} className="stroke-1 opacity-40 mb-3" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Không có dữ liệu truy vấn</h3>
              <p className="text-xs max-w-xs mt-1.5 leading-relaxed">
                Vui lòng điền mã đơn hàng (ví dụ: BG-2026-0001) và số điện thoại liên quan ở biểu mẫu bên trái để tra cứu thông tin tiến độ chi tiết.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
