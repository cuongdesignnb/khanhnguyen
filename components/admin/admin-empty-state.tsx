import React from 'react'
import { iconMap } from './icon-map'
import { Package } from 'lucide-react'

interface AdminEmptyStateProps {
  icon: string
  title: string
  description: string
  action?: React.ReactNode
}

export default function AdminEmptyState({ icon, title, description, action }: AdminEmptyStateProps) {
  const Icon = iconMap[icon] ?? Package

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[color:var(--muted)]" />
      </div>
      <h3 className="text-lg font-semibold text-[color:var(--text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] max-w-sm mb-4">{description}</p>
      {action}
    </div>
  )
}
