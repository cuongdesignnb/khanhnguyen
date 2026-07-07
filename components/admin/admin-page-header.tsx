import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  breadcrumbs: { label: string; href?: string }[]
  actions?: React.ReactNode
}

export default function AdminPageHeader({ title, breadcrumbs, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <nav className="flex items-center gap-1 text-xs">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="w-3 h-3 text-[color:var(--muted)]" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[color:var(--muted)] hover:text-[color:var(--gold)] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[color:var(--text)]">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <h1 className="text-xl font-bold text-white mt-1">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}
