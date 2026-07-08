'use client'

import Image from 'next/image'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import AdminPagination from '@/components/admin/admin-pagination'
import { Pencil, Trash2, Search, Plus } from 'lucide-react'
import type { PostAdminItem } from '@/types/admin'

interface PostsTableProps {
  posts: PostAdminItem[]
  loading: boolean
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (p: number) => void
  params: any
  setParams: (p: any) => void
  postCategories: any[]
  onAdd?: () => void
  onEdit?: (post: PostAdminItem) => void
  onDelete?: (id: string) => void
}

export default function PostsTable({
  posts,
  loading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  params,
  setParams,
  postCategories,
  onAdd,
  onEdit,
  onDelete,
}: PostsTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[color:var(--silver)]">Quản lý bài viết</h3>
        <AdminButton size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onAdd}>
          Thêm bài viết
        </AdminButton>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={params.categoryId || ''}
          onChange={(e) => setParams({ categoryId: e.target.value })}
          className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50"
        >
          <option value="">Tất cả danh mục</option>
          {postCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={params.status || ''}
          onChange={(e) => setParams({ status: e.target.value })}
          className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PUBLISHED">Đã đăng</option>
          <option value="DRAFT">Nháp</option>
          <option value="SCHEDULED">Hẹn lịch</option>
          <option value="HIDDEN">Đã ẩn</option>
        </select>
        <div className="flex-1 min-w-[200px] flex items-center bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-[color:var(--muted)]" />
          <input
            type="text"
            value={params.q || ''}
            onChange={(e) => setParams({ q: e.target.value })}
            placeholder="Tìm bài viết..."
            className="bg-transparent text-xs text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none flex-1"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-8">#</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-16">Ảnh</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Tiêu đề</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Danh mục</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Trạng thái</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Ngày đăng</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">Tác giả</th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[color:var(--muted)]">
                  <div className="flex justify-center">
                    <svg className="animate-spin w-6 h-6 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-[color:var(--muted)]">
                  Chưa có bài viết nào.
                </td>
              </tr>
            ) : (
              posts.map((post, i) => (
                <tr
                  key={post.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-3 text-[color:var(--muted)]">{(page - 1) * limit + i + 1}</td>
                  <td className="py-3 px-3">
                    <div className="w-12 h-9 rounded-lg overflow-hidden relative border border-white/10 bg-black/20">
                      <Image
                        src={post.image || '/images/placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm text-white font-medium line-clamp-1" title={post.title}>
                      {post.title}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs bg-[color:var(--surface-2)] border border-white/10 rounded-full px-2.5 py-0.5 text-[color:var(--muted)]">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <AdminStatusBadge status={post.status} />
                  </td>
                  <td className="py-3 px-3 text-xs text-[color:var(--muted)]">{post.publishedAt}</td>
                  <td className="py-3 px-3 text-xs text-[color:var(--silver)]">{post.author}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEdit?.(post)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete?.(post.id)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[color:var(--muted)]">
            Hiển thị {posts.length} / {total} bài viết
          </span>
          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
