'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import {
  Phone,
  Mail,
  MapPin,
  Headset,
  FileDown,
  PackageSearch,
  GitCompare,
  Heart,
  User,
  ShoppingCart,
  Search,
  Menu,
} from 'lucide-react'
import { siteConfig } from '@/data/home'
import SiteNavigation from '@/components/layout/site-navigation'

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface DesktopHeaderProps {
  onMenuOpen: () => void
}

/* ─── Utility Bar Items ────────────────────────────────────────────────────── */

const utilityLeft = [
  {
    icon: Phone,
    text: `${siteConfig.hotline} – ${siteConfig.secondaryHotline}`,
    href: `tel:${siteConfig.hotline.replace(/\s/g, '')}`,
  },
  {
    icon: Mail,
    text: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    text: `Showroom: ${siteConfig.showroom}`,
    href: '#lien-he',
  },
] as const

const utilityRight = [
  { icon: Headset, text: 'Hỗ trợ 24/7', href: `tel:${siteConfig.hotline.replace(/\s/g, '')}` },
  { icon: FileDown, text: 'Tải catalogue', href: '/catalogue' },
  { icon: PackageSearch, text: 'Kiểm tra đơn hàng', href: '/kiem-tra-don-hang' },
] as const

/* ─── Header Action Buttons ────────────────────────────────────────────────── */

const headerActions = [
  { icon: GitCompare, label: 'So sánh', href: '/so-sanh', badge: null },
  { icon: Heart, label: 'Yêu thích', href: '/yeu-thich', badge: null },
  { icon: User, label: 'Tài khoản / Đăng nhập', href: '/tai-khoan', badge: null },
  { icon: ShoppingCart, label: 'Giỏ hàng', href: '/gio-hang', badge: '0' },
] as const

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function DesktopHeader({ onMenuOpen }: DesktopHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      {/* ── Tier 1 · Utility Bar ─────────────────────────────────────────── */}
      <div className="hidden lg:block bg-black border-b border-white/5">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[34px]">
            {/* Left */}
            <ul className="flex items-center gap-5" role="list">
              {utilityLeft.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 text-[11px] text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
                  >
                    <item.icon
                      className="size-3.5 text-[color:var(--gold)] shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right */}
            <ul className="flex items-center gap-5" role="list">
              {utilityRight.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 text-[11px] text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
                  >
                    <item.icon
                      className="size-3.5 text-[color:var(--gold)] shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Tier 2 · Main Header ─────────────────────────────────────────── */}
      <div className="bg-[color:var(--surface)] border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {/* ── Mobile Header ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between h-14 lg:hidden">
            {/* Hamburger */}
            <button
              type="button"
              onClick={onMenuOpen}
              aria-label="Mở menu điều hướng"
              className="flex items-center justify-center size-10 -ml-2 text-[color:var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
            >
              <Menu className="size-6" />
            </button>

            {/* Wordmark */}
            <Link href="/" aria-label="Trang chủ Khanh Nguyen">
              <span className="text-xl font-black tracking-tight">
                <span className="text-[color:var(--gold)]">KHANH</span>
                <span className="text-[color:var(--text)]"> NGUYEN</span>
              </span>
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-1 -mr-2">
              <button
                type="button"
                aria-label="Tìm kiếm"
                className="flex items-center justify-center size-10 text-[color:var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              >
                <Search className="size-5" />
              </button>
              <Link
                href="/gio-hang"
                aria-label="Giỏ hàng"
                className="relative flex items-center justify-center size-10 text-[color:var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              >
                <ShoppingCart className="size-5" />
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-4 rounded-full bg-[color:var(--gold)] text-[10px] font-bold leading-none text-black">
                  0
                </span>
              </Link>
            </div>
          </div>

          {/* ── Desktop Header ─────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-6 h-[72px]">
            {/* Wordmark + Tagline */}
            <Link
              href="/"
              aria-label="Trang chủ Khanh Nguyen"
              className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
            >
              <span className="block text-2xl font-black tracking-tight leading-tight">
                <span className="text-[color:var(--gold)]">KHANH</span>
                <span className="text-[color:var(--text)]"> NGUYEN</span>
              </span>
              <span className="block text-xs text-[color:var(--muted)] mt-0.5">
                {siteConfig.tagline}
              </span>
            </Link>

            {/* Search Group */}
            <div className="flex flex-1 max-w-2xl mx-auto">
              <label htmlFor="header-category" className="sr-only">
                Danh mục sản phẩm
              </label>
              <select
                id="header-category"
                className="h-10 rounded-l-md border border-r-0 border-white/10 bg-[color:var(--surface-2)] px-3 text-xs text-[color:var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] appearance-none cursor-pointer min-w-[160px]"
                defaultValue=""
              >
                <option value="">Danh mục sản phẩm</option>
                <option value="xe-nang-dien">Xe nâng điện</option>
                <option value="xe-nang-dau">Xe nâng dầu</option>
                <option value="xe-nang-tay">Xe nâng tay</option>
                <option value="xe-cau">Xe cẩu</option>
                <option value="binh-dien">Bình điện</option>
                <option value="phu-tung">Phụ tùng</option>
              </select>

              <label htmlFor="header-search" className="sr-only">
                Tìm kiếm sản phẩm
              </label>
              <input
                id="header-search"
                type="search"
                placeholder="Bạn cần tìm xe nâng, thương hiệu, model..."
                className="h-10 flex-1 border border-white/10 bg-[color:var(--surface-2)] px-4 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              />

              <button
                type="button"
                aria-label="Tìm kiếm"
                className="flex items-center justify-center h-10 w-12 rounded-r-md bg-[color:var(--gold)] text-white transition-colors hover:bg-[color:var(--gold-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              >
                <Search className="size-5" />
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-5 shrink-0">
              {headerActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group relative flex flex-col items-center gap-1 text-[color:var(--muted)] transition-colors hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                >
                  <span className="relative">
                    <action.icon className="size-5" aria-hidden="true" />
                    {action.badge !== null && (
                      <span className="absolute -top-1.5 -right-2 flex items-center justify-center size-4 rounded-full bg-[color:var(--gold)] text-[10px] font-bold leading-none text-black">
                        {action.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] leading-tight whitespace-nowrap">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier 3 · Navigation (desktop only) ───────────────────────────── */}
      <div className="hidden lg:block bg-[color:var(--surface-2)] border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <SiteNavigation />
        </div>
      </div>
    </header>
  )
}
