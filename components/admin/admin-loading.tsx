'use client'

interface SkeletonProps {
  className?: string
}

export function Pulse({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full overflow-hidden border border-white/10 rounded-2xl bg-[color:var(--surface)]/80 p-4 space-y-4">
      {/* Header Pulse */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <Pulse className="h-8 w-1/4" />
        <div className="flex gap-2">
          <Pulse className="h-8 w-20" />
          <Pulse className="h-8 w-20" />
        </div>
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Pulse
                key={cIdx}
                className={`h-6 flex-1 ${cIdx === 0 ? 'max-w-[40px]' : ''} ${
                  cIdx === 1 ? 'max-w-[120px]' : ''
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border border-white/10 rounded-2xl bg-[color:var(--surface)]/80 p-4 space-y-4 flex flex-col"
        >
          <Pulse className="aspect-video w-full rounded-xl" />
          <Pulse className="h-6 w-3/4" />
          <Pulse className="h-4 w-1/2" />
          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
            <Pulse className="h-5 w-1/3" />
            <Pulse className="h-7 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Pulse className="w-16 h-16 rounded-xl flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Pulse className="h-6 w-1/3" />
          <Pulse className="h-4 w-1/4" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Pulse className="h-24 w-full" />
          <Pulse className="h-10 w-full" />
          <Pulse className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          <Pulse className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function AdminLoading({ type = 'table', count = 5 }: { type?: 'table' | 'grid' | 'detail'; count?: number }) {
  if (type === 'grid') return <GridSkeleton count={count} />
  if (type === 'detail') return <DetailSkeleton />
  return <TableSkeleton rows={count} />
}
