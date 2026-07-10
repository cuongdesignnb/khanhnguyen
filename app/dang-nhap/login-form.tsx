'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authClient.signIn.email({
        email,
        password,
      })

      if (response?.error) {
        setError(response.error.message || 'Email hoặc mật khẩu không chính xác')
      } else {
        router.push('/tai-khoan')
        router.refresh()
      }
    } catch (err: any) {
      console.error(err)
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[color:var(--surface)] min-h-[80vh] flex items-center justify-center px-4 py-16 text-white">
      <div className="w-full max-w-md bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ĐĂNG NHẬP <span className="text-[color:var(--gold)]">KHÁCH HÀNG</span>
          </h1>
          <p className="text-xs sm:text-sm text-[color:var(--muted)]">
            Quản lý đơn hàng, báo giá và sản phẩm yêu thích của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider block mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[color:var(--surface)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[color:var(--muted)] outline-none focus:border-[color:var(--gold)]"
              />
              <Mail className="absolute left-3.5 top-3.5 text-[color:var(--muted)]" size={16} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider block">
                Mật khẩu
              </label>
              <Link
                href="/quen-mat-khau"
                className="text-xs text-[color:var(--gold)] hover:underline font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[color:var(--surface)] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-[color:var(--muted)] outline-none focus:border-[color:var(--gold)]"
              />
              <Lock className="absolute left-3.5 top-3.5 text-[color:var(--muted)]" size={16} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[color:var(--muted)] hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[color:var(--gold)] text-black font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#e6c260] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center">
          <span className="text-xs sm:text-sm text-[color:var(--muted)]">
            Chưa có tài khoản?{' '}
            <Link href="/dang-ky" className="text-[color:var(--gold)] hover:underline font-bold">
              Đăng ký ngay
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
