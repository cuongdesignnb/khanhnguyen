'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/admin-modal'
import AdminButton from '@/components/admin/admin-button'
import { adminApi } from '@/lib/admin-api'
import { toast } from '@/lib/toast'
import type { MediaHealthReport } from '@/types/media'

export default function MediaHealthDialog({
  isOpen,
  onClose,
  report,
  loading,
  onRescan,
}: {
  isOpen: boolean
  onClose: () => void
  report: MediaHealthReport | null
  loading: boolean
  onRescan: () => Promise<void>
}) {
  const [repairing, setRepairing] = useState<string | null>(null)

  const repair = async (action: 'register-orphan' | 'delete-orphan', url: string) => {
    if (action === 'delete-orphan' && !window.confirm(`Xóa vĩnh viễn file orphan ${url} khỏi Docker volume?`)) return
    setRepairing(url)
    try {
      await adminApi.repairMediaHealth({ action, url })
      toast.success(action === 'register-orphan' ? 'Đã tạo bản ghi Media.' : 'Đã xóa file orphan.')
      await onRescan()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xử lý file orphan.')
    } finally {
      setRepairing(null)
    }
  }

  const download = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `media-health-${report.scannedAt.slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Kiểm tra ảnh lỗi" size="xl">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2"><AdminButton onClick={onRescan} loading={loading}>Quét lại</AdminButton><AdminButton variant="secondary" onClick={download} disabled={!report}>Tải báo cáo JSON</AdminButton></div>
        {report && <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[
            ['Media local', report.totalLocalMedia],
            ['Khỏe mạnh', report.healthy],
            ['Thiếu file', report.missingFiles],
            ['File orphan', report.orphanFiles],
          ].map(([label, value]) => <div key={String(label)} className="rounded-lg border border-white/10 p-3"><p className="text-xs text-[color:var(--muted)]">{label}</p><p className="text-xl font-bold">{value}</p></div>)}</div>
          <section><h3 className="mb-2 text-sm font-semibold">Có database nhưng thiếu file ({report.databaseOnly.length})</h3><div className="max-h-48 space-y-2 overflow-y-auto">{report.databaseOnly.map((entry) => <div key={entry.id || entry.url} className="rounded-lg border border-red-400/15 bg-red-500/5 p-2 text-xs"><p className="break-all">{entry.url}</p><p className="text-red-200">{entry.reason}</p></div>)}</div></section>
          <section><h3 className="mb-2 text-sm font-semibold">Có file nhưng thiếu database ({report.filesystemOnly.length})</h3><div className="max-h-56 space-y-2 overflow-y-auto">{report.filesystemOnly.map((entry) => <div key={entry.url} className="flex flex-col gap-2 rounded-lg border border-amber-400/15 bg-amber-500/5 p-2 text-xs sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="break-all">{entry.url}</p><p className="text-amber-200">{entry.reason}</p></div><div className="flex gap-1"><AdminButton size="sm" loading={repairing === entry.url} onClick={() => repair('register-orphan', entry.url)}>Tạo bản ghi</AdminButton><AdminButton variant="danger" size="sm" disabled={repairing === entry.url} onClick={() => repair('delete-orphan', entry.url)}>Xóa file</AdminButton></div></div>)}</div></section>
        </>}
      </div>
    </AdminModal>
  )
}
