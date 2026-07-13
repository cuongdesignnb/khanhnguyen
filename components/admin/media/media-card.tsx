'use client'

import { Check, TriangleAlert } from 'lucide-react'
import MediaImage from './media-image'
import type { MediaFileDto } from '@/types/media'

export default function MediaCard({
  media,
  selected,
  onSelect,
}: {
  media: MediaFileDto
  selected?: boolean
  onSelect?: (media: MediaFileDto) => void
}) {
  return (
    <button
      type="button"
      disabled={media.missing && Boolean(onSelect)}
      onClick={() => onSelect?.(media)}
      aria-pressed={selected}
      className={`group overflow-hidden rounded-xl border text-left transition ${
        selected ? 'border-[color:var(--gold)] ring-1 ring-[color:var(--gold)]/30' : 'border-white/10 hover:border-white/25'
      } ${media.missing ? 'cursor-not-allowed opacity-80' : ''}`}
    >
      <span className="relative block aspect-square overflow-hidden bg-black/20">
        <MediaImage
          key={media.url}
          src={media.url}
          alt={media.alt || media.originalName}
          type={media.type}
          missing={media.missing}
        />
        {selected && (
          <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-[color:var(--gold)] text-black">
            <Check aria-hidden size={14} />
          </span>
        )}
        {media.missing && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-red-500/90 px-2 py-1 text-[10px] font-bold text-white">
            <TriangleAlert aria-hidden size={11} /> Thiếu file
          </span>
        )}
        {!media.missing && media.usage[0] !== 'unused' && (
          <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-1 text-[10px] text-white">
            Đang dùng
          </span>
        )}
      </span>
      <span className="block space-y-1 p-2.5">
        <span className="block truncate text-xs font-medium text-white" title={media.originalName}>{media.originalName}</span>
        <span className="block truncate text-[10px] text-[color:var(--muted)]">
          {media.width && media.height ? `${media.width} × ${media.height} · ` : ''}
          {media.sizeLabel} · {media.format.toUpperCase()}
        </span>
      </span>
    </button>
  )
}
