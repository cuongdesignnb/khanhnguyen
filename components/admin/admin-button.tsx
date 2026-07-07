'use client'

import React, { forwardRef } from 'react'
import clsx from 'clsx'

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
}

const variantStyles: Record<string, string> = {
  primary: 'bg-[color:var(--gold)] text-black hover:bg-[color:var(--gold-strong)] font-semibold',
  secondary: 'bg-transparent border border-white/10 text-[color:var(--text)] hover:border-[color:var(--gold)]/50',
  ghost: 'bg-transparent text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-white/5',
  danger: 'bg-[color:var(--danger)] text-white hover:brightness-110',
}

const sizeStyles: Record<string, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2 rounded-xl gap-2',
  lg: 'text-sm px-5 py-2.5 rounded-xl gap-2',
}

const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    )
  },
)

AdminButton.displayName = 'AdminButton'

export default AdminButton
export type { AdminButtonProps }
