import React from 'react'
import clsx from 'clsx'
import { statusLabelMap, statusColorMap } from '@/types/admin'

interface AdminStatusBadgeProps {
  status: string
}

const colorClasses: Record<string, string> = {
  gold: 'bg-[color:var(--gold)]/15 text-[color:var(--gold)] border-[color:var(--gold)]/25',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  gray: 'bg-white/5 text-[color:var(--muted)] border-white/10',
  red: 'bg-red-500/15 text-red-400 border-red-500/25',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
}

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const label = statusLabelMap[status] ?? status
  const color = statusColorMap[status] ?? 'gray'

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border',
        colorClasses[color] ?? colorClasses.gray,
      )}
    >
      {label}
    </span>
  )
}
