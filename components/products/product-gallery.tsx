'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const displayImages = images && images.length > 0 ? images : ['/images/placeholder.jpg']

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIdx((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface-2)] group">
        <Image
          src={displayImages[activeIdx]}
          alt={`Hình ảnh chính của ${name}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Magnifying Glass Zoom Icon on the top right */}
        <button
          type="button"
          onClick={() => window.open(displayImages[activeIdx], '_blank')}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer border border-white/10"
          aria-label="Phóng to ảnh"
        >
          <ZoomIn size={18} />
        </button>

        {/* Navigation handles */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/5 opacity-0 group-hover:opacity-100"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/5 opacity-0 group-hover:opacity-100"
              aria-label="Ảnh sau"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {displayImages.length > 1 && (
        <div className="relative flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hidden">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={clsx(
                'relative aspect-[4/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border bg-[color:var(--surface-2)] cursor-pointer transition-all duration-300',
                idx === activeIdx
                  ? 'border-[color:var(--gold)] scale-95 opacity-100 ring-2 ring-[color:var(--gold)]/20'
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/20'
              )}
            >
              <Image
                src={img}
                alt={`Hình ảnh thu nhỏ ${idx + 1} của ${name}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
