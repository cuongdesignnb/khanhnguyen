'use client'

import React from 'react'
import clsx from 'clsx'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = []

  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)

  return pages
}

export default function AdminPagination({ currentPage, totalPages, onPageChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  const btnBase =
    'min-w-[36px] h-9 rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer'
  const btnInactive =
    'bg-[color:var(--surface-2)] text-[color:var(--muted)] hover:text-white hover:bg-[color:var(--surface-3)]'
  const btnActive = 'bg-[color:var(--gold)] text-black font-semibold'

  return (
    <div className="flex items-center gap-1.5">
      <button
        className={clsx(btnBase, btnInactive)}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button
        className={clsx(btnBase, btnInactive)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className={clsx(btnBase, 'text-[color:var(--muted)] cursor-default')}>
            …
          </span>
        ) : (
          <button
            key={page}
            className={clsx(btnBase, page === currentPage ? btnActive : btnInactive)}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ),
      )}

      <button
        className={clsx(btnBase, btnInactive)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        className={clsx(btnBase, btnInactive)}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  )
}
