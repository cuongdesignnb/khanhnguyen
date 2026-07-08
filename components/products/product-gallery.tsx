'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg']

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[color:var(--surface-2)]">
        <Image
          src={displayImages[activeIdx]}
          alt={`Hình ảnh chính của ${name}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnail strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hidden">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={clsx(
                'relative aspect-[4/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-lg border bg-[color:var(--surface-2)] cursor-pointer transition',
                idx === activeIdx
                  ? 'border-[color:var(--gold)] scale-95 opacity-100'
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
