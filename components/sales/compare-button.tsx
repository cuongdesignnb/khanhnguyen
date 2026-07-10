'use client'

import { GitCompare } from 'lucide-react'
import { useSalesContext } from './sales-provider'
import { toast } from './toast-notification'
import clsx from 'clsx'
import { MouseEvent } from 'react'

interface CompareButtonProps {
  productId: string
  productName: string
  showText?: boolean
  className?: string
}

export default function CompareButton({ productId, productName, showText = false, className }: CompareButtonProps) {
  const { isInCompare, toggleCompare } = useSalesContext()
  const active = isInCompare(productId)

  const handleToggle = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const result = toggleCompare(productId)
    if (result.action === 'added') {
      toast(`Đã thêm "${productName}" vào danh sách so sánh`)
    } else if (result.action === 'removed') {
      toast(`Đã xóa "${productName}" khỏi danh sách so sánh`, 'info')
    } else if (result.action === 'none') {
      toast('Chỉ được so sánh tối đa 4 sản phẩm cùng lúc', 'error')
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200',
        showText
          ? 'px-4 py-2.5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm'
          : 'p-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-white hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]',
        active && 'text-[color:var(--gold)] border-[color:var(--gold)]/40 bg-[color:var(--gold)]/5',
        className
      )}
      title={active ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'}
      aria-label={active ? `Xóa ${productName} khỏi danh sách so sánh` : `Thêm ${productName} vào danh sách so sánh`}
    >
      <GitCompare
        size={18}
        className={clsx('transition-transform duration-300', active ? 'text-[color:var(--gold)] scale-110' : 'scale-100')}
      />
      {showText && <span>{active ? 'Đã thêm so sánh' : 'So sánh'}</span>}
    </button>
  )
}
