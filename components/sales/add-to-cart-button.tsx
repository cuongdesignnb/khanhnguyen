'use client'

import { ShoppingCart } from 'lucide-react'
import { useSalesContext } from './sales-provider'
import { toast } from './toast-notification'
import clsx from 'clsx'
import { MouseEvent } from 'react'

interface AddToCartButtonProps {
  productId: string
  productName: string
  quantity?: number
  variant?: 'outline' | 'solid'
  className?: string
  label?: string
}

export default function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  variant = 'solid',
  className,
  label,
}: AddToCartButtonProps) {
  const { addToCart } = useSalesContext()

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(productId, quantity)
    toast(`Đã thêm "${productName}" vào giỏ báo giá`)
  }

  return (
    <button
      onClick={handleAdd}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--gold)]',
        variant === 'solid'
          ? 'bg-[color:var(--gold)] text-black hover:bg-[color:var(--gold-strong)]'
          : 'border border-[color:var(--gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black',
        className
      )}
      aria-label={`Thêm sản phẩm ${productName} vào giỏ báo giá`}
    >
      <ShoppingCart size={14} />
      <span>{label || 'Thêm giỏ báo giá'}</span>
    </button>
  )
}
