'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { withVideoAutoplay } from '@/lib/videos/normalize-video-url'
import type { PublicHomeVideoItem } from '@/types/home-video'

interface HomeVideoModalProps {
  item: PublicHomeVideoItem
  onClose: () => void
}

export default function HomeVideoModal({ item, onClose }: HomeVideoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  const titleId = `home-video-title-${item.id}`
  const platform = item.source === 'youtube' ? 'YouTube' : 'Facebook'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[1100px] overflow-y-auto rounded-2xl border border-white/15 bg-[#0b0b0b] shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <h2 id={titleId} className="min-w-0 flex-1 truncate text-sm font-bold text-white sm:text-base">{item.title}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng video" className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-white hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]">
            <X aria-hidden size={21} />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            src={withVideoAutoplay(item.embedUrl)}
            title={item.title}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            className="size-full border-0"
          />
        </div>
        <div className="flex justify-end p-4">
          <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]">
            Mở trên {platform}<ExternalLink aria-hidden size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
