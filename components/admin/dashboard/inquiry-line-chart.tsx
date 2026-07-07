'use client'

import { inquiryChartData } from '@/data/admin'
import { TrendingUp } from 'lucide-react'

const CHART_W = 500
const CHART_H = 200
const PAD_LEFT = 45
const PAD_RIGHT = 20
const PAD_TOP = 15
const PAD_BOTTOM = 30
const MAX_VAL = 50

function toX(i: number, total: number) {
  return PAD_LEFT + i * ((CHART_W - PAD_LEFT - PAD_RIGHT) / (total - 1))
}

function toY(v: number) {
  return PAD_TOP + (1 - v / MAX_VAL) * (CHART_H - PAD_TOP - PAD_BOTTOM)
}

function pointsStr(data: number[]) {
  return data.map((v, i) => `${toX(i, data.length)},${toY(v)}`).join(' ')
}

function areaPath(data: number[]) {
  const pts = data.map((v, i) => `${toX(i, data.length)},${toY(v)}`)
  const first = `${toX(0, data.length)},${toY(0)}`
  const last = `${toX(data.length - 1, data.length)},${toY(0)}`
  return `M${first} L${pts.join(' L')} L${last} Z`
}

const gridYValues = [0, 10, 20, 30, 40, 50]

export default function InquiryLineChart() {
  const { labels, contacts, quotes } = inquiryChartData

  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[color:var(--text)]">Biểu đồ yêu cầu &amp; báo giá</h3>
        <span className="text-xs text-[color:var(--muted)] bg-[color:var(--surface-2)] border border-white/10 px-3 py-1 rounded-lg">
          30 ngày qua
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-[color:var(--gold)] rounded-full" />
          <span className="text-[11px] text-[color:var(--muted)]">Yêu cầu liên hệ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-gray-500 rounded-full" />
          <span className="text-[11px] text-[color:var(--muted)]">Yêu cầu báo giá</span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" style={{ height: 192 }}>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines & Y labels */}
        {gridYValues.map((v) => (
          <g key={v}>
            <line
              x1={PAD_LEFT}
              x2={CHART_W - PAD_RIGHT}
              y1={toY(v)}
              y2={toY(v)}
              stroke="white"
              strokeOpacity="0.06"
              strokeDasharray="4 4"
            />
            <text x={PAD_LEFT - 8} y={toY(v) + 4} textAnchor="end" fill="var(--muted)" fontSize="10">
              {v}
            </text>
          </g>
        ))}

        {/* X labels */}
        {labels.map((label, i) => (
          <text
            key={label}
            x={toX(i, labels.length)}
            y={CHART_H - 5}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="10"
          >
            {label}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath(contacts)} fill="url(#goldGrad)" />

        {/* Gold line */}
        <polyline
          points={pointsStr(contacts)}
          stroke="var(--gold)"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Gray line */}
        <polyline
          points={pointsStr(quotes)}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Gold dots */}
        {contacts.map((v, i) => (
          <circle key={`c-${i}`} cx={toX(i, contacts.length)} cy={toY(v)} r="3" fill="var(--gold)" />
        ))}

        {/* Gray dots */}
        {quotes.map((v, i) => (
          <circle key={`q-${i}`} cx={toX(i, quotes.length)} cy={toY(v)} r="3" fill="#6b7280" />
        ))}
      </svg>

      {/* Bottom stats */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
        <div className="flex-1">
          <p className="text-[11px] text-[color:var(--muted)]">Tổng yêu cầu liên hệ</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-[color:var(--text)]">136</span>
            <span className="flex items-center gap-0.5 text-[11px] text-emerald-400">
              <TrendingUp className="w-3 h-3" /> ↑ 15.4%
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-[color:var(--muted)]">Tổng yêu cầu báo giá</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-[color:var(--text)]">87</span>
            <span className="flex items-center gap-0.5 text-[11px] text-emerald-400">
              <TrendingUp className="w-3 h-3" /> ↑ 22.6%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
