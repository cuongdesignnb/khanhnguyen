import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto text-xs text-[color:var(--muted)] flex items-center flex-wrap gap-1.5 bg-transparent">
      <Link href="/" className="hover:text-[color:var(--gold)] flex items-center gap-1">
        <Home size={12} />
        <span>Trang chủ</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight size={12} />
            {isLast || !item.href ? (
              <span className="text-[color:var(--silver)] font-medium truncate max-w-[200px] sm:max-w-none">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-[color:var(--gold)]">
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
