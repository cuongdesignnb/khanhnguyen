'use client'

import { useCallback, useEffect, useRef } from 'react'
import { RefreshCw, Upload } from 'lucide-react'
import AdminButton from '@/components/admin/admin-button'
import AdminErrorState from '@/components/admin/admin-error-state'
import AdminLoading from '@/components/admin/admin-loading'
import AdminModal from '@/components/admin/admin-modal'
import MediaGrid from './media-grid'
import MediaToolbar from './media-toolbar'
import MediaUploadQueue from './media-upload-queue'
import { useMediaLibrary } from '@/hooks/use-media-library'
import { useMediaSelection } from '@/hooks/use-media-selection'
import { useMediaUpload } from '@/hooks/use-media-upload'
import { adminApi } from '@/lib/admin-api'
import type { MediaFileDto, MediaPickerProps, MediaType } from '@/types/media'

const defaultAcceptedTypes: MediaType[] = ['IMAGE']
const emptySelectedIds: string[] = []

export default function MediaLibraryDialog({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  maxSelect = multiple ? 20 : 1,
  acceptedTypes = defaultAcceptedTypes,
  initialSelectedIds = emptySelectedIds,
  folderId = null,
  usageContext,
}: MediaPickerProps) {
  const library = useMediaLibrary({
    type: acceptedTypes.length === 1 ? acceptedTypes[0] : '',
    folderId: folderId || '',
  })
  const selection = useMediaSelection({ multiple, maxSelect })
  const addUploadedToLibrary = library.addUploaded
  const addSelection = selection.add
  const resetSelection = selection.reset
  const inputRef = useRef<HTMLInputElement>(null)
  const onUploaded = useCallback((media: MediaFileDto) => {
    addUploadedToLibrary([media])
    addSelection([media])
  }, [addSelection, addUploadedToLibrary])
  const uploads = useMediaUpload({
    folderId: library.query.folderId && library.query.folderId !== 'unfiled' ? library.query.folderId : null,
    onUploaded,
  })

  useEffect(() => {
    if (!isOpen || !initialSelectedIds.length) return
    void adminApi.getMediaList({ ids: initialSelectedIds.join(','), page: 1, limit: Math.min(100, initialSelectedIds.length) })
      .then((result) => resetSelection(result.items))
      .catch(() => resetSelection([]))
  }, [initialSelectedIds, isOpen, resetSelection])

  const acceptedMime = acceptedTypes.includes('DOCUMENT')
    ? 'image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf'
    : 'image/jpeg,image/png,image/webp,image/avif,image/gif'

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Media Library" size="full" contentClassName="!overflow-hidden !p-0">
      <div className="flex h-[min(78vh,760px)] min-h-0 flex-col" onPaste={(event) => { const files = Array.from(event.clipboardData.files); if (files.length) uploads.addFiles(files) }}>
        <input ref={inputRef} type="file" multiple accept={acceptedMime} className="hidden" onChange={(event) => { if (event.target.files) uploads.addFiles(event.target.files); event.target.value = '' }} />
        <div className="shrink-0 space-y-3 border-b border-white/10 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="text-xs text-[color:var(--muted)]">{multiple ? `Chọn tối đa ${maxSelect} file` : 'Chọn một file'}{usageContext ? ` · Ngữ cảnh: ${usageContext}` : ''}</p></div>
            <div className="flex gap-2"><AdminButton variant="secondary" size="sm" onClick={library.reload}><RefreshCw aria-hidden size={13} /> Làm mới</AdminButton><AdminButton size="sm" onClick={() => inputRef.current?.click()}><Upload aria-hidden size={13} /> Tải nhiều file</AdminButton></div>
          </div>
          <MediaToolbar compact query={library.query} onChange={library.setQuery} />
          <label className="block text-xs text-[color:var(--muted)]">Thư mục<select aria-label="Thư mục Media" value={library.query.folderId} onChange={(event) => library.setQuery({ folderId: event.target.value })} className="ml-2 rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-2 py-1.5 text-xs text-white"><option value="">Tất cả</option><option value="unfiled">Chưa phân loại</option>{library.folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name} ({folder.fileCount})</option>)}</select></label>
        </div>
        {uploads.queue.length > 0 && <div className="max-h-64 shrink-0 overflow-y-auto border-b border-white/10 p-3"><MediaUploadQueue queue={uploads.queue} successCount={uploads.successCount} errorCount={uploads.errorCount} onRetry={uploads.retry} onCancel={uploads.cancel} onRemove={uploads.remove} onClearCompleted={uploads.clearCompleted} /></div>}
        <div
          onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy' }}
          onDrop={(event) => { event.preventDefault(); uploads.addFiles(event.dataTransfer.files) }}
          className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4"
        >
          {library.loading ? <AdminLoading type="grid" count={15} /> : library.error ? <AdminErrorState message={library.error} onRetry={library.reload} /> : <><MediaGrid media={library.items} selectedIds={new Set(selection.selected.keys())} onSelect={selection.toggle} />{library.meta.page < library.meta.totalPages && <div className="mt-4 text-center"><AdminButton size="sm" loading={library.loadingMore} onClick={library.loadMore}>Tải thêm</AdminButton></div>}</>}
        </div>
        <div className="shrink-0 border-t border-white/10 bg-[color:var(--surface)] px-3 py-3 sm:px-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0"><p className="text-xs">Đã chọn {selection.selected.size}/{maxSelect} file</p>{selection.selectedItems.length > 0 && <div className="mt-1 flex max-w-full gap-1 overflow-x-auto">{selection.selectedItems.map((item) => <span key={item.id} title={item.originalName} className="max-w-28 shrink-0 truncate rounded-md bg-white/5 px-2 py-1 text-[10px]">{item.originalName}</span>)}</div>}</div>
            <div className="flex shrink-0 gap-2"><AdminButton variant="secondary" onClick={onClose}>Hủy</AdminButton><AdminButton disabled={!selection.selected.size || uploads.active} onClick={() => { onSelect?.(selection.selectedItems); onClose() }}>Chọn {multiple ? 'Media' : 'ảnh'}</AdminButton></div>
          </div>
        </div>
      </div>
    </AdminModal>
  )
}
