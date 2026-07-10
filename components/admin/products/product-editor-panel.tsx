'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import AdminButton from '../admin-button'
import type { ProductAdminItem } from '@/types/admin'
import { adminApi } from '@/lib/admin-api'
import { toast } from '@/lib/toast'
import MediaPicker from '../media-picker'
import type { MediaItem } from '@/types/admin'
import RichTextEditor from '@/components/admin/editor/rich-text-editor'

interface ProductEditorPanelProps {
  isOpen: boolean
  onClose: () => void
  product?: ProductAdminItem | null
  categories: any[]
  brands: any[]
  onSaved: () => void
}

const tabs = ['Thông tin cơ bản', 'Thông số kỹ thuật', 'SEO & Album']

const inputClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-all'

const labelClass = 'text-xs text-[color:var(--muted)] mb-1.5 font-medium block'

const selectClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50'

export default function ProductEditorPanel({
  isOpen,
  onClose,
  product,
  categories,
  brands,
  onSaved,
}: ProductEditorPanelProps) {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaPickerMode, setMediaPickerMode] = useState<'thumbnail' | 'album'>('thumbnail')

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [model, setModel] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [priceLabel, setPriceLabel] = useState('Liên hệ')
  const [badge, setBadge] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [warrantyPolicy, setWarrantyPolicy] = useState('')

  // Specs state
  const [specs, setSpecs] = useState<Array<{ label: string; value: string }>>([])

  // Album state
  const [thumbnailMedia, setThumbnailMedia] = useState<MediaItem | null>(null)
  const [albumMedias, setAlbumMedias] = useState<MediaItem[]>([])

  // SEO states
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  // Fetch full details when editing
  useEffect(() => {
    if (isOpen) {
      if (product?.id) {
        setSaving(true)
        adminApi
          .getProductById(product.id)
          .then((res) => {
            const data = res
            setName(data.name || '')
            setSlug(data.slug || '')
            setCategoryId(data.categoryId || '')
            setBrandId(data.brandId || '')
            setModel(data.model || '')
            setSku(data.sku || '')
            setPrice(data.price ? Number(data.price) : '')
            setPriceLabel(data.priceLabel || 'Liên hệ')
            setBadge(data.badge || '')
            setIsFeatured(data.isFeatured || false)
            setIsVisible(data.status === 'PUBLISHED')
            setShortDescription(data.shortDescription || '')
            setDescription(data.description || '')
            setWarrantyPolicy(data.warrantyPolicy || '')
            setSeoTitle(data.seoTitle || '')
            setSeoDescription(data.seoDescription || '')

            // Specs
            if (data.specs) {
              setSpecs(
                data.specs.map((s: any) => ({
                  label: s.label,
                  value: s.value,
                }))
              )
            } else {
              setSpecs([])
            }

            // Thumbnail
            if (data.thumbnail) {
              setThumbnailMedia({
                id: data.thumbnail.id,
                src: data.thumbnail.url,
                alt: data.thumbnail.alt || '',
                type: 'product',
                format: 'jpg',
                size: '',
                uploadedAt: '',
              })
            } else {
              setThumbnailMedia(null)
            }

            // Album
            if (data.images) {
              setAlbumMedias(
                data.images.map((img: any) => ({
                  id: img.media.id,
                  src: img.media.url,
                  alt: img.media.alt || '',
                  type: 'product',
                  format: 'jpg',
                  size: '',
                  uploadedAt: '',
                }))
              )
            } else {
              setAlbumMedias([])
            }
          })
          .catch((err) => {
            console.error('Lỗi lấy chi tiết sản phẩm:', err)
            toast.error('Không thể tải chi tiết sản phẩm.')
          })
          .finally(() => {
            setSaving(false)
          })
      } else {
        // Reset states for creation mode
        setName('')
        setSlug('')
        setCategoryId(categories[0]?.id || '')
        setBrandId(brands[0]?.id || '')
        setModel('')
        setSku('')
        setPrice('')
        setPriceLabel('Liên hệ')
        setBadge('')
        setIsFeatured(false)
        setIsVisible(true)
        setShortDescription('')
        setDescription('')
        setWarrantyPolicy('')
        setSpecs([
          { label: 'Tải trọng nâng', value: '2.5 tấn' },
          { label: 'Chiều cao nâng', value: '3.0 mét' },
          { label: 'Động cơ / Nhiên liệu', value: 'Điện xoay chiều AC' },
        ])
        setThumbnailMedia(null)
        setAlbumMedias([])
        setSeoTitle('')
        setSeoDescription('')
      }
      setActiveTab(0)
    }
  }, [isOpen, product, categories, brands])

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { label: '', value: '' }])
  }

  const handleRemoveSpec = (idx: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSpecChange = (idx: number, field: 'label' | 'value', val: string) => {
    setSpecs((prev) => {
      const next = [...prev]
      next[idx][field] = val
      return next
    })
  }

  const handleMediaSelect = (items: MediaItem[]) => {
    if (mediaPickerMode === 'thumbnail') {
      if (items.length > 0) setThumbnailMedia(items[0])
    } else {
      setAlbumMedias((prev) => [...prev, ...items])
    }
  }

  const handleRemoveAlbumMedia = (id: string) => {
    setAlbumMedias((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSave = async () => {
    if (!name || !categoryId) {
      toast.error('Vui lòng điền đủ các thông tin bắt buộc.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name,
        slug: slug || undefined,
        categoryId,
        brandId: brandId || null,
        thumbnailId: thumbnailMedia?.id || null,
        model,
        sku: sku || undefined,
        price: price ? Number(price) : null,
        priceLabel,
        badge: badge || null,
        status: isVisible ? 'PUBLISHED' : 'HIDDEN',
        stockStatus: 'IN_STOCK',
        isFeatured,
        showOnHome: true,
        shortDescription,
        description,
        warrantyPolicy: warrantyPolicy || null,
        seoTitle,
        seoDescription,
        specs: specs
          .filter((s) => s.label && s.value)
          .map((s, idx) => ({
            label: s.label,
            value: s.value,
            sortOrder: idx,
          })),
        images: albumMedias.map((m, idx) => ({
          mediaId: m.id,
          sortOrder: idx,
          isPrimary: idx === 0,
        })),
      }

      if (product?.id) {
        await adminApi.updateProduct(product.id, payload)
        toast.success('Cập nhật sản phẩm thành công')
      } else {
        await adminApi.createProduct(payload)
        toast.success('Thêm sản phẩm thành công')
      }
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi lưu sản phẩm')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[color:var(--surface)] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-black/20">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 px-4 py-3 text-sm cursor-pointer font-medium transition-colors ${
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: TOYOTA 8FB25"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className={labelClass}>Slug (Đường dẫn tĩnh)</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="tự động tạo từ tên nếu để trống"
                    />
                  </div>

                  {/* Category & Brand */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Danh mục *</label>
                      <select
                        className={selectClass}
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Thương hiệu</label>
                      <select
                        className={selectClass}
                        value={brandId}
                        onChange={(e) => setBrandId(e.target.value)}
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
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
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="VD: 8FB25"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>SKU (Mã sản phẩm)</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="tự sinh nếu để trống"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Giá bán (Số tiền)</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={price}
                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                        placeholder="VD: 425000000"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Nhãn giá hiển thị</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={priceLabel}
                        onChange={(e) => setPriceLabel(e.target.value)}
                        placeholder="VD: Liên hệ, Thỏa thuận"
                      />
                    </div>
                  </div>

                  {/* Badge & Description */}
                  <div>
                    <label className={labelClass}>Badge</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="VD: Mới, Bán chạy..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mô tả ngắn</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Tóm tắt ngắn gọn đặc tính sản phẩm"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mô tả chi tiết</label>
                    <RichTextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Mô tả kỹ thuật hoặc tính năng nổi bật..."
                      minHeight={200}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Chính sách bảo hành</label>
                    <RichTextEditor
                      value={warrantyPolicy}
                      onChange={setWarrantyPolicy}
                      placeholder="Chính sách bảo hành riêng cho sản phẩm này..."
                      minHeight={150}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-8 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[color:var(--silver)]">Sản phẩm nổi bật</span>
                      <button
                        type="button"
                        onClick={() => setIsFeatured(!isFeatured)}
                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                          isFeatured ? 'bg-[color:var(--gold)]' : 'bg-[color:var(--surface-3)] border border-white/10'
                        }`}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                          style={{ transform: isFeatured ? 'translateX(18px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[color:var(--silver)]">Hiển thị</span>
                      <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                          isVisible ? 'bg-[color:var(--gold)]' : 'bg-[color:var(--surface-3)] border border-white/10'
                        }`}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                          style={{ transform: isVisible ? 'translateX(18px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className={labelClass}>Danh sách thông số</label>
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      onClick={handleAddSpec}
                    >
                      Thêm thông số
                    </AdminButton>
                  </div>

                  {specs.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-[color:var(--muted)] text-sm">
                      Chưa có thông số kỹ thuật nào. Click Thêm để tạo mới.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {specs.map((spec, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={spec.label}
                            onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                            placeholder="Nhãn (VD: Động cơ)"
                            className="flex-1 bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                            placeholder="Giá trị (VD: Diesel)"
                            className="flex-1 bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(idx)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-5">
                  {/* Thumbnail Selector */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3">
                    <label className={labelClass}>Ảnh đại diện (Thumbnail)</label>
                    <div className="flex gap-4 items-center">
                      {thumbnailMedia ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black/20 flex-shrink-0">
                          <Image src={thumbnailMedia.src} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl border border-dashed border-white/15 flex items-center justify-center text-[color:var(--muted)] flex-shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <AdminButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setMediaPickerMode('thumbnail')
                          setMediaPickerOpen(true)
                        }}
                      >
                        Chọn ảnh đại diện
                      </AdminButton>
                    </div>
                  </div>

                  {/* Album Grid */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3">
                    <label className={labelClass}>Album ảnh chi tiết</label>
                    <div className="grid grid-cols-4 gap-2">
                      {albumMedias.map((media) => (
                        <div
                          key={media.id}
                          className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-black/20"
                        >
                          <Image src={media.src} alt="" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveAlbumMedia(media.id)}
                            className="absolute top-1 right-1 bg-black/80 hover:bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setMediaPickerMode('album')
                          setMediaPickerOpen(true)
                        }}
                        className="border-dashed border-2 border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center aspect-square cursor-pointer transition-colors"
                      >
                        <Plus className="w-5 h-5 text-[color:var(--muted)]" />
                      </div>
                    </div>
                  </div>

                  {/* SEO Form */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-4">
                    <label className={labelClass}>SEO Metadata</label>
                    <div>
                      <label className="text-[10px] text-[color:var(--muted)] uppercase mb-1 block">SEO Title</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Tiêu đề SEO"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[color:var(--muted)] uppercase mb-1 block">SEO Description</label>
                      <textarea
                        className={`${inputClass} resize-none h-20`}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Mô tả SEO..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex gap-3 justify-end bg-black/20">
              <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
                Hủy bỏ
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleSave}
                loading={saving}
                disabled={!name || !categoryId}
              >
                Lưu sản phẩm
              </AdminButton>
            </div>
          </motion.div>

          <MediaPicker
            isOpen={mediaPickerOpen}
            onClose={() => setMediaPickerOpen(false)}
            onSelect={handleMediaSelect}
            multiple={mediaPickerMode === 'album'}
          />
        </>
      )}
    </AnimatePresence>
  )
}
