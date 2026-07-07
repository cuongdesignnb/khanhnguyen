'use client'

import { useState } from 'react'
import AdminModal from './admin-modal'
import { adminMedia } from '@/data/admin'
import Image from 'next/image'
import AdminButton from './admin-button'
import { Search, Check } from 'lucide-react'
import type { MediaItem } from '@/types/admin'

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (items: MediaItem[]) => void
}

const tabs = ['Tất cả', 'Sản phẩm', 'Danh mục', 'Tin tức']
const tabTypeMap: Record<number, string | null> = {
  0: null,
  1: 'product',
  2: 'service',
  3: 'post',
}

const selectClass =
  'bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] appearance-none focus:outline-none focus:border-[color:var(--gold)]/50'

export default function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMedia = adminMedia.filter((item) => {
    const matchesTab = tabTypeMap[activeTab] === null || item.type === tabTypeMap[activeTab]
    const matchesSearch =
      searchQuery === '' ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelect = () => {
    const selected = adminMedia.filter((item) => selectedIds.has(item.id))
    onSelect?.(selected)
    onClose()
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Media Library" size="xl">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/10 mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
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
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-[color:var(--muted)]" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:outline-none flex-1"
          />
        </div>
        <select className={selectClass}>
          <option>Tất cả loại</option>
          <option>Sản phẩm</option>
          <option>Dịch vụ</option>
          <option>Bài viết</option>
          <option>Hero</option>
          <option>Khác</option>
        </select>
        <select className={selectClass}>
          <option>Tất cả</option>
          <option>JPG</option>
          <option>PNG</option>
          <option>WebP</option>
          <option>SVG</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto">
        {filteredMedia.map((item) => {
          const isSelected = selectedIds.has(item.id)
          return (
            <div
              key={item.id}
              onClick={() => toggleSelection(item.id)}
              className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer group ${
                isSelected
                  ? 'ring-2 ring-[color:var(--gold)] ring-offset-2 ring-offset-[color:var(--surface)]'
                  : ''
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
              />
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

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
        <span className="text-sm text-[color:var(--muted)]">
          Đã chọn: {selectedIds.size} ảnh
        </span>
        <AdminButton onClick={handleSelect}>Chọn ảnh</AdminButton>
      </div>
    </AdminModal>
  )
}
