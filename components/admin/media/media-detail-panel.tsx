'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Copy, ExternalLink, RefreshCw, Save, Trash2, Upload } from 'lucide-react'
import AdminButton from '@/components/admin/admin-button'
import MediaImage from './media-image'
import { adminApi } from '@/lib/admin-api'
import { toast } from '@/lib/toast'
import type { MediaFileDto, MediaFolderDto } from '@/types/media'

export default function MediaDetailPanel({
  media,
  folders,
  onUpdated,
  onDeleted,
  onCheckHealth,
}: {
  media: MediaFileDto
  folders: MediaFolderDto[]
  onUpdated: (media: MediaFileDto) => void
  onDeleted: (id: string) => void
  onCheckHealth: () => void
}) {
  const [alt, setAlt] = useState(media.alt)
  const [title, setTitle] = useState(media.title)
  const [folderId, setFolderId] = useState(media.folderId || '')
  const [saving, setSaving] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const replaceInput = useRef<HTMLInputElement>(null)

  const save = async () => {
    setSaving(true)
    try {
      const updated = await adminApi.updateMedia(media.id, { alt, title, folderId: folderId || null })
      onUpdated(updated)
      toast.success('Đã lưu Alt text, tiêu đề và thư mục.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu Media.')
    } finally {
      setSaving(false)
    }
  }

  const replace = async (file: File) => {
    setReplacing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const updated = await adminApi.replaceMedia(media.id, formData)
      onUpdated(updated)
      toast.success('Đã thay file và giữ nguyên Media ID.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể thay thế file.')
    } finally {
      setReplacing(false)
      if (replaceInput.current) replaceInput.current.value = ''
    }
  }

  const remove = async () => {
    if (!window.confirm(`Chuyển “${media.originalName}” vào thùng rác? File đang được sử dụng sẽ bị chặn xóa.`)) return
    try {
      await adminApi.deleteMedia(media.id)
      onDeleted(media.id)
      toast.success('Đã chuyển Media vào thùng rác.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa Media.')
    }
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(media.url)
    toast.success('Đã sao chép URL Media.')
  }

  return (
    <aside className="space-y-4 rounded-xl border border-white/10 bg-[color:var(--surface)]/80 p-4 xl:sticky xl:top-20">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/20">
        <MediaImage key={media.url} src={media.url} alt={media.alt || media.originalName} type={media.type} missing={media.missing} className="object-contain" sizes="420px" />
      </div>
      {media.missing && (
        <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">
          File vật lý đang thiếu. Hãy dùng “Thay thế file” để giữ nguyên Media ID hoặc chạy kiểm tra toàn vẹn.
        </div>
      )}
      <div>
        <h2 className="break-all text-sm font-semibold">{media.originalName}</h2>
        <p className="mt-1 text-[10px] text-[color:var(--muted)]">{media.mimeType} · {media.sizeLabel} · {media.width && media.height ? `${media.width} × ${media.height}` : 'Không có kích thước'}</p>
      </div>
      <div className="space-y-3">
        <label className="block text-xs">URL<div className="mt-1 flex gap-1"><input readOnly value={media.url} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-2 py-2 font-mono text-[10px]" /><button type="button" aria-label="Sao chép URL" onClick={copyUrl} className="rounded-lg border border-white/10 p-2 text-[color:var(--gold)]"><Copy aria-hidden size={14} /></button></div></label>
        <label className="block text-xs">Alt text<input value={alt} onChange={(event) => setAlt(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none" /></label>
        <label className="block text-xs">Tiêu đề<input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none" /></label>
        <label className="block text-xs">Thư mục<select value={folderId} onChange={(event) => setFolderId(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-3 py-2 text-xs"><option value="">Chưa phân loại</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></label>
      </div>
      <AdminButton onClick={save} loading={saving} className="w-full"><Save aria-hidden size={14} /> Lưu thông tin</AdminButton>
      <div className="rounded-lg border border-white/10 p-3">
        <p className="mb-2 text-xs font-semibold">Nơi đang sử dụng</p>
        {media.usages.length ? <div className="space-y-1">{media.usages.map((usage) => usage.href ? <Link key={usage.type} href={usage.href} className="flex items-center justify-between text-xs text-[color:var(--gold)]"><span>{usage.label} ({usage.count})</span><ExternalLink aria-hidden size={12} /></Link> : <p key={usage.type} className="text-xs">{usage.label} ({usage.count})</p>)}</div> : <p className="text-xs text-[color:var(--muted)]">Chưa được sử dụng.</p>}
      </div>
      <input ref={replaceInput} type="file" className="hidden" accept="image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) void replace(file) }} />
      <div className="grid grid-cols-2 gap-2">
        <AdminButton variant="secondary" size="sm" loading={replacing} onClick={() => replaceInput.current?.click()}><Upload aria-hidden size={13} /> Thay thế file</AdminButton>
        <AdminButton variant="secondary" size="sm" onClick={onCheckHealth}><RefreshCw aria-hidden size={13} /> Kiểm tra</AdminButton>
        <AdminButton variant="danger" size="sm" className="col-span-2" onClick={remove}><Trash2 aria-hidden size={13} /> Xóa Media an toàn</AdminButton>
      </div>
    </aside>
  )
}
