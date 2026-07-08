'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'

interface BlogSidebarProps {
  searchVal: string
  onSearchChange: (val: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
}

const CATEGORIES = [
  { name: 'Kinh nghiệm xe nâng', slug: 'kinh-nghiem-xe-nang' },
  { name: 'Hướng dẫn bảo dưỡng', slug: 'bao-duong-xe-nang' },
  { name: 'Tư vấn mua xe', slug: 'tu-van-mua-xe' },
  { name: 'Tin tức thị trường', slug: 'tin-tuc-thi-truong' },
]

export default function BlogSidebar({
  searchVal,
  onSearchChange,
  onSearchSubmit,
}: BlogSidebarProps) {
  return (
    <div className="space-y-6 lg:sticky lg:top-28">
      {/* Search box (desktop only) */}
      <div className="hidden lg:block bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tìm kiếm</h3>
        <form onSubmit={onSearchSubmit} className="relative">
          <input
            type="search"
            placeholder="Từ khóa tìm kiếm..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[color:var(--surface)] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]"
          />
          <Search className="absolute left-3.5 top-2.5 text-[color:var(--muted)]" size={14} />
        </form>
      </div>

      {/* Blog Categories list */}
      <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Danh mục tin tức</h3>
        <ul className="divide-y divide-white/5 space-y-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug} className="pt-2.5 first:pt-0">
              <Link
                href={`/tin-tuc/danh-muc/${cat.slug}`}
                className="text-xs sm:text-sm text-[color:var(--silver)] hover:text-[color:var(--gold)] transition font-medium flex items-center justify-between"
              >
                <span>{cat.name}</span>
                <span>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Support Hotlines box */}
      <div className="bg-[color:var(--surface-2)] border border-[color:var(--line-gold)] rounded-xl p-5 text-center">
        <h3 className="text-sm font-extrabold text-[color:var(--gold)] uppercase tracking-wider mb-2">HỖ TRỢ TRỰC TUYẾN</h3>
        <p className="text-[11px] text-[color:var(--muted)] mb-4">
          Cung cấp xe nâng Nhật bãi chính hãng uy tín chất lượng hàng đầu.
        </p>
        <a
          href="tel:0903385225"
          className="block w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-bold py-2 rounded-lg text-xs transition"
        >
          Gọi tư vấn: 0903 385 225
        </a>
      </div>
    </div>
  )
}
