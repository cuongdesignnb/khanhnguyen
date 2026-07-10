import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ClipboardList, Package, ArrowRight, User, Heart } from 'lucide-react'

export default async function AccountOverviewPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return null
  }

  const userEmail = session.user.email

  // Query counts from database
  const [quotesCount, ordersCount] = await Promise.all([
    prisma.quoteRequest.count({
      where: { email: userEmail, deletedAt: null },
    }),
    prisma.order.count({
      where: { email: userEmail, deletedAt: null },
    }),
  ])

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="space-y-1">
        <span className="text-xs font-black tracking-widest text-[color:var(--gold)] uppercase">BẢNG ĐIỀU KHIỂN</span>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-white">
          CHÀO MỪNG QUAY TRỞ LẠI, {session.user.name.toUpperCase()}
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--muted)]">
          Quản lý tài khoản, xem lịch sử báo giá và đơn đặt hàng của bạn nhanh chóng.
        </p>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-[color:var(--gold)]/10 text-[color:var(--gold)] flex items-center justify-center shrink-0">
            <ClipboardList size={24} />
          </div>
          <div>
            <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block">Yêu cầu báo giá</span>
            <strong className="text-xl font-black text-white">{quotesCount}</strong>
          </div>
        </div>

        <div className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block">Đơn hàng đã đặt</span>
            <strong className="text-xl font-black text-white">{ordersCount}</strong>
          </div>
        </div>

        <div className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="size-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <span className="text-[10px] text-[color:var(--muted)] uppercase font-bold block">Sản phẩm yêu thích</span>
            <span className="text-xs text-[color:var(--silver)] font-semibold block">Đã lưu trong máy</span>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Lối tắt nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/tai-khoan/ho-so"
            className="flex items-center justify-between p-4 bg-[color:var(--surface-3)] hover:bg-white/5 border border-white/5 rounded-2xl transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <User size={18} className="text-[color:var(--gold)]" />
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-white">Thông tin cá nhân</h4>
                <p className="text-[11px] text-[color:var(--muted)]">Cập nhật hồ sơ và thay đổi mật khẩu</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[color:var(--muted)] group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/tai-khoan/bao-gia"
            className="flex items-center justify-between p-4 bg-[color:var(--surface-3)] hover:bg-white/5 border border-white/5 rounded-2xl transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={18} className="text-[color:var(--gold)]" />
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-white">Quản lý yêu cầu báo giá</h4>
                <p className="text-[11px] text-[color:var(--muted)]">Xem tiến độ duyệt và chi tiết báo giá</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[color:var(--muted)] group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
