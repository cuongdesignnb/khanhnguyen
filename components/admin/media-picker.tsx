'use client'

import { useState, useRef } from 'react'
import AdminModal from './admin-modal'
import { adminMedia } from '@/data/admin'
import Image from 'next/image'
import AdminButton from './admin-button'
import { Search, Check, Upload, RefreshCw } from 'lucide-react'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapMediaToItem } from '@/lib/admin-mappers'
import type { MediaItem } from '@/types/admin'
import AdminLoading from './admin-loading'

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (items: MediaItem[]) => void
  multiple?: boolean
}

const tabs = ['Tất cả', 'Sản phẩm', 'Dịch vụ', 'Tin tức']
const tabTypeMap: Record<number, string | null> = {
  0: null,
  1: 'product',
  2: 'service',
  3: 'post',
}

const selectClass =
  'bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] appearance-none focus:outline-none focus:border-[color:var(--gold)]/50'

export default function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const typeFilter = tabTypeMap[activeTab] || undefined

  const {
    items: mediaList,
    loading,
    params,
    setParams,
    reload,
    usingFallback,
  } = useAdminList<any, MediaItem>({
    fetcher: adminApi.getMediaList,
    initialParams: { page: 1, limit: 30, q: '', type: typeFilter || '', format: '' },
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

  // Reload when tab changes
  const handleTabChange = (idx: number) => {
    setActiveTab(idx)
    const type = tabTypeMap[idx] || ''
    setParams({ type, page: 1 })
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!multiple) {
          next.clear()
        }
        next.add(id)
      }
      return next
    })
  }

  const handleSelect = () => {
    const selected = mediaList.filter((item) => selectedIds.has(item.id))
    // Fallback search if not found in current page items
    if (selected.length < selectedIds.size) {
      const allPossible = [...mediaList, ...adminMedia]
      const selectedMap = new Map(allPossible.map((m) => [m.id, m]))
      const finalSelected: MediaItem[] = []
      selectedIds.forEach((id) => {
        const item = selectedMap.get(id)
        if (item) finalSelected.push(item)
      })
      onSelect?.(finalSelected)
    } else {
      onSelect?.(selected)
    }
    onClose()
  }

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

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Media Library" size="xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/10 mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => handleTabChange(idx)}
            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
              activeTab === idx
                ? 'text-[color:var(--gold)] border-b-2 border-[color:var(--gold)]'
                : 'text-[color:var(--muted)] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex gap-3 mb-4 items-center">
        <div className="flex-1 bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-[color:var(--muted)]" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={params.q || ''}
            onChange={(e) => setParams({ q: e.target.value })}
            className="bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:outline-none flex-1"
          />
        </div>
        <select
          value={params.format || ''}
          onChange={(e) => setParams({ format: e.target.value })}
          className={selectClass}
        >
          <option value="">Tất cả</option>
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
          <option value="svg">SVG</option>
        </select>
        <AdminButton
          variant="secondary"
          size="sm"
          icon={<Upload className="w-3.5 h-3.5" />}
          loading={uploading}
          onClick={handleUploadClick}
        >
          Upload
        </AdminButton>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[350px] overflow-y-auto pr-1">
          {mediaList.map((item) => {
            const isSelected = selectedIds.has(item.id)
            return (
              <div
                key={item.id}
                onClick={() => toggleSelection(item.id)}
                className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer group border-2 ${
                  isSelected
                    ? 'border-[color:var(--gold)] shadow-lg shadow-[color:var(--gold)]/10'
                    : 'border-transparent hover:border-white/10'
                }`}
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="150px" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-[color:var(--gold)] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
        <span className="text-sm text-[color:var(--muted)]">
          Đã chọn: {selectedIds.size} ảnh
        </span>
        <div className="flex gap-2">
          {usingFallback && (
            <span className="text-xs text-amber-400 self-center mr-2">Đang dùng dữ liệu tạm</span>
          )}
          <AdminButton variant="secondary" onClick={onClose}>Hủy</AdminButton>
          <AdminButton onClick={handleSelect} disabled={selectedIds.size === 0}>Chọn ảnh</AdminButton>
        </div>
      </div>
    </AdminModal>
  )
}
