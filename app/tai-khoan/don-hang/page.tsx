import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Calendar, MapPin, Truck, HelpCircle } from 'lucide-react'

const orderStatusLabels: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  COMPLETED: 'Đã giao thành công',
  CANCELLED: 'Đã hủy',
}

const orderStatusColors: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  CONFIRMED: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  PROCESSING: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  SHIPPING: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  COMPLETED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  CANCELLED: 'text-red-400 bg-red-500/10 border-red-500/20',
}

const paymentStatusLabels: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PARTIAL: 'Thanh toán một phần',
  PAID: 'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền',
}

const paymentStatusColors: Record<string, string> = {
  UNPAID: 'text-red-400 bg-red-500/5 border-red-500/10',
  PARTIAL: 'text-amber-400 bg-amber-500/5 border-amber-500/10',
  PAID: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10',
  REFUNDED: 'text-gray-400 bg-white/5 border-white/10',
}

const deliveryMethodLabels: Record<string, string> = {
  PICKUP: 'Nhận tại kho',
  DELIVERY: 'Giao hàng tận nơi',
  INSTALLATION: 'Lắp đặt tận nơi',
}

export default async function OrdersHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/dang-nhap')
  }

  const orders = await prisma.order.findMany({
    where: { email: session.user.email, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: { slug: true },
          },
        },
      },
      timeline: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1 border-b border-white/10 pb-4">
        <span className="text-xs font-black tracking-widest text-[color:var(--gold)] uppercase">LỊCH SỬ</span>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-white">ĐƠN HÀNG CỦA TÔI</h1>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <Package size={18} className="text-[color:var(--gold)]" />
                  <span className="text-sm font-extrabold text-white">Đơn hàng: #{order.code}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-[color:var(--muted)]">
                    <Calendar size={12} />
                    <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${
                      orderStatusColors[order.orderStatus] || 'text-white border-white/10'
                    }`}
                  >
                    {orderStatusLabels[order.orderStatus] || order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start sm:items-center justify-between text-xs sm:text-sm">
                    <div className="flex gap-3 items-center min-w-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="size-12 rounded-lg object-cover bg-black/25 shrink-0"
                        />
                      ) : (
                        <div className="size-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Package size={18} className="text-[color:var(--muted)]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-white truncate max-w-sm sm:max-w-md">
                          {item.productId && item.product ? (
                            <Link href={`/san-pham/${item.product.slug}`} className="hover:text-[color:var(--gold)] transition">
                              {item.productName}
                            </Link>
                          ) : (
                            <span>{item.productName}</span>
                          )}
                        </h4>
                        <span className="text-[10px] text-[color:var(--muted)] block">
                          Model: {item.model || 'N/A'} | SKU: {item.sku || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-[color:var(--muted)] block">SL: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery and payment status details block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[color:var(--surface-2)] p-4 border border-white/5 rounded-xl text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block mb-1">Thanh toán</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${
                      paymentStatusColors[order.paymentStatus] || 'text-white border-white/10'
                    }`}
                  >
                    {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block mb-1">Vận chuyển</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Truck size={14} className="text-[color:var(--gold)]" />
                    <span>{deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}</span>
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block mb-0.5">Tổng thanh toán</span>
                  <strong className="text-[color:var(--gold)] text-sm sm:text-base font-black">
                    {order.totalAmount ? Number(order.totalAmount).toLocaleString('vi-VN') : '0'} đ
                  </strong>
                </div>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div className="flex gap-2 text-xs text-[color:var(--silver)]">
                  <MapPin size={14} className="text-[color:var(--gold)] shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-white">Địa chỉ giao hàng:</span> {order.address}
                  </p>
                </div>
              )}

              {/* Recent timeline event */}
              {order.timeline.length > 0 && (
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-xs space-y-1">
                  <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block tracking-wider">Cập nhật đơn hàng mới nhất</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[color:var(--gold)] font-bold">{new Date(order.timeline[0].createdAt).toLocaleTimeString('vi-VN')}</span>
                    <span className="text-[color:var(--muted)] font-normal">|</span>
                    <p className="text-[color:var(--silver)] font-medium">{order.timeline[0].description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-8 text-center space-y-4">
          <HelpCircle className="mx-auto text-[color:var(--gold)] size-12 opacity-80" />
          <p className="text-sm text-[color:var(--muted)]">Bạn chưa có đơn đặt hàng nào trong lịch sử.</p>
          <Link
            href="/san-pham"
            className="inline-flex items-center bg-[color:var(--gold)] text-black font-extrabold text-xs sm:text-sm py-2.5 px-6 rounded-xl hover:bg-[#e6c260] active:scale-[0.98] transition cursor-pointer"
          >
            MUA SẮM NGAY
          </Link>
        </div>
      )}
    </div>
  )
}
