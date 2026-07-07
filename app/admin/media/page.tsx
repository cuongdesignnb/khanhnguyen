'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import { adminMedia } from '@/data/admin'
import {
  Search,
  Upload,
  FolderPlus,
  Eye,
  Pencil,
  Trash2,
  Copy,
  X,
  Check,
  ExternalLink,
} from 'lucide-react'
import type { MediaItem } from '@/types/admin'

export default function MediaPage() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [filterType, setFilterType] = useState('')

  const filteredMedia = filterType
    ? adminMedia.filter((m) => m.type === filterType)
    : adminMedia

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Media Library' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton icon={<Upload className="w-4 h-4" />}>Upload ảnh</AdminButton>
            <AdminButton variant="secondary" icon={<FolderPlus className="w-4 h-4" />}>
              Tạo thư mục
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Grid */}
        <div className="xl:col-span-2">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px] flex items-center bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-[color:var(--muted)]" />
              <input
                type="text"
                placeholder="Tìm kiếm ảnh..."
                className="bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none flex-1"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer"
            >
              <option value="">Tất cả loại</option>
              <option value="product">Sản phẩm</option>
              <option value="service">Dịch vụ</option>
              <option value="hero">Hero</option>
              <option value="post">Tin tức</option>
            </select>
            <select className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer">
              <option>Tất cả định dạng</option>
              <option>JPG</option>
              <option>PNG</option>
              <option>WEBP</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                onClick={() => setSelectedMedia(media)}
                className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer group border-2 transition-all ${
                  selectedMedia?.id === media.id
                    ? 'border-[color:var(--gold)] shadow-lg shadow-[color:var(--gold)]/10'
                    : 'border-transparent hover:border-white/20'
                }`}
              >
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] text-white truncate">{media.alt}</div>
                  <div className="text-[9px] text-white/60">{media.size} · {media.format.toUpperCase()}</div>
                </div>
                {selectedMedia?.id === media.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[color:var(--gold)] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-[color:var(--muted)]">
            Hiển thị {filteredMedia.length} ảnh
          </div>
        </div>

        {/* Detail Panel */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          {selectedMedia ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[color:var(--silver)]">Chi tiết ảnh</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-[color:var(--muted)] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-[color:var(--muted)] mb-1 block">URL</label>
                  <div className="flex items-center gap-2 bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2">
                    <span className="text-xs text-[color:var(--silver)] truncate flex-1">
                      {selectedMedia.src}
                    </span>
                    <button className="text-[color:var(--muted)] hover:text-[color:var(--gold)] cursor-pointer shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)] mb-1 block">Alt text</label>
                  <input
                    type="text"
                    defaultValue={selectedMedia.alt}
                    className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-[color:var(--text)] outline-none focus:border-[color:var(--gold)]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-[color:var(--muted)] mb-0.5">Loại</div>
                    <div className="text-xs text-[color:var(--silver)] capitalize">{selectedMedia.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--muted)] mb-0.5">Định dạng</div>
                    <div className="text-xs text-[color:var(--silver)] uppercase">{selectedMedia.format}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--muted)] mb-0.5">Dung lượng</div>
                    <div className="text-xs text-[color:var(--silver)]">{selectedMedia.size}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--muted)] mb-0.5">Ngày upload</div>
                    <div className="text-xs text-[color:var(--silver)]">{selectedMedia.uploadedAt}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <AdminButton variant="secondary" size="sm" className="flex-1">
                  <Copy className="w-3.5 h-3.5" /> Copy link
                </AdminButton>
                <AdminButton variant="danger" size="sm">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Eye className="w-10 h-10 text-[color:var(--muted)] mb-3" />
              <p className="text-sm text-[color:var(--muted)]">
                Chọn một ảnh để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
