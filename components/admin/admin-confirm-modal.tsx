'use client'

import AdminModal from './admin-modal'
import AdminButton from './admin-button'
import { AlertTriangle } from 'lucide-react'

interface AdminConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export default function AdminConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  description = 'Bạn có chắc chắn muốn xóa mục này? Thao tác này không thể hoàn tác.',
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy',
  loading = false,
  variant = 'danger',
}: AdminConfirmModalProps) {
  const isDanger = variant === 'danger'
  const isWarning = variant === 'warning'

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6 pt-2">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDanger
                ? 'bg-rose-500/10 text-rose-500'
                : isWarning
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-blue-500/10 text-blue-500'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-base leading-tight">
              {title}
            </h3>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
          <AdminButton
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </AdminButton>
          <AdminButton
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  )
}
