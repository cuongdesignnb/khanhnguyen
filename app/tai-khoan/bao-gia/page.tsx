import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ClipboardList, Calendar, Info, ShieldQuestion } from 'lucide-react'

const quoteStatusLabels: Record<string, string> = {
  NEW: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  QUOTED: 'Đã báo giá',
  CLOSED: 'Đã hoàn thành',
  IGNORED: 'Đã hủy',
}

const quoteStatusColors: Record<string, string> = {
  NEW: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  PROCESSING: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  QUOTED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  CLOSED: 'text-gray-400 bg-white/5 border-white/10',
  IGNORED: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export default async function QuotesHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/dang-nhap')
  }

  const quotes = await prisma.quoteRequest.findMany({
    where: { email: session.user.email, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: { slug: true },
      },
      items: {
        include: {
          product: {
            select: { name: true, slug: true },
          },
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1 border-b border-white/10 pb-4">
        <span className="text-xs font-black tracking-widest text-[color:var(--gold)] uppercase">LỊCH SỬ</span>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-white">YÊU CẦU BÁO GIÁ</h1>
      </div>

      {quotes.length > 0 ? (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <ClipboardList size={18} className="text-[color:var(--gold)]" />
                  <span className="text-sm font-extrabold text-white">Mã yêu cầu: #{quote.code}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-[color:var(--muted)]">
                    <Calendar size={12} />
                    <span>{new Date(quote.createdAt).toLocaleDateString('vi-VN')}</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${
                      quoteStatusColors[quote.status] || 'text-white border-white/10'
                    }`}
                  >
                    {quoteStatusLabels[quote.status] || quote.status}
                  </span>
                </div>
              </div>

              {/* Products requested info */}
              <div className="space-y-2">
                <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block">Sản phẩm yêu cầu</span>
                {quote.items.length > 0 ? (
                  <ul className="space-y-1.5 list-disc pl-4" role="list">
                    {quote.items.map((item) => (
                      <li key={item.id} className="text-xs sm:text-sm text-[color:var(--silver)] font-medium">
                        {item.product ? (
                          <Link href={`/san-pham/${item.product.slug}`} className="hover:text-[color:var(--gold)] transition">
                            {item.product.name}
                          </Link>
                        ) : (
                          <span>{item.productName}</span>
                        )}
                        <span className="text-[color:var(--muted)] font-normal ml-1">(SL: {item.quantity})</span>
                      </li>
                    ))}
                  </ul>
                ) : quote.productName ? (
                  <p className="text-xs sm:text-sm text-[color:var(--silver)] font-semibold">
                    {quote.productId && quote.product ? (
                      <Link href={`/san-pham/${(quote.product as any).slug}`} className="hover:text-[color:var(--gold)] transition">
                        {quote.productName}
                      </Link>
                    ) : (
                      <span>{quote.productName}</span>
                    )}
                    <span className="text-[color:var(--muted)] font-normal ml-1">(SL: {quote.quantity || 1})</span>
                  </p>
                ) : (
                  <span className="text-xs text-[color:var(--muted)]">Không rõ sản phẩm</span>
                )}
              </div>

              {/* Extra details (Budget, message, notes) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[color:var(--surface-2)] p-4 border border-white/5 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block mb-0.5">Dự toán ngân sách</span>
                  <span className="text-[color:var(--silver)] font-semibold">{quote.budget || 'Không rõ'}</span>
                </div>
                {quote.message && (
                  <div>
                    <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block mb-0.5">Lời nhắn</span>
                    <p className="text-[color:var(--silver)] italic truncate max-w-xs">{quote.message}</p>
                  </div>
                )}
              </div>

              {/* Admin response notes if closed/quoted */}
              {quote.internalNote && (
                <div className="bg-[color:var(--gold)]/5 border border-[color:var(--gold)]/15 rounded-xl p-4 flex gap-3 text-xs">
                  <Info size={16} className="text-[color:var(--gold)] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-extrabold text-[color:var(--gold)] uppercase block tracking-wider">Phản hồi từ tư vấn viên</span>
                    <p className="text-[color:var(--silver)] leading-relaxed">{quote.internalNote}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-8 text-center space-y-4">
          <ShieldQuestion className="mx-auto text-[color:var(--gold)] size-12 opacity-80" />
          <p className="text-sm text-[color:var(--muted)]">Bạn chưa gửi yêu cầu báo giá nào sử dụng email này.</p>
          <Link
            href="/san-pham"
            className="inline-flex items-center bg-[color:var(--gold)] text-black font-extrabold text-xs sm:text-sm py-2.5 px-6 rounded-xl hover:bg-[#e6c260] active:scale-[0.98] transition cursor-pointer"
          >
            KHÁM PHÁ SẢN PHẨM NGAY
          </Link>
        </div>
      )}
    </div>
  )
}
