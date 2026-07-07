'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import type { MediaItem } from '@/types/admin'

interface MediaGridProps {
  media: MediaItem[]
  selectedId?: string | null
  onSelect?: (media: MediaItem) => void
}

export default function MediaGrid({ media, selectedId, onSelect }: MediaGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {media.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect?.(item)}
            className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer group border-2 transition-all ${
              selectedId === item.id
                ? 'border-[color:var(--gold)] shadow-lg shadow-[color:var(--gold)]/10'
                : 'border-transparent hover:border-white/20'
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="200px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-[10px] text-white truncate">{item.alt}</div>
              <div className="text-[9px] text-white/60">{item.size} · {item.format.toUpperCase()}</div>
            </div>
            {selectedId === item.id && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[color:var(--gold)] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-[color:var(--muted)]">
        Hiển thị {media.length} ảnh
      </div>
    </div>
  )
}
