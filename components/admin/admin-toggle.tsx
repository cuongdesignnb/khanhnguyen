'use client'

import React from 'react'
import clsx from 'clsx'

interface AdminToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  size?: 'sm' | 'md'
}

export default function AdminToggle({ checked, onChange, size = 'md' }: AdminToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'rounded-full transition-colors duration-200 cursor-pointer relative',
        checked ? 'bg-[color:var(--gold)]' : 'bg-[color:var(--surface-3)]',
        size === 'sm' ? 'w-9 h-5' : 'w-11 h-6',
      )}
    >
      <span
        className={clsx(
          'block rounded-full bg-white transition-transform duration-200',
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
        )}
        style={{
          transform: checked
            ? size === 'sm'
              ? 'translateX(18px) translateY(3px)'
              : 'translateX(22px) translateY(4px)'
            : size === 'sm'
              ? 'translateX(2px) translateY(3px)'
              : 'translateX(2px) translateY(4px)',
        }}
      />
    </button>
  )
}
