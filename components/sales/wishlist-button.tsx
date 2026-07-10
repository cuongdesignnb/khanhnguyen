'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import clsx from 'clsx'
import { useSalesContext } from './sales-provider'
import { toast } from './toast-notification'

interface WishlistButtonProps {
  productId: string
  productName: string
  showText?: boolean
  className?: string
}

export default function WishlistButton({
  productId,
  productName,
  showText = false,
  className,
}: WishlistButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { wishlist, addToWishlist, removeFromWishlist } = useSalesContext()
  const active = wishlist.includes(productId)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    setLoading(true)

    try {
      const response = await fetch(
        active ? `/api/customer/wishlist/${productId}` : '/api/customer/wishlist',
        {
          method: active ? 'DELETE' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: active ? undefined : JSON.stringify({ productId }),
        }
      )

      const result = await response.json().catch(() => null)

      if (response.status === 401) {
        router.push(`/dang-nhap?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || 'Không thể cập nhật yêu thích')
      }

      if (active) {
        removeFromWishlist(productId)
        toast(`Đã xóa "${productName}" khỏi yêu thích`, 'info')
      } else {
        addToWishlist(productId)
        toast(`Đã thêm "${productName}" vào yêu thích`)
      }
      router.refresh()
    } catch (error: any) {
      alert(error?.message || 'Không thể cập nhật yêu thích')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-60',
        showText
          ? 'px-4 py-2.5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm'
          : 'p-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-white hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]',
        active && 'text-[color:var(--gold)] border-[color:var(--gold)]/40 bg-[color:var(--gold)]/5',
        className
      )}
      title={active ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      aria-label={active ? `Xóa ${productName} khỏi danh sách yêu thích` : `Thêm ${productName} vào danh sách yêu thích`}
    >
      <Heart
        size={18}
        className={clsx('transition-transform duration-300', active ? 'fill-[color:var(--gold)] scale-110' : 'scale-100')}
      />
      {showText && <span>{active ? 'Đã yêu thích' : 'Yêu thích'}</span>}
    </button>
  )
}
