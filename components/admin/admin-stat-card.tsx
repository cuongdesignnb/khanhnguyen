import React from 'react'
import clsx from 'clsx'
import { iconMap } from './icon-map'
import { TrendingUp } from 'lucide-react'

interface AdminStatCardProps {
  label: string
  value: number | string
  change: number
  icon: string
}

export default function AdminStatCard({ label, value, change, icon }: AdminStatCardProps) {
  const Icon = iconMap[icon] ?? TrendingUp
  const isPositive = change >= 0

  return (
    <div className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-5">
      <div className="w-10 h-10 rounded-xl bg-[color:var(--gold)]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[color:var(--gold)]" />
      </div>
      <p className="text-xs text-[color:var(--muted)] mt-3">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p
        className={clsx(
          'text-xs mt-2 flex items-center gap-1',
          isPositive ? 'text-emerald-400' : 'text-red-400',
        )}
      >
        <TrendingUp
          className={clsx('w-3 h-3', !isPositive && 'rotate-180')}
        />
        {isPositive ? '↑' : '↓'} {Math.abs(change)}% so với tháng trước
      </p>
    </div>
  )
}
