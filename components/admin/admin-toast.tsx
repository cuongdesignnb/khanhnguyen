'use client'

import { useEffect, useState } from 'react'
import { toast, ToastMessage } from '@/lib/toast'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

export function AdminToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast])

      // Auto remove after 3.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
      }, 3500)
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        let Icon = Info
        let bgStyle = 'bg-zinc-900/90 border-zinc-700/50 text-white'
        let iconColor = 'text-zinc-400'

        if (t.type === 'success') {
          Icon = CheckCircle2
          bgStyle = 'bg-emerald-950/90 border-emerald-800/50 text-emerald-100 shadow-emerald-950/20'
          iconColor = 'text-emerald-400'
        } else if (t.type === 'error') {
          Icon = AlertCircle
          bgStyle = 'bg-rose-950/90 border-rose-800/50 text-rose-100 shadow-rose-950/20'
          iconColor = 'text-rose-400'
        } else if (t.type === 'warning') {
          Icon = AlertTriangle
          bgStyle = 'bg-amber-950/90 border-amber-800/50 text-amber-100 shadow-amber-950/20'
          iconColor = 'text-amber-400'
        }

        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-350 transform translate-y-0 scale-100 animate-slide-in pointer-events-auto`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium pr-2 leading-relaxed">{t.message}</div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-zinc-400 hover:text-white flex-shrink-0 transition-colors p-0.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
