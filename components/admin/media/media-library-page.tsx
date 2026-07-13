'use client'

import { useCallback, useRef, useState } from 'react'
import { FolderPlus, RefreshCw, ShieldCheck, Upload } from 'lucide-react'
import AdminButton from '@/components/admin/admin-button'
import AdminErrorState from '@/components/admin/admin-error-state'
import AdminLoading from '@/components/admin/admin-loading'
import AdminPageHeader from '@/components/admin/admin-page-header'
import MediaDetailPanel from './media-detail-panel'
import MediaFolderTree from './media-folder-tree'
import MediaGrid from './media-grid'
import MediaHealthDialog from './media-health-dialog'
import MediaToolbar from './media-toolbar'
import MediaUploadQueue from './media-upload-queue'
import { useMediaLibrary } from '@/hooks/use-media-library'
import { useMediaUpload } from '@/hooks/use-media-upload'
import { adminApi } from '@/lib/admin-api'
import { toast } from '@/lib/toast'
import type { MediaFileDto, MediaFolderDto, MediaHealthReport } from '@/types/media'

export default function MediaLibraryPage() {
  const library = useMediaLibrary({ type: 'IMAGE' })
  const [selected, setSelected] = useState<MediaFileDto | null>(null)
  const [healthOpen, setHealthOpen] = useState(false)
  const [healthLoading, setHealthLoading] = useState(false)
  const [healthReport, setHealthReport] = useState<MediaHealthReport | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const onUploaded = useCallback((media: MediaFileDto) => {
    library.addUploaded([media])
    setSelected(media)
  }, [library])
  const uploads = useMediaUpload({ folderId: library.query.folderId && library.query.folderId !== 'unfiled' ? library.query.folderId : null, onUploaded })

  const createFolder = async (name: string) => {
    try {
      await adminApi.createMediaFolder({ name })
      await library.loadFolders()
      toast.success('Đã tạo thư mục Media.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tạo thư mục.')
    }
  }

  const renameFolder = async (id: string, name: string) => {
    try {
      await adminApi.updateMediaFolder(id, { name })
      await library.loadFolders()
      toast.success('Đã đổi tên thư mục.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể đổi tên thư mục.')
    }
  }

  const deleteFolder = async (folder: MediaFolderDto) => {
    if (!window.confirm(`Xóa thư mục “${folder.name}”? Chỉ thư mục trống mới được xóa.`)) return
    try {
      await adminApi.deleteMediaFolder(folder.id)
      if (library.query.folderId === folder.id) library.setQuery({ folderId: '' })
      await library.loadFolders()
      toast.success('Đã xóa thư mục Media.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa thư mục.')
    }
  }

  const scanHealth = async () => {
    setHealthOpen(true)
    setHealthLoading(true)
    try {
      setHealthReport(await adminApi.scanMediaHealth())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể kiểm tra Media.')
    } finally {
      setHealthLoading(false)
    }
  }

  const selectedIds = new Set(selected ? [selected.id] : [])

  return (
    <div onPaste={(event) => { const files = Array.from(event.clipboardData.files); if (files.length) uploads.addFiles(files) }}>
      <input ref={fileInput} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf" className="hidden" onChange={(event) => { if (event.target.files) uploads.addFiles(event.target.files); event.target.value = '' }} />
      <AdminPageHeader
        title="Media Library"
        breadcrumbs={[{ label: 'Trang chủ', href: '/admin' }, { label: 'Media Library' }]}
        actions={<div className="flex flex-wrap gap-2"><AdminButton onClick={() => fileInput.current?.click()}><Upload aria-hidden size={15} /> Tải ảnh</AdminButton><AdminButton variant="secondary" onClick={() => void createFolder('Thư mục mới')}><FolderPlus aria-hidden size={15} /> Tạo thư mục</AdminButton><AdminButton variant="secondary" onClick={scanHealth}><ShieldCheck aria-hidden size={15} /> Kiểm tra ảnh lỗi</AdminButton></div>}
      />

      <div
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy' }}
        onDrop={(event) => { event.preventDefault(); uploads.addFiles(event.dataTransfer.files) }}
        className="mb-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 text-center text-xs text-[color:var(--muted)]"
      >
        Kéo thả tối đa 20 file vào đây, dán ảnh từ clipboard hoặc bấm “Tải ảnh”. Mỗi file tối đa 20 MB và được gửi bằng request riêng, tối đa 3 file đồng thời.
      </div>

      <div className="mb-4"><MediaUploadQueue queue={uploads.queue} successCount={uploads.successCount} errorCount={uploads.errorCount} onRetry={uploads.retry} onCancel={uploads.cancel} onRemove={uploads.remove} onClearCompleted={uploads.clearCompleted} /></div>

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_340px]">
        <div className="hidden xl:block"><MediaFolderTree folders={library.folders} selectedFolderId={library.query.folderId} onSelect={(folderId) => library.setQuery({ folderId })} onCreate={createFolder} onRename={renameFolder} onDelete={deleteFolder} /></div>
        <main className="min-w-0 space-y-4">
          <details className="rounded-xl border border-white/10 p-3 xl:hidden"><summary className="cursor-pointer text-sm font-semibold">Thư mục Media</summary><div className="mt-3"><MediaFolderTree folders={library.folders} selectedFolderId={library.query.folderId} onSelect={(folderId) => library.setQuery({ folderId })} onCreate={createFolder} onRename={renameFolder} onDelete={deleteFolder} /></div></details>
          <MediaToolbar query={library.query} onChange={library.setQuery} />
          {library.loading ? <AdminLoading type="grid" count={12} /> : library.error ? <AdminErrorState message={library.error} onRetry={library.reload} /> : <MediaGrid media={library.items} selectedIds={selectedIds} onSelect={setSelected} />}
          {!library.loading && !library.error && <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-[color:var(--muted)]"><span>Hiển thị {library.items.length}/{library.meta.total} file</span><div className="flex gap-2"><AdminButton variant="secondary" size="sm" onClick={library.reload}><RefreshCw aria-hidden size={13} /> Làm mới</AdminButton>{library.meta.page < library.meta.totalPages && <AdminButton size="sm" loading={library.loadingMore} onClick={library.loadMore}>Tải thêm</AdminButton>}</div></div>}
        </main>
        <div>{selected ? <MediaDetailPanel key={`${selected.id}-${selected.updatedAt}`} media={selected} folders={library.folders} onUpdated={(updated) => { setSelected(updated); library.updateItem(updated) }} onDeleted={(id) => { setSelected(null); library.removeItem(id) }} onCheckHealth={scanHealth} /> : <div className="rounded-xl border border-dashed border-white/10 px-5 py-16 text-center text-sm text-[color:var(--muted)]">Chọn một file để xem chi tiết, sửa Alt/Title, thay thế hoặc xóa an toàn.</div>}</div>
      </div>
      <MediaHealthDialog isOpen={healthOpen} onClose={() => setHealthOpen(false)} report={healthReport} loading={healthLoading} onRescan={scanHealth} />
    </div>
  )
}
