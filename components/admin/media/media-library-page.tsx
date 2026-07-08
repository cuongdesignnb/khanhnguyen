'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import MediaGrid from './media-grid'
import { adminMedia } from '@/data/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapMediaToItem } from '@/lib/admin-mappers'
import AdminConfirmModal from '@/components/admin/admin-confirm-modal'
import { toast } from '@/lib/toast'
import AdminLoading from '@/components/admin/admin-loading'
import AdminErrorState from '@/components/admin/admin-error-state'
import {
  Search,
  Upload,
  Eye,
  Trash2,
  Copy,
  X,
  RefreshCw,
} from 'lucide-react'
import type { MediaItem } from '@/types/admin'

export default function MediaLibraryPage() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [savingAlt, setSavingAlt] = useState(false)
  const [altText, setAltText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    items: mediaList,
    loading,
    error,
    params,
    setParams,
    reload,
    usingFallback,
  } = useAdminList<any, MediaItem>({
    fetcher: adminApi.getMediaList,
    initialParams: { page: 1, limit: 30, q: '', type: '', format: '' },
    fallbackData: adminMedia,
    mapItem: mapMediaToItem,
  })

  const { mutate: uploadFile, loading: uploading } = useAdminMutation(
    adminApi.uploadMedia,
    {
      successMessage: 'Tải ảnh lên thành công',
      onSuccess: () => {
        reload()
      },
    }
  )

  const { mutate: deleteFile, loading: deleting } = useAdminMutation(
    adminApi.deleteMedia,
    {
      successMessage: 'Xóa ảnh thành công',
      onSuccess: () => {
        setDeleteModalOpen(false)
        setSelectedMedia(null)
        reload()
      },
    }
  )

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      await uploadFile(formData)
    } catch (err) {
      // Error handled by mutation hook
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSaveAlt = async () => {
    if (!selectedMedia) return
    setSavingAlt(true)
    try {
      await adminApi.updateMedia(selectedMedia.id, { alt: altText })
      toast.success('Lưu mô tả ảnh thành công')
      setSelectedMedia((prev) => prev ? { ...prev, alt: altText } : null)
      reload()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi lưu mô tả')
    } finally {
      setSavingAlt(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép liên kết vào bộ nhớ tạm')
  }

  const selectMediaItem = (item: MediaItem) => {
    setSelectedMedia(item)
    setAltText(item.alt)
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <AdminPageHeader
        title="Media Library"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Media Library' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton
              icon={<Upload className="w-4 h-4" />}
              loading={uploading}
              onClick={handleUploadClick}
            >
              Upload ảnh
            </AdminButton>
          </div>
        }
      />

      {usingFallback && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs rounded-xl flex items-center justify-between">
          <span>Đang sử dụng dữ liệu tạm. Vui lòng kiểm tra kết nối database.</span>
          <button onClick={reload} className="p-1 hover:bg-white/5 rounded-lg text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Grid */}
        <div className="xl:col-span-2">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px] flex items-center bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-[color:var(--muted)]" />
              <input
                type="text"
                value={params.q || ''}
                onChange={(e) => setParams({ q: e.target.value })}
                placeholder="Tìm kiếm ảnh..."
                className="bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none flex-1"
              />
            </div>
            <select
              value={params.type || ''}
              onChange={(e) => setParams({ type: e.target.value })}
              className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer"
            >
              <option value="">Tất cả loại</option>
              <option value="product">Sản phẩm</option>
              <option value="service">Dịch vụ</option>
              <option value="hero">Hero</option>
              <option value="post">Tin tức</option>
            </select>
            <select
              value={params.format || ''}
              onChange={(e) => setParams({ format: e.target.value })}
              className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer"
            >
              <option value="">Tất cả định dạng</option>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="svg">SVG</option>
            </select>
          </div>

          {/* Grid Loading/Error/List */}
          {loading ? (
            <AdminLoading type="grid" count={12} />
          ) : error && !usingFallback ? (
            <AdminErrorState message={error} onRetry={reload} />
          ) : (
            <MediaGrid
              media={mediaList}
              selectedId={selectedMedia?.id ?? null}
              onSelect={selectMediaItem}
            />
          )}
        </div>

        {/* Detail Panel */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5 self-start sticky top-20">
          {selectedMedia ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[color:var(--silver)]">Chi tiết ảnh</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-[color:var(--muted)] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-white/5 bg-black/20">
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  fill
                  className="object-contain"
                  sizes="400px"
                />
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-[color:var(--muted)] mb-1 block">URL</label>
                  <div className="flex items-center gap-2 bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2">
                    <span className="text-xs text-[color:var(--silver)] truncate flex-1 font-mono">
                      {selectedMedia.src}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedMedia.src)}
                      className="text-[color:var(--muted)] hover:text-[color:var(--gold)] cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)] mb-1 block">Mô tả (Alt text)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      className="flex-1 bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-[color:var(--text)] outline-none focus:border-[color:var(--gold)]/50"
                    />
                    <AdminButton
                      size="sm"
                      onClick={handleSaveAlt}
                      loading={savingAlt}
                      disabled={altText === selectedMedia.alt}
                    >
                      Lưu
                    </AdminButton>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <div>
                    <div className="text-[10px] text-[color:var(--muted)] mb-0.5">Loại</div>
                    <div className="text-xs text-[color:var(--silver)] capitalize">{selectedMedia.type || 'Khác'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[color:var(--muted)] mb-0.5">Định dạng</div>
                    <div className="text-xs text-[color:var(--silver)] uppercase">{selectedMedia.format}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[color:var(--muted)] mb-0.5">Dung lượng</div>
                    <div className="text-xs text-[color:var(--silver)]">{selectedMedia.size}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[color:var(--muted)] mb-0.5">Ngày upload</div>
                    <div className="text-xs text-[color:var(--silver)]">{selectedMedia.uploadedAt}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <AdminButton
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyToClipboard(selectedMedia.src)}
                >
                  <Copy className="w-3.5 h-3.5" /> Copy link
                </AdminButton>
                <AdminButton
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Eye className="w-10 h-10 text-[color:var(--muted)] mb-3" />
              <p className="text-sm text-[color:var(--muted)]">
                Chọn một ảnh để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>

      <AdminConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedMedia) deleteFile(selectedMedia.id)
        }}
        loading={deleting}
        title="Xóa hình ảnh"
        description="Bạn có chắc chắn muốn xóa ảnh này khỏi thư viện? Hình ảnh đã liên kết với sản phẩm hoặc tin tức có thể bị ảnh hưởng."
      />
    </div>
  )
}
