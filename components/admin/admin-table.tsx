import React from 'react'
import clsx from 'clsx'

interface AdminTableProps {
  children: React.ReactNode
  className?: string
}

export function AdminTable({ children, className }: AdminTableProps) {
  return (
    <div className={clsx('w-full overflow-x-auto', className)}>
      {children}
    </div>
  )
}
