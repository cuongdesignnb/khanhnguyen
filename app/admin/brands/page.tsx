'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminBrands } from '@/data/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapBrandToItem } from '@/lib/admin-mappers'
import AdminConfirmModal from '@/components/admin/admin-confirm-modal'
import MediaPicker from '@/components/admin/media-picker'
import AdminModal from '@/components/admin/admin-modal'
import AdminLoading from '@/components/admin/admin-loading'
import AdminErrorState from '@/components/admin/admin-error-state'
import { toast } from '@/lib/toast'
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Save, RefreshCw } from 'lucide-react'
import type { BrandItem, MediaItem } from '@/types/admin'

export default function BrandsPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [logoMedia, setLogoMedia] = useState<MediaItem | null>(null)

  const {
    items: brands,
    loading,
    error,
    reload,
    usingFallback,
  } = useAdminList<any, BrandItem>({
    fetcher: adminApi.getBrands,
    fallbackData: adminBrands,
    mapItem: mapBrandToItem,
  })

  useEffect(() => {
    if (editingId) {
      const brand = brands.find((b) => b.id === editingId)
      if (brand) {
        setName(brand.name)
        setSlug(brand.slug)
        setDescription(brand.description || '')
        setIsVisible(brand.isVisible ?? true)
        setSortOrder(0)
        setLogoMedia(
          brand.logo
            ? {
                id: '',
                src: brand.logo,
                alt: '',
                type: 'other',
                format: 'jpg',
                size: '',
                uploadedAt: '',
              }
            : null
        )
        setIsFormOpen(true)
      }
    } else {
      resetForm()
    }
  }, [editingId, brands])

  const resetForm = () => {
    setName('')
    setSlug('')
    setDescription('')
    setSortOrder(0)
    setIsVisible(true)
    setLogoMedia(null)
  }

  const { mutate: saveBrand, loading: saving } = useAdminMutation(
    async () => {
      const payload = {
        name,
        slug: slug || undefined,
        logoId: logoMedia?.id || null,
        description,
        sortOrder: Number(sortOrder),
        isVisible,
      }

      if (editingId) {
        return adminApi.updateBrand(editingId, payload)
      } else {
        return adminApi.createBrand(payload)
      }
    },
    {
      successMessage: editingId ? 'Cập nhật thương hiệu thành công' : 'Thêm thương hiệu thành công',
      onSuccess: () => {
        setIsFormOpen(false)
        setEditingId(null)
        resetForm()
        reload()
      },
    }
  )

  const { mutate: deleteBrand, loading: deleting } = useAdminMutation(
    adminApi.deleteBrand,
    {
      successMessage: 'Xóa thương hiệu thành công',
      onSuccess: () => {
        setDeleteId(null)
        reload()
      },
    }
  )

  const handleLogoSelect = (items: MediaItem[]) => {
    if (items.length > 0) {
      setLogoMedia(items[0])
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Quản lý thương hiệu"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Thương hiệu' },
        ]}
        actions={
          <AdminButton
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingId(null)
              resetForm()
              setIsFormOpen(true)
            }}
          >
            Thêm thương hiệu
          </AdminButton>
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

      {loading ? (
        <AdminLoading type="grid" count={8} />
      ) : error && !usingFallback ? (
        <AdminErrorState message={error} onRetry={reload} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-[color:var(--gold)]/20 transition-all duration-300 group flex flex-col"
            >
              {/* Logo/Image */}
              <div className="relative h-32 bg-black/30 border-b border-white/5 flex items-center justify-center p-6">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain p-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--surface)]/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="text-base font-bold text-white leading-tight">{brand.name}</div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="text-xs text-[color:var(--muted)] line-clamp-2 leading-relaxed">
                  {brand.description || 'Không có mô tả.'}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div className="text-xs text-[color:var(--muted)]">
                      <span className="text-[color:var(--gold)] font-semibold">
                        {brand.productCount}
                      </span>{' '}
                      sản phẩm
                    </div>
                    <AdminStatusBadge status={brand.isVisible ? 'visible' : 'hidden'} />
                  </div>
                  <div className="text-[10px] text-[color:var(--muted)] font-mono">/{brand.slug}</div>

                  <div className="flex gap-2">
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingId(brand.id)}
                    >
                      <Pencil className="w-3.5 h-3.5" /> Sửa
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteId(brand.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </AdminButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Brand Form Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingId(null)
        }}
        title={editingId ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
              Tên thương hiệu *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Toyota, Komatsu"
              className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
              Slug (Đường dẫn tĩnh)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tự động tạo nếu bỏ trống"
              className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
              Logo thương hiệu
            </label>
            <div className="flex gap-3 items-center">
              {logoMedia ? (
                <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/20">
                  <Image src={logoMedia.src} alt="" fill className="object-contain p-1" />
                  <button
                    onClick={() => setLogoMedia(null)}
                    className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-rose-500"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setMediaPickerOpen(true)}
                  className="w-16 h-10 rounded-lg border border-dashed border-white/20 hover:border-[color:var(--gold)]/50 flex items-center justify-center cursor-pointer text-[color:var(--muted)] hover:text-white transition-all flex-shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </div>
              )}
              <AdminButton variant="secondary" size="sm" onClick={() => setMediaPickerOpen(true)}>
                Chọn logo
              </AdminButton>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
              Mô tả chi tiết
            </label>
            <textarea
              placeholder="Mô tả thương hiệu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-24"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--gold)]/50"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[color:var(--silver)]">Hiển thị thương hiệu</span>
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${
                isVisible ? 'bg-[color:var(--gold)]' : 'bg-zinc-800 border border-white/10'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full bg-white transition-transform duration-200"
                style={{ transform: isVisible ? 'translateX(18px)' : 'translateX(0px)' }}
              />
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-4">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setIsFormOpen(false)
                setEditingId(null)
              }}
            >
              Hủy
            </AdminButton>
            <AdminButton
              onClick={() => saveBrand()}
              loading={saving}
              icon={<Save className="w-4 h-4" />}
              disabled={!name}
            >
              Lưu thương hiệu
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleLogoSelect}
      />

      <AdminConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteBrand(deleteId)
        }}
        loading={deleting}
        title="Xóa thương hiệu"
        description="Bạn có chắc chắn muốn xóa thương hiệu này? Hệ thống sẽ báo lỗi nếu thương hiệu đang liên kết với sản phẩm."
      />
    </div>
  )
}
