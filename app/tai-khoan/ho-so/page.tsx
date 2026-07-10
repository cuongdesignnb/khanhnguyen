'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, User, Check, AlertCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()

  // Profile states
  const [name, setName] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  // Password states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Initialize values when session loads
  useState(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  })

  // Safe check if session state is still loading
  if (isPending) {
    return <div className="text-sm text-[color:var(--muted)]">Đang tải thông tin...</div>
  }

  if (!session?.user) {
    return null
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileSuccess('')
    setProfileError('')

    try {
      const { error } = await authClient.updateUser({
        name,
      })

      if (error) {
        setProfileError(error.message || 'Không thể cập nhật hồ sơ')
      } else {
        setProfileSuccess('Cập nhật thông tin thành công')
      }
    } catch (err: any) {
      setProfileError('Đã xảy ra lỗi hệ thống')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordSuccess('')
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không trùng khớp')
      setPasswordLoading(false)
      return
    }

    try {
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        setPasswordError(error.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.')
      } else {
        setPasswordSuccess('Thay đổi mật khẩu thành công')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      setPasswordError('Đã xảy ra lỗi hệ thống')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="space-y-1 border-b border-white/10 pb-4">
        <span className="text-xs font-black tracking-widest text-[color:var(--gold)] uppercase">TÀI KHOẢN</span>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-white">HỒ SƠ CÁ NHÂN</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Section 1: Update Profile Details */}
        <div className="space-y-5">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">Thông tin tài khoản</h2>

          {profileSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <Check size={16} />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider block mb-1.5">
                Họ và Tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={session.user.name}
                  value={name || session.user.name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[color:var(--surface)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
                />
                <User className="absolute left-3.5 top-3.5 text-[color:var(--muted)]" size={16} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider block mb-1.5">
                Địa chỉ Email (Không được đổi)
              </label>
              <input
                type="email"
                disabled
                value={session.user.email}
                className="w-full bg-[color:var(--surface)] opacity-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-[color:var(--gold)] text-black font-extrabold text-xs sm:text-sm py-2.5 px-6 rounded-xl hover:bg-[#e6c260] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            >
              {profileLoading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
            </button>
          </form>
        </div>

        {/* Section 2: Change Password */}
        <div className="space-y-5">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">Đổi mật khẩu</h2>

          {passwordSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <Check size={16} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider block mb-1.5">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[color:var(--surface)] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
                />
                <Lock className="absolute left-3.5 top-3.5 text-[color:var(--muted)]" size={16} />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-3.5 text-[color:var(--muted)] hover:text-white"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider block mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[color:var(--surface)] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
                />
                <Lock className="absolute left-3.5 top-3.5 text-[color:var(--muted)]" size={16} />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-3.5 text-[color:var(--muted)] hover:text-white"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider block mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[color:var(--surface)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[color:var(--gold)] text-black font-extrabold text-xs sm:text-sm py-2.5 px-6 rounded-xl hover:bg-[#e6c260] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            >
              {passwordLoading ? 'ĐANG CẬP NHẬT...' : 'ĐỔI MẬT KHẨU'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
