'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Plus } from 'lucide-react'
import Image from 'next/image'
import AdminButton from '../admin-button'
import type { ProductAdminItem } from '@/types/admin'

interface ProductEditorPanelProps {
  isOpen: boolean
  onClose: () => void
  product?: ProductAdminItem | null
}

const tabs = ['Thông tin cơ bản', 'Thông số kỹ thuật', 'SEO & Khác']

const inputClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]/50 focus:ring-1 focus:ring-[color:var(--gold)]/20'

const labelClass = 'text-xs text-[color:var(--muted)] mb-1.5 font-medium block'

const selectClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] appearance-none focus:outline-none focus:border-[color:var(--gold)]/50'

// Default images for the album (uses first 3 product images from seed)
const albumImages = [
  '/images/seed/products/toyota-8fb25.jpg',
  '/images/seed/products/komatsu-fd25t.jpg',
  '/images/seed/products/mitsubishi-rb14.jpg',
]

export default function ProductEditorPanel({
  isOpen,
  onClose,
  product,
}: ProductEditorPanelProps) {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0)
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false)
  const [isVisible, setIsVisible] = useState(product?.isVisible ?? true)

  const slug = product?.name
    ? product.name.toLowerCase().replace(/\s+/g, '-')
    : 'ten-san-pham'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[color:var(--surface)] border-l border-white/10 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[color:var(--text)]">
                {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(idx as 0 | 1 | 2)}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                    activeTab === idx
                      ? 'text-[color:var(--gold)] border-b-2 border-[color:var(--gold)]'
                      : 'text-[color:var(--muted)] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === 0 && (
                <>
                  {/* Name */}
                  <div>
                    <label className={labelClass}>Tên sản phẩm *</label>
                    <input
                      type="text"
                      className={inputClass}
                      defaultValue={product?.name ?? ''}
                      placeholder="VD: TOYOTA 8FB25"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className={labelClass}>Slug *</label>
                    <input
                      type="text"
                      className={inputClass}
                      defaultValue={slug}
                    />
                    <div className="text-[10px] text-[color:var(--muted)] bg-[color:var(--surface-2)] rounded-lg px-3 py-2 mt-1.5 break-all">
                      https://khanhnguyenforklift.vn/san-pham/{slug}
                    </div>
                  </div>

                  {/* Category & Brand */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Danh mục *</label>
                      <select className={selectClass} defaultValue={product?.category ?? ''}>
                        <option value="">Chọn danh mục</option>
                        <option>Xe nâng điện</option>
                        <option>Xe nâng dầu</option>
                        <option>Xe nâng tay</option>
                        <option>Xe cẩu</option>
                        <option>Bình điện</option>
                        <option>Phụ tùng</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Thương hiệu *</label>
                      <select className={selectClass} defaultValue={product?.brand ?? ''}>
                        <option value="">Chọn thương hiệu</option>
                        <option>TOYOTA</option>
                        <option>KOMATSU</option>
                        <option>MITSUBISHI</option>
                        <option>TCM</option>
                        <option>NIULI</option>
                      </select>
                    </div>
                  </div>

                  {/* Model & SKU */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Model</label>
                      <input
                        type="text"
                        className={inputClass}
                        defaultValue={product?.model ?? ''}
                        placeholder="VD: 8FB25"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>SKU *</label>
                      <input
                        type="text"
                        className={inputClass}
                        defaultValue={product?.sku ?? ''}
                        placeholder="VD: TOY-8FB25"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className={labelClass}>Giá bán *</label>
                    <input
                      type="text"
                      className={inputClass}
                      defaultValue={product?.priceLabel ?? ''}
                      placeholder="VD: 425.000.000 ₫"
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label className={labelClass}>Badge</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="VD: Mới, Hot, Giảm giá..."
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[color:var(--muted)]">Nổi bật</span>
                      <button
                        onClick={() => setIsFeatured(!isFeatured)}
                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                          isFeatured
                            ? 'bg-[color:var(--gold)]'
                            : 'bg-[color:var(--surface-3)]'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            isFeatured ? 'translate-x-[18px]' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[color:var(--muted)]">Hiển thị</span>
                      <button
                        onClick={() => setIsVisible(!isVisible)}
                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                          isVisible
                            ? 'bg-[color:var(--gold)]'
                            : 'bg-[color:var(--surface-3)]'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            isVisible ? 'translate-x-[18px]' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Album */}
                  <div>
                    <label className={labelClass}>Album ảnh</label>
                    <p className="text-[10px] text-[color:var(--muted)] mb-2">
                      Nhấn để đặt ảnh làm ảnh đại diện
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {albumImages.map((src, idx) => (
                        <div
                          key={idx}
                          className="w-full aspect-square rounded-xl overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-[color:var(--gold)]/50 transition-all"
                        >
                          <Image
                            src={product?.image ? (idx === 0 ? product.image : src) : src}
                            alt={`Ảnh ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 text-[8px] bg-[color:var(--gold)] text-black px-1.5 py-0.5 rounded-md font-medium">
                              Ảnh đại diện
                            </span>
                          )}
                        </div>
                      ))}
                      <div className="border-dashed border-2 border-white/10 rounded-xl flex items-center justify-center aspect-square cursor-pointer hover:border-white/20 transition-colors">
                        <Plus className="w-5 h-5 text-[color:var(--muted)]" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <AdminButton variant="secondary" className="w-full justify-center">
                        Chọn ảnh từ thư viện
                      </AdminButton>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <div className="flex items-center justify-center h-40 text-[color:var(--muted)] text-sm">
                  Thông số kỹ thuật sẽ hiển thị ở đây
                </div>
              )}

              {activeTab === 2 && (
                <div className="flex items-center justify-center h-40 text-[color:var(--muted)] text-sm">
                  SEO &amp; Khác sẽ hiển thị ở đây
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex gap-3 justify-end">
              <AdminButton variant="secondary" onClick={onClose}>
                Hủy bỏ
              </AdminButton>
              <AdminButton variant="primary">Lưu sản phẩm</AdminButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
