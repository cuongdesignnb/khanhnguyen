'use client'

import { Ban, CheckCircle2, RefreshCw, Trash2, XCircle } from 'lucide-react'
import type { MediaUploadItem, MediaUploadStatus } from '@/types/media'

const statusLabel: Record<MediaUploadStatus, string> = {
  queued: 'Đang chờ',
  validating: 'Đang kiểm tra',
  uploading: 'Đang tải lên',
  processing: 'Đang xử lý ảnh',
  success: 'Thành công',
  error: 'Lỗi',
  cancelled: 'Đã hủy',
}

export default function MediaUploadQueue({
  queue,
  successCount,
  errorCount,
  onRetry,
  onCancel,
  onRemove,
  onClearCompleted,
}: {
  queue: MediaUploadItem[]
  successCount: number
  errorCount: number
  onRetry: (id: string) => void
  onCancel: (id: string) => void
  onRemove: (id: string) => void
  onClearCompleted: () => void
}) {
  if (!queue.length) return null
  return (
    <section aria-label="Hàng đợi tải Media" className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Tiến trình tải file</h3>
          <p className="text-xs text-[color:var(--muted)]">{successCount}/{queue.length} file thành công{errorCount ? ` · ${errorCount} file lỗi` : ''}</p>
        </div>
        <button type="button" onClick={onClearCompleted} className="text-xs text-[color:var(--gold)]">Dọn file đã xong</button>
      </div>
      <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
        {queue.map((item) => (
          <article key={item.id} className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-white/5 bg-white/[0.025] p-2">
            <div className="grid size-10 place-items-center overflow-hidden rounded-md bg-white/5 text-[10px] text-[color:var(--muted)]">
              {item.previewUrl ? <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${item.previewUrl})` }} /> : 'FILE'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2"><span className="truncate text-xs">{item.file.name}</span><span className="shrink-0 text-[10px] text-[color:var(--muted)]">{(item.file.size / 1024).toFixed(1)} KB</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full transition-all ${item.status === 'error' ? 'bg-red-400' : 'bg-[color:var(--gold)]'}`} style={{ width: `${item.progress}%` }} /></div>
              <p className={`mt-1 text-[10px] ${item.status === 'error' ? 'text-red-300' : 'text-[color:var(--muted)]'}`}>{item.error || statusLabel[item.status]}</p>
            </div>
            <div className="flex items-center gap-1">
              {item.status === 'success' && <CheckCircle2 aria-label="Thành công" size={16} className="text-emerald-400" />}
              {item.status === 'error' && <><XCircle aria-label="Lỗi" size={16} className="text-red-400" /><button type="button" aria-label={`Thử lại ${item.file.name}`} onClick={() => onRetry(item.id)} className="p-1 text-[color:var(--gold)]"><RefreshCw aria-hidden size={14} /></button></>}
              {['queued', 'validating', 'uploading'].includes(item.status) && <button type="button" aria-label={`Hủy ${item.file.name}`} onClick={() => onCancel(item.id)} className="p-1 text-amber-300"><Ban aria-hidden size={14} /></button>}
              {!['uploading', 'processing'].includes(item.status) && <button type="button" aria-label={`Xóa ${item.file.name} khỏi hàng đợi`} onClick={() => onRemove(item.id)} className="p-1 text-[color:var(--muted)]"><Trash2 aria-hidden size={14} /></button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
