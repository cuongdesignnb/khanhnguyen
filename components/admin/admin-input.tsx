'use client'

import React from 'react'
import clsx from 'clsx'

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

export default function AdminInput({ label, icon, className, ...props }: AdminInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">{label}</label>
      )}
      <div className={clsx('relative', icon && 'relative')}>
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)] w-4 h-4">
            {icon}
          </span>
        )}
        <input
          className={clsx(
            'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors',
            icon && 'pl-10',
            className,
          )}
          {...props}
        />
      </div>
    </div>
  )
}
