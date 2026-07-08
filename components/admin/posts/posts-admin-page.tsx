'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import PostsTable from './posts-table'
import { adminPosts } from '@/data/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapPostToAdminItem } from '@/lib/admin-mappers'
import AdminConfirmModal from '@/components/admin/admin-confirm-modal'
import MediaPicker from '@/components/admin/media-picker'
import { toast } from '@/lib/toast'
import {
  Save,
  Image as ImageIcon,
  Plus,
  X,
  RefreshCw,
} from 'lucide-react'
import type { PostAdminItem, MediaItem } from '@/types/admin'

const postTabs = ['Bài viết', 'Danh mục tin']

const inputClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-all'
const labelClass = 'text-xs text-[color:var(--muted)] mb-1.5 font-medium block'
const selectClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50'

export default function PostsAdminPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <div className="flex gap-0 border-b border-white/10 mb-6">
        {postTabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === i
                ? 'text-[color:var(--gold)] border-b-2 border-[color:var(--gold)]'
                : 'text-[color:var(--muted)] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 ? <PostsTabContent /> : <PostCategoriesTabContent />}
    </div>
  )
}

/* ──────────────────────── Posts Tab ──────────────────────── */

function PostsTabContent() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  // Dropdowns
  const [postCategories, setPostCategories] = useState<any[]>([])

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'HIDDEN'>('DRAFT')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailMedia, setThumbnailMedia] = useState<MediaItem | null>(null)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  useEffect(() => {
    // Load categories
    adminApi.getPostCategories().then(setPostCategories).catch(console.error)
  }, [])

  const {
    items: posts,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    params,
    setParams,
    reload,
    usingFallback,
  } = useAdminList<any, PostAdminItem>({
    fetcher: adminApi.getPosts,
    initialParams: { page: 1, limit: 10, q: '', categoryId: '', status: '' },
    fallbackData: adminPosts,
    mapItem: mapPostToAdminItem,
  })

  // Pre-fill form when editingId changes
  useEffect(() => {
    if (editingId) {
      const p = posts.find((item) => item.id === editingId)
      if (p) {
        toast.info('Đang tải chi tiết bài viết...')
        adminApi
          .getPostById(editingId)
          .then((res) => {
            setTitle(res.title || '')
            setSlug(res.slug || '')
            setCategoryId(res.categoryId || '')
            setStatus(res.status)
            setExcerpt(res.excerpt || '')
            setContent(res.content || '')
            setSeoTitle(res.seoTitle || '')
            setSeoDescription(res.seoDescription || '')
            if (res.thumbnail) {
              setThumbnailMedia({
                id: res.thumbnail.id,
                src: res.thumbnail.url,
                alt: res.thumbnail.alt || '',
                type: 'post',
                format: 'jpg',
                size: '',
                uploadedAt: '',
              })
            } else {
              setThumbnailMedia(null)
            }
          })
          .catch(console.error)
      }
    } else {
      resetForm()
    }
  }, [editingId, posts])

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setCategoryId(postCategories[0]?.id || '')
    setStatus('DRAFT')
    setExcerpt('')
    setContent('')
    setThumbnailMedia(null)
    setSeoTitle('')
    setSeoDescription('')
  }

  const { mutate: savePost, loading: saving } = useAdminMutation(
    async () => {
      const payload = {
        title,
        slug: slug || undefined,
        categoryId: categoryId || null,
        status,
        excerpt,
        content,
        thumbnailId: thumbnailMedia?.id || null,
        seoTitle,
        seoDescription,
      }

      if (editingId) {
        return adminApi.updatePost(editingId, payload)
      } else {
        return adminApi.createPost(payload)
      }
    },
    {
      successMessage: editingId ? 'Cập nhật bài viết thành công' : 'Đăng bài viết thành công',
      onSuccess: () => {
        setEditingId(null)
        resetForm()
        reload()
      },
    }
  )

  const { mutate: deletePost, loading: deleting } = useAdminMutation(
    adminApi.deletePost,
    {
      successMessage: 'Xóa bài viết thành công',
      onSuccess: () => {
        setDeleteId(null)
        if (editingId === deleteId) {
          setEditingId(null)
        }
        reload()
      },
    }
  )

  const handleMediaSelect = (items: MediaItem[]) => {
    if (items.length > 0) {
      setThumbnailMedia(items[0])
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Quản lý tin tức / bài viết"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Tin tức' },
        ]}
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
        {/* Left Column (Table) */}
        <div className="xl:col-span-2 space-y-6">
          <PostsTable
            posts={posts}
            loading={loading}
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={(p) => setParams({ page: p })}
            params={params}
            setParams={setParams}
            postCategories={postCategories}
            onAdd={() => {
              setEditingId(null)
              resetForm()
            }}
            onEdit={(p) => setEditingId(p.id)}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>

        {/* Right Column (Editor Panel) */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5 self-start sticky top-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-[color:var(--silver)]">
              {editingId ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết mới'}
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
              <label className={labelClass}>Tiêu đề bài viết *</label>
              <input
                type="text"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Danh mục</label>
                <select
                  className={selectClass}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Chọn danh mục</option>
                  {postCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Trạng thái</label>
                <select
                  className={selectClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Đăng công khai</option>
                  <option value="HIDDEN">Ẩn bài viết</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Ảnh đại diện (Thumbnail)</label>
              <div className="flex gap-4 items-center">
                {thumbnailMedia ? (
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/20">
                    <Image src={thumbnailMedia.src} alt="" fill className="object-cover" />
                    <button
                      onClick={() => setThumbnailMedia(null)}
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-rose-500"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setMediaPickerOpen(true)}
                    className="w-20 h-14 rounded-lg border border-dashed border-white/15 flex items-center justify-center text-[color:var(--muted)] flex-shrink-0 cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
                <AdminButton variant="secondary" size="sm" onClick={() => setMediaPickerOpen(true)}>
                  Chọn ảnh đại diện
                </AdminButton>
              </div>
            </div>

            <div>
              <label className={labelClass}>Tóm tắt ngắn</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Nhập mô tả tóm tắt..."
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-16"
              />
            </div>

            <div>
              <label className={labelClass}>Nội dung bài viết</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung HTML hoặc văn bản..."
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 h-48 resize-y"
              />
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-3">
              <label className="text-[10px] text-[color:var(--muted)] uppercase font-semibold">SEO Metadata</label>
              <div>
                <input
                  type="text"
                  className={inputClass}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO Title"
                />
              </div>
              <div>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="SEO Description..."
                  className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-16"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                className="flex-1 justify-center"
                onClick={() => {
                  setEditingId(null)
                  resetForm()
                }}
              >
                Hủy
              </AdminButton>
              <AdminButton
                className="flex-1 justify-center"
                loading={saving}
                onClick={() => savePost()}
                icon={<Save className="w-4 h-4" />}
                disabled={!title}
              >
                Lưu bài viết
              </AdminButton>
            </div>
          </div>
        </div>
      </div>

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />

      <AdminConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deletePost(deleteId)
        }}
        loading={deleting}
        title="Xóa bài viết"
        description="Bạn có chắc chắn muốn xóa bài viết này? Dữ liệu bài đăng ngoài trang chủ sẽ không còn truy cập được."
      />
    </div>
  )
}

/* ──────────────────────── Post Categories Tab ──────────────────────── */

function PostCategoriesTabContent() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const loadCategories = () => {
    setLoading(true)
    adminApi
      .getPostCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const { mutate: createCategory, loading: creating } = useAdminMutation(
    async () => {
      return adminApi.createPostCategory({ name, slug: slug || undefined })
    },
    {
      successMessage: 'Tạo danh mục tin thành công',
      onSuccess: () => {
        setName('')
        setSlug('')
        loadCategories()
      },
    }
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Table */}
      <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
        <h3 className="text-sm font-semibold text-[color:var(--silver)] mb-4">Danh sách danh mục tin</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Tên danh mục</th>
                <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Slug</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-10 text-center">
                    <svg className="animate-spin w-5 h-5 mx-auto text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-6 text-center text-[color:var(--muted)]">Chưa có danh mục tin nào.</td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white font-medium">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-xs text-[color:var(--muted)]">{c.slug}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5 self-start sticky top-20">
        <h3 className="text-sm font-semibold text-[color:var(--silver)] mb-4">Tạo danh mục tin mới</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Tên danh mục *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Hướng dẫn kỹ thuật"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug (Đường dẫn tĩnh)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tự động tạo từ tên nếu để trống"
              className={inputClass}
            />
          </div>
          <AdminButton
            className="w-full justify-center"
            loading={creating}
            onClick={() => createCategory()}
            icon={<Plus className="w-4 h-4" />}
            disabled={!name}
          >
            Tạo danh mục
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
