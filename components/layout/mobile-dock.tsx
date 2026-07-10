'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, MessageCircle, PhoneCall, ShoppingCart } from 'lucide-react'
import clsx from 'clsx'
import { siteConfig } from '@/data/home'
import { useSalesContext } from '../sales/sales-provider'

type MobileDockProps = {
  onMenuOpen: () => void
}

type DockItem = {
  key: string
  label: string
  icon: React.ReactNode
  highlighted?: boolean
} & (
  | { type: 'link'; href: string }
  | { type: 'external'; href: string }
  | { type: 'button'; onClick: () => void }
)

export default function MobileDock({ onMenuOpen }: MobileDockProps) {
  const { cartCount } = useSalesContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const items: DockItem[] = [
    {
      key: 'call',
      label: 'Gọi ngay',
      icon: <PhoneCall size={22} />,
      type: 'external',
      href: `tel:${siteConfig.hotline.replace(/\s/g, '')}`,
    },
    {
      key: 'consult',
      label: 'Tư vấn',
      icon: <MessageCircle size={22} />,
      type: 'link',
      href: '#lien-he',
    },
    {
      key: 'menu',
      label: 'Danh mục',
      icon: <Menu size={22} />,
      type: 'button',
      onClick: onMenuOpen,
      highlighted: true,
    },
    {
      key: 'cart',
      label: 'Giỏ hàng',
      icon: <ShoppingCart size={22} />,
      type: 'link',
      href: '/gio-hang',
    },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[70] border-t border-[color:var(--line-gold)] bg-[#0a0a0a] lg:hidden mobile-safe-bottom"
      style={{ height: 68, boxShadow: '0 -10px 30px rgba(0,0,0,0.35)' }}
    >
      <nav className="mx-auto flex h-full max-w-lg items-stretch" aria-label="Thanh thao tác nhanh">
        {items.map((item) => {
          const colorClass = item.highlighted
            ? 'text-[color:var(--gold)]'
            : 'text-[color:var(--muted)]'

          const baseClasses = clsx(
            'relative flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-transform active:scale-95',
            colorClass,
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]'
          )

          if (item.type === 'button') {
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className={baseClasses}
                aria-label={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          }

          if (item.type === 'external') {
            return (
              <a
                key={item.key}
                href={item.href}
                className={baseClasses}
                aria-label={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            )
          }

          // type === 'link'
          return (
            <Link
              key={item.key}
              href={item.href}
              className={clsx(baseClasses, 'relative')}
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>

              {/* Cart badge */}
              {item.key === 'cart' && (
                <span
                  className="absolute right-1/2 top-2 -mr-4 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--gold)] px-1 text-[9px] font-bold text-[color:var(--bg)]"
                  aria-label={`${mounted ? cartCount : 0} sản phẩm trong giỏ hàng`}
                >
                  {mounted ? cartCount : 0}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
