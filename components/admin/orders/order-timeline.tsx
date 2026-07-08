'use client'

import type { OrderTimelineEvent } from '@/types/admin'

const dotColors: Record<string, string> = {
  create: 'bg-[color:var(--gold)] border-[color:var(--gold)]',
  payment: 'bg-emerald-500 border-emerald-500',
  update: 'bg-blue-500 border-blue-500',
  shipping: 'bg-purple-500 border-purple-500',
  note: 'bg-gray-500 border-gray-500',
}

interface OrderTimelineProps {
  timeline?: OrderTimelineEvent[]
}

export default function OrderTimeline({ timeline = [] }: OrderTimelineProps) {
  if (timeline.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-[color:var(--muted)]">
        Chưa có sự kiện nào.
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {timeline.map((event, idx) => (
        <div key={idx} className="flex gap-4 relative">
          {/* Left column: dot + line */}
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                dotColors[event.type] || dotColors.note
              }`}
            />
            {idx < timeline.length - 1 && (
              <div className="w-px flex-1 bg-white/10 my-1" />
            )}
          </div>

          {/* Right column: content */}
          <div className="flex-1 pb-6">
            <div className="text-xs text-[color:var(--muted)] font-mono">
              {event.date} · {event.time}
            </div>
            <div className="text-sm text-white mt-1">{event.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
