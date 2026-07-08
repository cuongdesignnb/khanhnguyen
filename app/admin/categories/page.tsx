'use client'

import { useState, Fragment, useEffect } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminCategories } from '@/data/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapCategoryToItem } from '@/lib/admin-mappers'
import AdminConfirmModal from '@/components/admin/admin-confirm-modal'
import MediaPicker from '@/components/admin/media-picker'
import AdminLoading from '@/components/admin/admin-loading'
import AdminErrorState from '@/components/admin/admin-error-state'
import { Plus, Pencil, Trash2, Eye, ChevronRight, Save, X, Image as ImageIcon, RefreshCw } from 'lucide-react'
import type { CategoryItem } from '@/types/admin'
import type { MediaItem } from '@/types/admin'

export default function CategoriesPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [bannerMedia, setBannerMedia] = useState<MediaItem | null>(null)

  const {
    items: categories,
    loading,
    error,
    reload,
    usingFallback,
  } = useAdminList<any, CategoryItem>({
    fetcher: adminApi.getCategories,
    initialParams: { mode: 'list' },
    fallbackData: adminCategories,
    mapItem: mapCategoryToItem,
  })

  // Watch editingId changes to pre-fill form
  useEffect(() => {
    if (editingId) {
      const cat = categories.find((c) => c.id === editingId)
      if (cat) {
        setName(cat.name)
        setSlug(cat.slug)
        // Find corresponding parent DB entry if any
        // Note: cat.parent is parent category name mapped from mapper,
        // so we lookup categories list to find the ID of that parent.
        const parentCat = categories.find((c) => c.name === cat.parent)
        setParentId(parentCat?.id || '')
        setDescription(cat.description || '')
        setSortOrder(cat.order || 0)
        setIsVisible(cat.isVisible ?? true)
        // Set mock image or fetched image url if available
        setBannerMedia(cat.icon ? { id: '', src: cat.icon, alt: '', type: 'other', format: 'jpg', size: '', uploadedAt: '' } : null)
      }
    } else {
      resetForm()
    }
  }, [editingId, categories])

  const resetForm = () => {
    setName('')
    setSlug('')
    setParentId('')
    setDescription('')
    setSortOrder(0)
    setIsVisible(true)
    setBannerMedia(null)
  }

  const { mutate: saveCategory, loading: saving } = useAdminMutation(
    async () => {
      const payload = {
        name,
        slug: slug || undefined,
        parentId: parentId || null,
        description,
        sortOrder: Number(sortOrder),
        isVisible,
        bannerImageId: bannerMedia?.id || null,
      }

      if (editingId) {
        return adminApi.updateCategory(editingId, payload)
      } else {
        return adminApi.createCategory(payload)
      }
    },
    {
      successMessage: editingId ? 'Cập nhật danh mục thành công' : 'Thêm danh mục thành công',
      onSuccess: () => {
        setEditingId(null)
        resetForm()
        reload()
      },
    }
  )

  const { mutate: deleteCategory, loading: deleting } = useAdminMutation(
    adminApi.deleteCategory,
    {
      successMessage: 'Xóa danh mục thành công',
      onSuccess: () => {
        setDeleteId(null)
        if (editingId === deleteId) {
          setEditingId(null)
        }
        reload()
      },
    }
  )

  const handleBannerSelect = (items: MediaItem[]) => {
    if (items.length > 0) {
      setBannerMedia(items[0])
    }
  }

  // Filter root categories
  const parentCategoriesList = categories.filter((c) => !c.parent)
  const getChildrenList = (parentName: string) =>
    categories.filter((c) => c.parent === parentName)

  return (
    <div>
      <AdminPageHeader
        title="Quản lý danh mục"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Danh mục' },
        ]}
        actions={
          <AdminButton
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingId(null)
              resetForm()
            }}
          >
            Thêm danh mục
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          {loading ? (
            <AdminLoading type="table" count={5} />
          ) : error && !usingFallback ? (
            <AdminErrorState message={error} onRetry={reload} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Tên danh mục', 'Slug', 'Danh mục cha', 'Số SP', 'Hiển thị', 'Thứ tự', 'Thao tác'].map((h) => (
                      <th
                        key={h}
                        className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parentCategoriesList.map((cat) => (
                    <Fragment key={cat.id}>
                      <tr
                        className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                          editingId === cat.id ? 'bg-white/[0.03]' : ''
                        }`}
                        onClick={() => setEditingId(cat.id)}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{cat.name}</span>
                            {getChildrenList(cat.name).length > 0 && (
                              <span className="text-[10px] bg-[color:var(--surface-2)] text-[color:var(--muted)] px-1.5 py-0.5 rounded">
                                {getChildrenList(cat.name).length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs text-[color:var(--muted)] font-mono">
                          {cat.slug}
                        </td>
                        <td className="py-3 px-3 text-xs text-[color:var(--muted)]">—</td>
                        <td className="py-3 px-3 text-sm text-[color:var(--silver)]">
                          {cat.productCount}
                        </td>
                        <td className="py-3 px-3">
                          <AdminStatusBadge status={cat.isVisible ? 'visible' : 'hidden'} />
                        </td>
                        <td className="py-3 px-3 text-sm text-[color:var(--muted)]">{cat.order}</td>
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingId(cat.id)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteId(cat.id)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {getChildrenList(cat.name).map((child) => (
                        <tr
                          key={child.id}
                          className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                            editingId === child.id ? 'bg-white/[0.03]' : ''
                          }`}
                          onClick={() => setEditingId(child.id)}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2 pl-6">
                              <ChevronRight className="w-3 h-3 text-[color:var(--muted)]" />
                              <span className="text-[color:var(--silver)]">{child.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs text-[color:var(--muted)] font-mono">
                            {child.slug}
                          </td>
                          <td className="py-3 px-3 text-xs text-[color:var(--muted)]">
                            {child.parent}
                          </td>
                          <td className="py-3 px-3 text-sm text-[color:var(--silver)]">
                            {child.productCount}
                          </td>
                          <td className="py-3 px-3">
                            <AdminStatusBadge status={child.isVisible ? 'visible' : 'hidden'} />
                          </td>
                          <td className="py-3 px-3 text-sm text-[color:var(--muted)]">
                            {child.order}
                          </td>
                          <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingId(child.id)}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteId(child.id)}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Panel Form */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5 self-start sticky top-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-[color:var(--silver)]">
              {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h3>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null)
                  resetForm()
                }}
                className="text-[color:var(--muted)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Tên danh mục *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên danh mục"
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
                Danh mục cha
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--muted)] outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50"
              >
                <option value="">Không có (danh mục gốc)</option>
                {parentCategoriesList
                  .filter((c) => c.id !== editingId) // Prevent category being its own parent
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Ảnh Banner danh mục
              </label>
              <div className="flex gap-3 items-center">
                {bannerMedia ? (
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/20">
                    <Image src={bannerMedia.src} alt="" fill className="object-cover" />
                    <button
                      onClick={() => setBannerMedia(null)}
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
                  Chọn ảnh
                </AdminButton>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Mô tả ngắn
              </label>
              <textarea
                placeholder="Mô tả danh mục..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-20"
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
              <span className="text-sm text-[color:var(--silver)]">Hiển thị danh mục</span>
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
            <div className="flex gap-3 pt-2">
              <AdminButton
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setEditingId(null)
                  resetForm()
                }}
              >
                Hủy
              </AdminButton>
              <AdminButton
                className="flex-1"
                onClick={() => saveCategory()}
                loading={saving}
                icon={<Save className="w-4 h-4" />}
                disabled={!name}
              >
                Lưu danh mục
              </AdminButton>
            </div>
          </div>
        </div>
      </div>

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleBannerSelect}
      />

      <AdminConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteCategory(deleteId)
        }}
        loading={deleting}
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này? Hệ thống sẽ báo lỗi nếu danh mục có chứa sản phẩm hoặc danh mục con."
      />
    </div>
  )
}
