'use client'

import MediaCard from './media-card'
import type { MediaFileDto } from '@/types/media'

export default function MediaGrid({
  media,
  selectedIds = new Set(),
  onSelect,
  emptyMessage = 'Không có Media phù hợp.',
}: {
  media: MediaFileDto[]
  selectedIds?: Set<string>
  onSelect?: (media: MediaFileDto) => void
  emptyMessage?: string
}) {
  if (!media.length) {
    return <div className="rounded-xl border border-dashed border-white/10 px-4 py-16 text-center text-sm text-[color:var(--muted)]">{emptyMessage}</div>
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {media.map((item) => (
        <MediaCard key={item.id} media={item} selected={selectedIds.has(item.id)} onSelect={onSelect} />
      ))}
    </div>
  )
}
