import Link from 'next/link'
import { ArrowLeft, PhoneCall } from 'lucide-react'
import { siteConfig } from '@/data/home'
import PublicPageShell from '@/components/public/public-page-shell'

export default function ForgotPasswordPage() {
  const hotlineNum = siteConfig.hotline.replace(/\s/g, '')

  return (
    <PublicPageShell>
      <div className="bg-[color:var(--surface)] min-h-[75vh] flex items-center justify-center px-4 py-16 text-white">
        <div className="w-full max-w-md bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              QUÊN <span className="text-[color:var(--gold)]">MẬT KHẨU</span>
            </h1>
            <p className="text-xs sm:text-sm text-[color:var(--muted)]">
              Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để khôi phục mật khẩu tài khoản
            </p>
          </div>

          <div className="bg-[color:var(--surface-3)] border border-white/5 rounded-2xl p-6 space-y-4">
            <p className="text-xs sm:text-sm text-[color:var(--silver)] font-medium">
              Hệ thống khôi phục mật khẩu tự động đang được bảo trì. Quý khách vui lòng liên hệ hotline để nhận mật khẩu mới:
            </p>
            <a
              href={`tel:${hotlineNum}`}
              className="inline-flex items-center gap-2 bg-[color:var(--gold)] text-black font-extrabold text-sm py-2.5 px-5 rounded-xl hover:bg-[#e6c260] active:scale-[0.98] transition cursor-pointer"
            >
              <PhoneCall size={16} />
              <span>{siteConfig.hotline}</span>
            </a>
          </div>

          <div className="pt-2">
            <Link
              href="/dang-nhap"
              className="inline-flex items-center gap-1 text-xs sm:text-sm text-[color:var(--gold)] hover:underline font-semibold"
            >
              <ArrowLeft size={14} />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
