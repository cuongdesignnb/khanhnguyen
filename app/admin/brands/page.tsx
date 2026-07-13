'use client'

import { useState } from 'react'
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
import RichTextEditor from '@/components/admin/editor/rich-text-editor'
import SeoFormSection from '@/components/admin/seo/seo-form-section'
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Save, RefreshCw } from 'lucide-react'
import type { BrandItem, MediaItem } from '@/types/admin'

type BrandDetail = BrandItem & {
  seoTitle?: string | null
  seoDescription?: string | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImageId?: string | null
  ogImage?: { url?: string | null } | null
  robotsIndex?: boolean
  robotsFollow?: boolean
}

function brandLogoToMedia(brand: BrandItem): MediaItem | null {
  if (!brand.logo || !brand.logoId || !brand.logo.url) return null
  return {
    id: brand.logoId,
    src: brand.logo.url,
    alt: brand.logo.alt || brand.name,
    type: 'IMAGE',
    format: brand.logo.extension,
    size: brand.logo.size,
    uploadedAt: '',
    url: brand.logo.url,
    filename: brand.logo.filename,
    originalName: brand.logo.originalName,
    mimeType: brand.logo.mimeType,
    extension: brand.logo.extension,
    width: brand.logo.width,
    height: brand.logo.height,
    title: brand.logo.title || undefined,
  }
}

function BrandCardLogo({ brand }: { brand: BrandItem }) {
  const [missing, setMissing] = useState(false)
  if (!brand.logo?.url || missing) {
    return (
      <div className="text-center">
        <span className="text-sm font-black uppercase text-white/60">{brand.name}</span>
        {brand.logoId && <p className="mt-1 text-[10px] font-semibold text-amber-300">Logo đang thiếu file</p>}
      </div>
    )
  }
  return (
    <Image
      src={brand.logo.url}
      alt={brand.logo.alt || `Logo ${brand.name}`}
      fill
      className="object-contain p-4 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      sizes="300px"
      onError={() => setMissing(true)}
    />
  )
}

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
  const [logoChanged, setLogoChanged] = useState(false)
  const [logoMissing, setLogoMissing] = useState(false)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImageId, setOgImageId] = useState<string | null>(null)
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null)
  const [robotsIndex, setRobotsIndex] = useState(true)
  const [robotsFollow, setRobotsFollow] = useState(true)

  const {
    items: brands,
    loading,
    error,
    reload,
    usingFallback,
  } = useAdminList<unknown, BrandItem>({
    fetcher: adminApi.getBrands,
    fallbackData: adminBrands,
    mapItem: mapBrandToItem,
  })

  const resetForm = () => {
    setName('')
    setSlug('')
    setDescription('')
    setSortOrder(0)
    setIsVisible(true)
    setLogoMedia(null)
    setLogoChanged(false)
    setLogoMissing(false)
    setSeoTitle(''); setSeoDescription(''); setCanonicalUrl(''); setOgTitle(''); setOgDescription(''); setOgImageId(null); setOgImageUrl(null); setRobotsIndex(true); setRobotsFollow(true)
  }

  const openEditForm = async (brand: BrandItem) => {
    setEditingId(brand.id)
    setName(brand.name)
    setSlug(brand.slug)
    setDescription(brand.description)
    setIsVisible(brand.isVisible)
    setSortOrder(brand.sortOrder)
    setLogoMedia(brandLogoToMedia(brand))
    setLogoChanged(false)
    setLogoMissing(Boolean(brand.logoId && !brand.logo?.url))
    setIsFormOpen(true)

    try {
      const data = await adminApi.getBrandById(brand.id) as BrandDetail
      setSeoTitle(data.seoTitle || ''); setSeoDescription(data.seoDescription || ''); setCanonicalUrl(data.canonicalUrl || ''); setOgTitle(data.ogTitle || ''); setOgDescription(data.ogDescription || ''); setOgImageId(data.ogImageId || null); setOgImageUrl(data.ogImage?.url || null); setRobotsIndex(data.robotsIndex ?? true); setRobotsFollow(data.robotsFollow ?? true)
      setSortOrder(data.sortOrder)
      setLogoMedia(brandLogoToMedia(data))
      setLogoMissing(Boolean(data.logoId && !data.logo?.url))
      setLogoChanged(false)
    } catch {
      // Dữ liệu từ danh sách vẫn đủ để chỉnh sửa các trường chính.
    }
  }

  const { mutate: saveBrand, loading: saving } = useAdminMutation(
    async () => {
      const payload: Record<string, unknown> = {
        name,
        slug: slug || undefined,
        description,
        sortOrder: Number(sortOrder),
        isVisible,
        seoTitle: seoTitle || null, seoDescription: seoDescription || null, canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || null, ogDescription: ogDescription || null, ogImageId, robotsIndex, robotsFollow,
      }
      if (!editingId || logoChanged) payload.logoId = logoMedia?.id || null

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
      setLogoChanged(true)
      setLogoMissing(false)
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
                <BrandCardLogo brand={brand} />
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
                      onClick={() => void openEditForm(brand)}
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
                  {!logoMissing ? <Image src={logoMedia.src} alt={logoMedia.alt || `Logo ${name}`} fill className="object-contain p-1" onError={() => setLogoMissing(true)} /> : <span className="grid h-full place-items-center px-1 text-center text-[9px] font-bold">Logo đang thiếu file</span>}
                  <button
                    type="button"
                    aria-label="Xóa logo thương hiệu"
                    onClick={() => { setLogoMedia(null); setLogoChanged(true); setLogoMissing(false) }}
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
            {logoMissing && <p className="mt-2 text-xs font-semibold text-amber-300">Logo đang thiếu file. Hãy chọn lại logo từ Media Library.</p>}
            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-[color:var(--muted)]">
              <p className="font-bold text-white">Logo thương hiệu khuyến nghị:</p>
              <p>• Kích thước: 600 × 300 px</p>
              <p>• Tỷ lệ: 2:1 hoặc 3:1</p>
              <p>• Định dạng: PNG/WebP nền trong suốt</p>
              <p>• Dung lượng nên dưới 200 KB</p>
              <p>• Không để khoảng trắng thừa quá lớn quanh logo</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
              Mô tả thương hiệu
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Mô tả thương hiệu..."
              minHeight={120}
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
          <SeoFormSection path={`/thuong-hieu/${slug || 'slug-thuong-hieu'}`} value={{ seoTitle, seoDescription, canonicalUrl, ogTitle, ogDescription, ogImageId, ogImageUrl, robotsIndex, robotsFollow }} onChange={(seo) => { setSeoTitle(seo.seoTitle); setSeoDescription(seo.seoDescription); setCanonicalUrl(seo.canonicalUrl); setOgTitle(seo.ogTitle); setOgDescription(seo.ogDescription); setOgImageId(seo.ogImageId); setOgImageUrl(seo.ogImageUrl || null); setRobotsIndex(seo.robotsIndex); setRobotsFollow(seo.robotsFollow) }} />
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
