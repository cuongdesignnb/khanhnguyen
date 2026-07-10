'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import PostsTable from './posts-table'
import { adminPosts } from '@/data/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapPostToAdminItem } from '@/lib/admin-mappers'
import AdminConfirmModal from '@/components/admin/admin-confirm-modal'
import { RefreshCw, Plus } from 'lucide-react'
import type { PostAdminItem } from '@/types/admin'

const postTabs = ['Bài viết', 'Danh mục tin']

const inputClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-all'
const labelClass = 'text-xs text-[color:var(--muted)] mb-1.5 font-medium block'

export default function PostListPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="space-y-6">
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
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [postCategories, setPostCategories] = useState<any[]>([])

  useEffect(() => {
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

  const { mutate: deletePost, loading: deleting } = useAdminMutation(
    adminApi.deletePost,
    {
      successMessage: 'Xóa bài viết thành công',
      onSuccess: () => {
        setDeleteId(null)
        reload()
      },
    }
  )

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

      <div className="space-y-6">
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
            router.push('/admin/tin-tuc/viet-bai-moi')
          }}
          onEdit={(p) => {
            router.push(`/admin/tin-tuc/${p.id}/chinh-sua`)
          }}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

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
