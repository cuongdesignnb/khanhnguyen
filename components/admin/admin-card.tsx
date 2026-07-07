import React from 'react'
import clsx from 'clsx'

interface AdminCardProps {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export default function AdminCard({ title, action, children, className }: AdminCardProps) {
  return (
    <div className={clsx('rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[color:var(--silver)]">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
