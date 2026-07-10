'use client'

import { useState, useEffect } from 'react'
import { useSalesContext } from './sales-provider'
import { ShoppingCart, Loader2, Trash2, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PublicProductDetail } from '@/types/public'
import { toast } from './toast-notification'

export default function QuoteCartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useSalesContext()
  const [products, setProducts] = useState<PublicProductDetail[]>([])
  const [loading, setLoading] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{ code: string } | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      if (cartItems.length === 0) {
        setProducts([])
        return
      }

      setLoading(true)
      try {
        const ids = cartItems.map((item) => item.productId)
        const res = await fetch('/api/products/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setProducts(data.data.details || [])
          }
        }
      } catch (err) {
        console.error('Failed to fetch cart products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [cartItems])

  const getQuantity = (productId: string) => {
    return cartItems.find((item) => item.productId === productId)?.quantity || 1
  }

  const handleQtyChange = (productId: string, currentQty: number, delta: number) => {
    const nextQty = currentQty + delta
    if (nextQty < 1) return
    updateCartQuantity(productId, nextQty)
  }

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId)
    toast(`Đã xóa "${productName}" khỏi giỏ báo giá`, 'info')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast('Vui lòng nhập tên của bạn', 'error')
      return
    }
    if (!phone.trim()) {
      toast('Vui lòng nhập số điện thoại liên hệ', 'error')
      return
    }

    setSubmitting(true)

    // Build items list
    const items = cartItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId)
      return {
        productId: item.productId,
        productName: prod?.name || 'Sản phẩm xe nâng',
        quantity: item.quantity,
      }
    })

    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          company: company || undefined,
          message: message || undefined,
          items,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSuccessData({ code: data.data.code })
        clearCart()
        toast('Gửi yêu cầu báo giá thành công!')
      } else {
        toast(data.message || 'Lỗi gửi yêu cầu báo giá', 'error')
      }
    } catch (err) {
      console.error('Submit quote request error:', err)
      toast('Lỗi hệ thống khi gửi yêu cầu báo giá', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 text-center">
        <div className="size-20 rounded-full bg-[color:var(--success)]/10 text-[color:var(--success)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
          GỬI YÊU CẦU THÀNH CÔNG!
        </h1>
        <p className="text-sm text-[color:var(--silver)] mt-3">
          Cảm ơn quý khách <strong>{name}</strong>. Yêu cầu báo giá của quý khách đã được tiếp nhận và đang được xử lý.
        </p>

        <div className="bg-[color:var(--surface-2)] border border-[color:var(--line-gold)] rounded-xl p-5 my-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[color:var(--muted)]">Mã yêu cầu:</span>
            <span className="font-mono font-bold text-[color:var(--gold)]">{successData.code}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[color:var(--muted)]">Số điện thoại:</span>
            <span className="font-bold text-white">{phone}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-white/5 pt-3">
            <span className="text-[color:var(--muted)] font-medium">Trạng thái:</span>
            <span className="text-xs font-bold text-[color:var(--success)] bg-[color:var(--success)]/10 px-2.5 py-0.5 rounded border border-[color:var(--success)]/30 uppercase tracking-wider">
              Chờ tiếp nhận
            </span>
          </div>
        </div>

        <p className="text-xs text-[color:var(--muted)] leading-relaxed mb-8">
          Nhân viên kinh doanh sẽ liên hệ báo giá chi tiết và tư vấn kỹ thuật cho quý khách qua số điện thoại <strong>{phone}</strong> trong vòng 15 phút. Quý khách có thể sử dụng mã yêu cầu trên để tra cứu tình trạng xử lý.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/kiem-tra-don-hang"
            className="inline-flex items-center justify-center border border-[color:var(--gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition duration-200"
          >
            Tra cứu yêu cầu
          </Link>
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition duration-200"
          >
            Tiếp tục xem sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
          Giỏ hàng báo giá
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--muted)] mt-1">
          Yêu cầu báo giá cùng lúc nhiều sản phẩm xe nâng một cách nhanh chóng
        </p>
      </div>

      {loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-[color:var(--gold)]" size={32} />
          <p className="text-sm text-[color:var(--muted)]">Đang tải giỏ hàng...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[color:var(--surface-2)] border border-white/5 rounded-2xl">
          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <ShoppingCart size={32} className="text-[color:var(--muted)]" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase">Giỏ báo giá trống</h2>
          <p className="text-sm text-[color:var(--muted)] max-w-sm mt-2 mb-6">
            Không có sản phẩm nào trong giỏ báo giá của bạn. Vui lòng thêm sản phẩm bạn muốn nhận báo giá.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart items - col 7 */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-black uppercase text-white tracking-wider pb-2 border-b border-white/5">
              Danh sách sản phẩm ({cartItems.length})
            </h2>

            {products.map((p) => {
              const qty = getQuantity(p.id)
              return (
                <div
                  key={p.id}
                  className="flex gap-4 p-4 rounded-xl border border-white/10 bg-[color:var(--surface-2)] relative group"
                >
                  <button
                    onClick={() => handleRemove(p.id, p.name)}
                    className="absolute top-4 right-4 text-white/40 hover:text-red-400 transition-colors p-1"
                    title="Xóa khỏi giỏ"
                    aria-label={`Xóa ${p.name} khỏi giỏ báo giá`}
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="relative size-16 sm:size-20 rounded-lg overflow-hidden shrink-0 border border-white/5 bg-black/40">
                    <Image
                      src={p.thumbnail || '/images/placeholder.jpg'}
                      alt={p.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white truncate uppercase">
                        {p.name}
                      </h3>
                      {p.model && (
                        <p className="text-xs text-[color:var(--muted)] font-medium mt-0.5">
                          Model: <span className="text-white font-bold">{p.model}</span>
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-[color:var(--gold)] font-extrabold mt-1">
                        {p.priceLabel}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[color:var(--muted)] mr-2">Số lượng:</span>
                      <button
                        onClick={() => handleQtyChange(p.id, qty, -1)}
                        className="size-7 rounded border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 active:scale-95 transition-all"
                        disabled={qty <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
                      <button
                        onClick={() => handleQtyChange(p.id, qty, 1)}
                        className="size-7 rounded border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 active:scale-95 transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Form - col 5 */}
          <div className="lg:col-span-5 bg-[color:var(--surface-2)] border border-[color:var(--line-gold)] rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-base font-black text-[color:var(--gold)] uppercase tracking-wide">
                THÔNG TIN GỬI YÊU CẦU
              </h2>
              <p className="text-xs text-[color:var(--muted)] mt-1">
                Chúng tôi sẽ phản hồi bảng giá chi tiết trong vòng 15 phút
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="quote-name" className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="quote-name"
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="quote-phone" className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="quote-phone"
                  type="tel"
                  required
                  placeholder="Ví dụ: 0903385225"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="quote-email" className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider">
                  Email liên hệ
                </label>
                <input
                  id="quote-email"
                  type="email"
                  placeholder="Ví dụ: khachhang@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="quote-company" className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider">
                  Tên công ty / Doanh nghiệp
                </label>
                <input
                  id="quote-company"
                  type="text"
                  placeholder="Ví dụ: Công ty Vận tải ABC"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="quote-message" className="text-xs font-bold uppercase text-[color:var(--silver)] tracking-wider">
                  Yêu cầu cụ thể hoặc Ghi chú
                </label>
                <textarea
                  id="quote-message"
                  rows={3}
                  placeholder="Ví dụ: Cần xe nâng điện nâng cuộn giấy, lốp đặc..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] disabled:bg-neutral-800 text-black font-extrabold text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Đang gửi yêu cầu...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi yêu cầu báo giá</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
