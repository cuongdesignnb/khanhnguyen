'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import { navigation as staticNavigation } from '@/data/home'
import { PublicNavigationItem } from '@/types/public'

function NavItemWithDropdown({
  item,
  isActive,
}: {
  item: PublicNavigationItem
  isActive: boolean
}) {
  const [open, setOpen] = useState(false)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleOpen = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setOpen(false)
    }, 150)
  }, [])

  const hasChildren = item.children && item.children.length > 0

  return (
    <div
      className="relative"
      onMouseEnter={hasChildren ? handleOpen : undefined}
      onMouseLeave={hasChildren ? handleClose : undefined}
    >
      <Link
        href={item.href}
        onFocus={hasChildren ? handleOpen : undefined}
        onBlur={hasChildren ? handleClose : undefined}
        className={clsx(
          'inline-flex items-center gap-1 px-3 py-4 text-sm font-medium transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]',
          isActive
            ? 'text-[color:var(--gold)] border-b-2 border-[color:var(--gold)]'
            : 'text-[color:var(--silver)] hover:text-[color:var(--gold)]'
        )}
      >
        {item.label}
        {hasChildren && (
          <ChevronDown
            size={14}
            className={clsx(
              'transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        )}
      </Link>

      {hasChildren && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full z-50 mt-0 min-w-[220px] rounded-lg border border-[color:var(--line-gold)] bg-[color:var(--surface-2)] shadow-xl"
              onMouseEnter={handleOpen}
              onMouseLeave={handleClose}
            >
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onFocus={handleOpen}
                  onBlur={handleClose}
                  className={clsx(
                    'block px-4 py-2.5 text-sm font-medium text-[color:var(--silver)] transition-colors',
                    'first:rounded-t-lg last:rounded-b-lg',
                    'hover:bg-[color:var(--surface-3)] hover:text-[color:var(--gold)]',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]'
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

interface SiteNavigationProps {
  navigation?: PublicNavigationItem[]
}

export default function SiteNavigation({ navigation }: SiteNavigationProps) {
  const displayNavigation = navigation || staticNavigation

  return (
    <nav
      aria-label="Thanh điều hướng chính"
      className="hidden lg:block border-b border-white/5 bg-[color:var(--surface-2)]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1">
          {displayNavigation.map((item, index) => (
            <NavItemWithDropdown
              key={item.href}
              item={item}
              isActive={index === 0} // Active if home page/first item
            />
          ))}
        </div>
      </div>
    </nav>
  )
}
