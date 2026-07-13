'use client'

import React from 'react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  contentClassName?: string
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
}

export default function AdminModal({ isOpen, onClose, title, children, size = 'md', contentClassName }: AdminModalProps) {
  const titleId = React.useId()

  React.useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={clsx(
                'bg-[color:var(--surface)] border border-white/10 rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col max-h-[90vh]',
                sizeClasses[size],
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
                <h2 id={titleId} className="text-lg font-semibold text-[color:var(--text)]">{title}</h2>
                <button
                  aria-label="Đóng"
                  onClick={onClose}
                  className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className={clsx('p-6 overflow-y-auto flex-1', contentClassName)}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
