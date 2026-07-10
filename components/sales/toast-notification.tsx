'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import clsx from 'clsx'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

// Global function to trigger a toast from anywhere (even inside non-react hooks/helper functions)
export function toast(message: string, type: ToastType = 'success') {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('toast', { detail: { message, type } })
    window.dispatchEvent(event)
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: ToastType }>
      if (customEvent.detail) {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast: ToastMessage = {
          id,
          message: customEvent.detail.message,
          type: customEvent.detail.type,
        }
        setToasts((prev) => [...prev, newToast])

        // Auto dismiss after 3 seconds
        setTimeout(() => {
          removeToast(id)
        }, 3000)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('toast', handleToastEvent)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('toast', handleToastEvent)
      }
    }
  }, [removeToast])

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 md:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-center justify-between gap-3 p-4 rounded-xl border pointer-events-auto',
            'bg-black/85 backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in',
            t.type === 'success' && 'border-[color:var(--success)]/40 text-[color:var(--success)]',
            t.type === 'error' && 'border-[color:var(--danger)]/40 text-[color:var(--danger)]',
            t.type === 'info' && 'border-[color:var(--gold)]/40 text-[color:var(--gold)]'
          )}
          style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && <CheckCircle2 size={18} className="shrink-0" />}
            {t.type === 'error' && <AlertCircle size={18} className="shrink-0" />}
            {t.type === 'info' && <Info size={18} className="shrink-0" />}
            <p className="text-sm font-semibold text-white leading-snug">{t.message}</p>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-white/40 hover:text-white transition-colors p-1 -mr-1"
            aria-label="Đóng thông báo"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
