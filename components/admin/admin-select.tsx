'use client'

import React from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export default function AdminSelect({ label, options, className, ...props }: AdminSelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">{label}</label>
      )}
      <div className="relative">
        <select
          className={clsx(
            'w-full appearance-none bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-[color:var(--text)] focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors cursor-pointer',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
      </div>
    </div>
  )
}
