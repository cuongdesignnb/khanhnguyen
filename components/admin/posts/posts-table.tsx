'use client'

import Image from 'next/image'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminPosts } from '@/data/admin'
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react'

export default function PostsTable() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[color:var(--silver)]">
          Quản lý bài viết
        </h3>
        <AdminButton size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
          Thêm bài viết
        </AdminButton>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer">
          <option>Tất cả danh mục</option>
          <option>Kiến thức</option>
          <option>So sánh</option>
          <option>Hướng dẫn</option>
          <option>Tin tức</option>
          <option>Bảng giá</option>
        </select>
        <select className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer">
          <option>Tất cả trạng thái</option>
          <option>Đã đăng</option>
          <option>Nháp</option>
          <option>Hẹn lịch</option>
        </select>
        <div className="flex-1 min-w-[200px] flex items-center bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-[color:var(--muted)]" />
          <input
            type="text"
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
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-8">
                #
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-16">
                Ảnh
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">
                Tiêu đề
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">
                Danh mục
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">
                Trạng thái
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">
                Ngày đăng
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left">
                Tác giả
              </th>
              <th className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left w-20">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {adminPosts.map((post, i) => (
              <tr
                key={post.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 px-3 text-[color:var(--muted)]">{i + 1}</td>
                <td className="py-3 px-3">
                  <div className="w-12 h-9 rounded-lg overflow-hidden relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-white line-clamp-1">{post.title}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs bg-[color:var(--surface-2)] border border-white/10 rounded-full px-2.5 py-0.5 text-[color:var(--muted)]">
                    {post.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <AdminStatusBadge status={post.status} />
                </td>
                <td className="py-3 px-3 text-xs text-[color:var(--muted)]">
                  {post.publishedAt || '—'}
                </td>
                <td className="py-3 px-3 text-xs text-[color:var(--muted)]">
                  {post.author}
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-[color:var(--muted)]">
        <span>Hiển thị 1 đến 5 của 50 bài viết</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, '...', 12].map((p, i) => (
            <button
              key={i}
              className={`min-w-[32px] h-8 rounded-lg flex items-center justify-center text-xs cursor-pointer ${
                p === 1
                  ? 'bg-[color:var(--gold)] text-black font-semibold'
                  : 'bg-[color:var(--surface-2)] text-[color:var(--muted)] hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
