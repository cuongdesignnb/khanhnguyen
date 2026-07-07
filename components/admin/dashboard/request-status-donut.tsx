'use client'

import { requestStatusData } from '@/data/admin'
import Link from 'next/link'

export default function RequestStatusDonut() {
  // Build conic-gradient string
  let accumulated = 0
  const gradientStops = requestStatusData.map((item) => {
    const start = accumulated
    accumulated += item.percent
    return `${item.color} ${start}% ${accumulated}%`
  })
  const conicGradient = `conic-gradient(${gradientStops.join(', ')})`

  const total = requestStatusData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-[color:var(--text)]">Trạng thái yêu cầu</h3>
        <span className="text-xs text-[color:var(--muted)] bg-[color:var(--surface-2)] border border-white/10 px-3 py-1 rounded-lg">
          Tất cả
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative w-44 h-44 rounded-full mx-auto shrink-0" style={{ background: conicGradient }}>
          {/* Inner circle (hole) */}
          <div className="absolute inset-[25%] rounded-full bg-[color:var(--surface)]" />
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-[color:var(--muted)]">Tổng</span>
            <span className="text-2xl font-bold text-[color:var(--text)]">{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1">
          {requestStatusData.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-[color:var(--muted)] flex-1">{item.label}</span>
              <span className="text-xs font-medium text-[color:var(--text)]">{item.value}</span>
              <span className="text-[10px] text-[color:var(--muted)]">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <Link href="/admin/contacts" className="text-xs text-[color:var(--gold)] hover:underline">
          Xem chi tiết →
        </Link>
      </div>
    </div>
  )
}
