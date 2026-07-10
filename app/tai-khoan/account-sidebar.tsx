'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  User,
  ClipboardList,
  Package,
  Heart,
  GitCompare,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { authClient } from '@/lib/auth-client'

interface AccountSidebarProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { label: 'Tổng quan', href: '/tai-khoan', icon: LayoutDashboard, exact: true },
    { label: 'Hồ sơ cá nhân', href: '/tai-khoan/ho-so', icon: User },
    { label: 'Yêu cầu báo giá', href: '/tai-khoan/bao-gia', icon: ClipboardList },
    { label: 'Đơn hàng của tôi', href: '/tai-khoan/don-hang', icon: Package },
    { label: 'Sản phẩm yêu thích', href: '/tai-khoan/yeu-thich', icon: Heart },
    { label: 'Sản phẩm so sánh', href: '/tai-khoan/so-sanh', icon: GitCompare },
  ]

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push('/dang-nhap')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 space-y-6">
      {/* User profile briefing */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="size-12 rounded-full bg-[color:var(--gold)] text-black font-black flex items-center justify-center text-lg shrink-0 uppercase">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h2 className="font-extrabold text-sm truncate text-white uppercase">{user.name}</h2>
          <p className="text-xs text-[color:var(--muted)] truncate">{user.email}</p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex flex-col gap-1.5" aria-label="Menu tài khoản">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && pathname !== '/tai-khoan'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                isActive
                  ? 'bg-[color:var(--gold)] text-black font-extrabold'
                  : 'text-[color:var(--silver)] hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon size={18} className={clsx('shrink-0', isActive ? 'text-black' : 'text-[color:var(--gold)]')} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-400 hover:bg-red-500/5 transition cursor-pointer"
        >
          <LogOut size={18} className="shrink-0 text-red-400" />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </div>
  )
}
