'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import AdminButton from './admin-button'

interface AdminErrorStateProps {
  message?: string
  onRetry?: () => void
  usingFallback?: boolean
}

export default function AdminErrorState({
  message = 'Đã xảy ra lỗi khi tải dữ liệu.',
  onRetry,
  usingFallback = false,
}: AdminErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-white/5 bg-[color:var(--surface)]/40 rounded-2xl text-center space-y-4 max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-white">Lỗi tải dữ liệu</h4>
        <p className="text-sm text-[color:var(--muted)] leading-relaxed">
          {message}
        </p>
        {usingFallback && (
          <p className="text-xs text-amber-400 font-medium">
            Đang hiển thị dữ liệu tạm từ hệ thống
          </p>
        )}
      </div>
      {onRetry && (
        <AdminButton
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Thử lại
        </AdminButton>
      )}
    </div>
  )
}
