'use client'

import { Search } from 'lucide-react'
import type { MediaListQuery } from '@/types/media'

const controlClass = 'min-h-10 rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-3 text-xs text-white outline-none focus:border-[color:var(--gold)]/50'

export default function MediaToolbar({
  query,
  onChange,
  compact = false,
}: {
  query: MediaListQuery
  onChange: (patch: Partial<MediaListQuery>) => void
  compact?: boolean
}) {
  return (
    <div className={`grid gap-2 ${compact ? 'grid-cols-2 lg:grid-cols-5' : 'sm:grid-cols-2 xl:grid-cols-5'}`}>
      <label className={`flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-3 ${compact ? 'col-span-2 lg:col-span-1' : 'sm:col-span-2 xl:col-span-1'}`}>
        <Search aria-hidden size={15} className="shrink-0 text-[color:var(--muted)]" />
        <span className="sr-only">Tìm kiếm Media</span>
        <input
          value={query.q}
          onChange={(event) => onChange({ q: event.target.value })}
          placeholder="Tìm tên, Alt, tiêu đề..."
          className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[color:var(--muted)]"
        />
      </label>
      <select aria-label="Loại file" value={query.type} onChange={(event) => onChange({ type: event.target.value as MediaListQuery['type'] })} className={controlClass}>
        <option value="">Tất cả loại file</option>
        <option value="IMAGE">Ảnh</option>
        <option value="DOCUMENT">Tài liệu</option>
        <option value="VIDEO">Video</option>
        <option value="OTHER">Khác</option>
      </select>
      <select aria-label="Định dạng file" value={query.format} onChange={(event) => onChange({ format: event.target.value })} className={controlClass}>
        <option value="">Tất cả định dạng</option>
        <option value="jpg">JPG</option>
        <option value="png">PNG</option>
        <option value="webp">WebP</option>
        <option value="avif">AVIF</option>
        <option value="gif">GIF</option>
        <option value="pdf">PDF</option>
      </select>
      <select aria-label="Nơi sử dụng" value={query.usage} onChange={(event) => onChange({ usage: event.target.value as MediaListQuery['usage'] })} className={controlClass}>
        <option value="">Tất cả nơi sử dụng</option>
        <option value="product">Sản phẩm</option>
        <option value="service">Dịch vụ</option>
        <option value="post">Tin tức</option>
        <option value="banner">Banner</option>
        <option value="category">Danh mục</option>
        <option value="brand">Thương hiệu</option>
        <option value="setting">Cài đặt</option>
        <option value="unused">Chưa sử dụng</option>
      </select>
      <select aria-label="Sắp xếp" value={query.sort} onChange={(event) => onChange({ sort: event.target.value as MediaListQuery['sort'] })} className={controlClass}>
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
        <option value="name-asc">Tên A–Z</option>
        <option value="size-desc">Dung lượng lớn nhất</option>
        <option value="size-asc">Dung lượng nhỏ nhất</option>
      </select>
    </div>
  )
}
