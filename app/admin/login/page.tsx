'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (session) {
      router.push('/admin')
    }
  }, [session, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/admin',
      })

      if (response?.error) {
        setError(response.error.message || 'Email hoặc mật khẩu không chính xác')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err: any) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối.')
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-[color:var(--bg)] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[color:var(--gold)]/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[color:var(--gold)]/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[color:var(--gold)] flex items-center justify-center">
              <span className="font-black text-black text-xl">K</span>
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-[color:var(--gold)] leading-tight">
                KHANH NGUYÊN
              </div>
              <div className="text-[10px] tracking-[0.3em] text-[color:var(--muted)] uppercase">
                Forklift
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[color:var(--surface)]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-xl font-bold text-white text-center mb-2">
            Đăng nhập quản trị
          </h1>
          <p className="text-xs text-[color:var(--muted)] text-center mb-8">
            Khu vực dành cho quản trị viên Khanh Nguyên Forklift
          </p>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs rounded-xl p-3 mb-5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@khanhnguyenforklift.vn"
                  className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 accent-[color:var(--gold)] cursor-pointer"
                />
                <span className="text-xs text-[color:var(--muted)]">Ghi nhớ đăng nhập</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-semibold py-3 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-[10px] text-[color:var(--muted)] mt-6">
          © 2025 Khanh Nguyên Forklift. All rights reserved.
        </p>
      </div>
    </div>
  )
}
