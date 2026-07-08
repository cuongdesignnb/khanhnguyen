import Link from 'next/link'
import { Globe, Camera, Video, Music2 } from 'lucide-react'
import { siteConfig as staticSiteConfig, footerGroups as staticFooterGroups } from '@/data/home'
import { PublicSiteConfig } from '@/types/public'

const socialLinks = [
  { icon: Globe, label: 'Facebook', href: '#' },
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: Video, label: 'Youtube', href: '#' },
  { icon: Music2, label: 'TikTok', href: '#' },
] as const

const legalLinks = [
  { label: 'Điều khoản sử dụng', href: '/dieu-khoan' },
  { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
  { label: 'Sơ đồ website', href: '/sitemap' },
] as const

interface FooterProps {
  siteConfig?: PublicSiteConfig
  footerGroups?: { title: string; links: { label: string; href: string }[] }[]
}

export default function Footer({ siteConfig, footerGroups }: FooterProps) {
  const config = siteConfig || staticSiteConfig
  const displayGroups = footerGroups || staticFooterGroups

  return (
    <footer className="bg-black border-t border-[color:var(--line-gold)] pt-12 lg:pt-16 pb-24 lg:pb-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top section: 5-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand summary */}
          <div className="lg:col-span-1">
            <p className="text-2xl font-black">
              <span className="text-[color:var(--gold)]">KHANH</span>{' '}
              <span className="text-white">NGUYEN</span>
            </p>
            <p className="text-sm text-[color:var(--muted)] mt-1">
              {config.tagline}
            </p>
            <p className="text-sm text-[color:var(--muted)] mt-3">
              Chuyên cung cấp xe nâng Nhật bãi chất lượng, xe cẩu và thiết bị
              nâng hạ uy tín hàng đầu Việt Nam.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-[color:var(--surface-3)] flex items-center justify-center text-white hover:bg-[color:var(--gold)] hover:text-black transition"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-4: Footer groups */}
          {displayGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-sm font-bold uppercase text-white mb-4 tracking-wider">
                {group.title}
              </h3>
              <ul className="space-y-0">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color:var(--muted)] hover:text-[color:var(--gold)] py-1.5 block transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Column 5: Newsletter signup */}
          <div>
            <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-4">
              ĐĂNG KÝ NHẬN TIN
            </h3>
            <p className="text-sm text-[color:var(--muted)] mb-4">
              Nhận thông tin ưu đãi và sản phẩm mới nhất từ Khanh Nguyen.
            </p>
            <form
              className="flex"
              aria-label="Đăng ký nhận bản tin"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 bg-[color:var(--surface-2)] border border-white/10 rounded-l-lg px-4 py-2.5 text-sm text-white placeholder:text-[color:var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              />
              <button
                type="submit"
                className="bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] px-5 py-2.5 rounded-r-lg font-bold text-black text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              >
                ĐĂNG KÝ
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[color:var(--muted)]">
            © 2026 KHANH NGUYEN. All rights reserved.
          </p>

          <nav
            aria-label="Chính sách pháp lý"
            className="flex items-center gap-4"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-[color:var(--muted)] hover:text-[color:var(--gold)] transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
