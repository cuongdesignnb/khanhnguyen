'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { ChevronDown, MessageCircle, PhoneCall, Send, X } from 'lucide-react'

import { navigation as staticNavigation, siteConfig as staticSiteConfig } from '@/data/home'
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll'
import { PublicSiteConfig, PublicNavigationItem } from '@/types/public'

type MobileMenuDrawerProps = {
  open: boolean
  onClose: () => void
  siteConfig?: PublicSiteConfig
  navigation?: PublicNavigationItem[]
}

export default function MobileMenuDrawer({ open, onClose, siteConfig, navigation }: MobileMenuDrawerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const config = siteConfig || staticSiteConfig
  const displayNavigation = navigation || staticNavigation

  useLockBodyScroll(open)

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleClose])

  const toggleAccordion = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
            className="fixed inset-y-0 right-0 z-[60] flex w-[88vw] max-w-[380px] flex-col border-l border-[color:var(--line-gold)] bg-[color:var(--surface)] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-lg font-bold tracking-wide">
                <span className="text-[color:var(--gold)]">KHANH</span>
                <span className="text-[color:var(--text)]">&nbsp;NGUYEN</span>
              </span>

              <button
                type="button"
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--muted)] transition-colors hover:bg-white/5 hover:text-[color:var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                aria-label="Đóng menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Gold accent line */}
            <div className="h-0.5 bg-[color:var(--gold)]" aria-hidden="true" />

            {/* Navigation items */}
            <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-2" aria-label="Menu chính">
              <ul className="space-y-0">
                {displayNavigation.map((item, index) => {
                  const hasChildren = item.children && item.children.length > 0
                  const isExpanded = expandedIndex === index

                  return (
                    <li key={item.href} className="border-b border-white/5">
                      {hasChildren ? (
                        <>
                          {/* Parent item with accordion toggle */}
                          <button
                            type="button"
                            onClick={() => toggleAccordion(index)}
                            className="flex min-h-[48px] w-full items-center justify-between px-3 text-base font-medium text-[color:var(--text)] transition-colors hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                            aria-expanded={isExpanded}
                          >
                            {item.label}
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.25 }}
                              className="text-[color:var(--muted)]"
                            >
                              <ChevronDown size={18} />
                            </motion.span>
                          </button>

                          {/* Sub-items */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                {item.children?.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className="flex min-h-[42px] items-center pl-8 pr-3 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex min-h-[48px] items-center px-3 text-base font-medium text-[color:var(--text)] transition-colors hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Footer quick actions */}
            <div className="border-t border-white/5 px-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={`tel:${config.hotline.replace(/\s/g, '')}`}
                  className="flex flex-col items-center gap-1.5 rounded-lg bg-[color:var(--surface-3)] p-3 text-[color:var(--text)] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                >
                  <PhoneCall size={20} />
                  <span className="text-xs font-medium">Gọi ngay</span>
                </a>

                <a
                  href={(config as any).zaloLink || "https://zalo.me/0903385225"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-lg bg-[color:var(--surface-3)] p-3 text-[color:var(--text)] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                >
                  <MessageCircle size={20} />
                  <span className="text-xs font-medium">Zalo</span>
                </a>

                <a
                  href="#lien-he"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1.5 rounded-lg bg-[color:var(--surface-3)] p-3 text-[color:var(--gold)] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                >
                  <Send size={20} />
                  <span className="text-xs font-medium">Nhận tư vấn</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
