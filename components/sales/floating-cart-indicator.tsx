'use client'

import { ShoppingCart } from 'lucide-react'
import { useSalesContext } from './sales-provider'
import Link from 'next/link'
import clsx from 'clsx'

export default function FloatingCartIndicator() {
  const { cartCount } = useSalesContext()

  if (cartCount === 0) return null

  return (
    <Link
      href="/gio-bao-gia"
      className={clsx(
        'fixed bottom-6 right-6 z-[60] hidden md:flex items-center justify-center size-14 rounded-full shadow-2xl transition-all duration-300 active:scale-95 group',
        'bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black border border-[color:var(--line-gold)]'
      )}
      style={{ boxShadow: '0 8px 30px rgba(212,175,55,0.3)' }}
      aria-label={`Xem giỏ báo giá, có ${cartCount} sản phẩm`}
    >
      <div className="relative">
        <ShoppingCart size={24} className="group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute -top-3 -right-3 flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-black text-white bg-red-600 border border-[color:var(--surface)]">
          {cartCount}
        </span>
      </div>
    </Link>
  )
}
