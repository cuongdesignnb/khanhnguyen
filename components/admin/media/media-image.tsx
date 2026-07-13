'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FileText, ImageOff } from 'lucide-react'

export default function MediaImage({
  src,
  alt,
  type,
  missing = false,
  className = 'object-cover',
  sizes = '200px',
}: {
  src: string
  alt: string
  type: string
  missing?: boolean
  className?: string
  sizes?: string
}) {
  const [failure, setFailure] = useState<{ src: string; failed: boolean }>({ src, failed: false })
  const failed = missing || (failure.src === src && failure.failed)
  if (type !== 'IMAGE' || failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[color:var(--surface-2)] text-[color:var(--muted)]">
        {type === 'DOCUMENT' ? <FileText aria-hidden size={28} /> : <ImageOff aria-hidden size={28} />}
        <span className="px-2 text-center text-[10px]">{failed ? 'Thiếu file' : 'Không có ảnh xem trước'}</span>
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => setFailure({ src, failed: true })}
    />
  )
}
