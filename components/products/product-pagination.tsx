'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

export default function ProductPagination({
  currentPage,
  totalPages,
  onChange,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const range = 2 // Number of pages to show before and after current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  return (
    <nav aria-label="Phân trang sản phẩm" className="flex items-center justify-center gap-2 pt-6">
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center size-9 rounded-lg border border-white/10 bg-[color:var(--surface-2)] text-[color:var(--silver)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-[color:var(--silver)] transition"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {getPageNumbers().map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`dots-${idx}`} className="text-sm text-[color:var(--muted)] px-1.5 select-none">
              ...
            </span>
          )
        }

        const pageNum = p as number
        const isCurrent = pageNum === currentPage

        return (
          <button
            key={pageNum}
            onClick={() => onChange(pageNum)}
            className={clsx(
              'flex items-center justify-center size-9 rounded-lg border text-sm font-semibold transition',
              isCurrent
                ? 'border-[color:var(--gold)] bg-[color:var(--gold)] text-black font-bold'
                : 'border-white/10 bg-[color:var(--surface-2)] text-[color:var(--silver)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]'
            )}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {pageNum}
          </button>
        )
      })}

      {/* Next button */}
      <button
        onClick={() => currentPage < totalPages && onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center size-9 rounded-lg border border-white/10 bg-[color:var(--surface-2)] text-[color:var(--silver)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-[color:var(--silver)] transition"
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
