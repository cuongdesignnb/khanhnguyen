'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

export default function WishlistButton({
  productId,
  initialActive = false,
  label = true,
}: {
  productId: string
  initialActive?: boolean
  label?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState(initialActive)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/customer/wishlist', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        })
        if (response.ok) {
          const result = await response.json()
          if (result.success && Array.isArray(result.data)) {
            const isWishlisted = result.data.some((item: any) => item.productId === productId)
            setActive(isWishlisted)
          }
        }
      } catch (e) {
        // Ignore
      }
    }
    checkStatus()
  }, [productId])

  async function toggleWishlist() {
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
        router.replace(`/dang-nhap?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || 'Không thể cập nhật yêu thích')
      }

      setActive(!active)
      router.refresh()
    } catch (error: any) {
      alert(error?.message || 'Không thể cập nhật yêu thích')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggleWishlist}
      className={
        active
          ? 'inline-flex items-center justify-center gap-2 rounded-xl border border-[color:var(--gold)] bg-[color:var(--gold)] px-4 py-3 text-sm font-bold text-black transition disabled:opacity-60 cursor-pointer'
          : 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-bold text-[color:var(--silver)] transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:opacity-60 cursor-pointer'
      }
    >
      <Heart size={16} fill={active ? 'currentColor' : 'none'} />
      {label && (active ? 'Đã yêu thích' : 'Yêu thích')}
    </button>
  )
}
