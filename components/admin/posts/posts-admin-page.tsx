'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminPosts, adminContacts, adminQuoteRequests, adminSettings } from '@/data/admin'
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Upload,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  Code,
  Clipboard,
  Phone,
  Mail,
} from 'lucide-react'

const postTabs = ['Bài viết', 'Liên hệ', 'Cài đặt']

export default function PostsAdminPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      {/* Top Tabs */}
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

      {activeTab === 0 && <PostsTabContent />}
      {activeTab === 1 && <ContactsTabContent />}
      {activeTab === 2 && <SettingsTabContent />}
    </div>
  )
}

/* ──────────────────────── Posts Tab ──────────────────────── */

function PostsTabContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Posts Table Card */}
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

        {/* Post Editor Card */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          <h3 className="text-sm font-semibold text-[color:var(--silver)] mb-4">
            Soạn thảo bài viết mới
          </h3>

          {/* Title + Category */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Nhập tiêu đề bài viết..."
              className="flex-1 bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50"
            />
            <select className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] outline-none appearance-none cursor-pointer">
              <option>Chọn danh mục</option>
              <option>Kiến thức</option>
              <option>So sánh</option>
              <option>Hướng dẫn</option>
              <option>Tin tức</option>
            </select>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 border border-white/10 rounded-t-xl bg-[color:var(--surface-2)] px-2 py-1.5 flex-wrap">
            <select className="bg-transparent text-xs text-[color:var(--muted)] outline-none cursor-pointer mr-2">
              <option>Đoạn văn</option>
              <option>Tiêu đề 1</option>
              <option>Tiêu đề 2</option>
              <option>Tiêu đề 3</option>
            </select>
            <div className="w-px h-5 bg-white/10 mx-1" />
            {[Bold, Italic, Underline].map((Icon, i) => (
              <button
                key={i}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[color:var(--muted)] hover:text-white cursor-pointer"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <div className="w-px h-5 bg-white/10 mx-1" />
            {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
              <button
                key={i}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[color:var(--muted)] hover:text-white cursor-pointer"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <div className="w-px h-5 bg-white/10 mx-1" />
            {[List, ListOrdered, Quote, LinkIcon, ImageIcon, Code, Clipboard].map(
              (Icon, i) => (
                <button
                  key={i}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[color:var(--muted)] hover:text-white cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            )}
          </div>

          {/* Editor Content */}
          <div className="border border-white/10 border-t-0 rounded-b-xl bg-[color:var(--surface-2)] p-6 min-h-[240px]">
            <h2 className="text-lg font-bold text-white mb-3">Tiêu đề H2</h2>
            <p className="text-sm text-[color:var(--silver)] leading-relaxed mb-4">
              Xe nâng là thiết bị không thể thiếu trong các kho xưởng, nhà máy và trung tâm
              logistics. Việc bảo dưỡng xe nâng định kỳ không chỉ giúp đảm bảo an toàn vận
              hành mà còn tối ưu chi phí và gia tăng tuổi thọ thiết bị.
            </p>
            <ul className="text-sm text-[color:var(--silver)] space-y-1.5 list-disc pl-5">
              <li>Kiểm tra hệ thống thủy lực</li>
              <li>Vệ sinh lọc gió, lọc dầu</li>
              <li>Kiểm tra ắc quy, hệ thống điện</li>
              <li>Bôi trơn các khớp, bạc đạn</li>
            </ul>
          </div>

          {/* Editor Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4 text-[10px] text-[color:var(--muted)]">
              <span>
                P &gt; <strong>STRONG</strong>
              </span>
              <span>Số từ: 152</span>
              <span>Chỉnh sửa lúc 10:30 22/05/2025</span>
            </div>
            <div className="flex gap-3">
              <AdminButton variant="secondary" size="sm">
                Lưu nháp
              </AdminButton>
              <AdminButton variant="secondary" size="sm">
                Xem trước
              </AdminButton>
              <AdminButton size="sm">Đăng bài</AdminButton>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Featured Image */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[color:var(--silver)]">Ảnh đại diện</h3>
            <button className="text-[color:var(--muted)] hover:text-white cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Upload area */}
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center mb-4 hover:border-[color:var(--gold)]/30 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-[color:var(--muted)] mb-3" />
            <p className="text-sm text-[color:var(--muted)] mb-1">Kéo thả ảnh vào đây</p>
            <p className="text-xs text-[color:var(--muted)]/50 mb-3">hoặc</p>
            <AdminButton variant="secondary" size="sm">
              Chọn ảnh từ máy
            </AdminButton>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              '/images/seed/services/maintenance.jpg',
              '/images/seed/products/komatsu-fd25t.jpg',
              '/images/seed/services/repair.jpg',
            ].map((src, i) => (
              <div
                key={i}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer ${
                  i === 0 ? 'ring-2 ring-[color:var(--gold)]' : ''
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                {i === 0 && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-[color:var(--gold)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/admin/media"
            className="flex items-center justify-center gap-2 text-xs text-[color:var(--gold)] hover:text-[color:var(--gold-strong)] transition-colors"
          >
            Xem tất cả media →
          </Link>
        </div>

        {/* Contacts & Quotes Preview */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[color:var(--silver)]">
              Danh sách liên hệ & yêu cầu báo giá
            </h3>
            <Link
              href="/admin/contacts"
              className="text-xs text-[color:var(--gold)] hover:text-[color:var(--gold-strong)]"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-[color:var(--muted)] uppercase font-medium py-2 px-2 text-left">
                    Khách hàng
                  </th>
                  <th className="text-[color:var(--muted)] uppercase font-medium py-2 px-2 text-left">
                    SĐT
                  </th>
                  <th className="text-[color:var(--muted)] uppercase font-medium py-2 px-2 text-left">
                    Nhu cầu
                  </th>
                  <th className="text-[color:var(--muted)] uppercase font-medium py-2 px-2 text-left">
                    Trạng thái xử lý
                  </th>
                  <th className="text-[color:var(--muted)] uppercase font-medium py-2 px-2 text-left">
                    Ghi chú nội bộ
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminContacts.slice(0, 5).map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[color:var(--gold)]/10 flex items-center justify-center text-[10px] font-bold text-[color:var(--gold)] shrink-0">
                          {c.name.charAt(c.name.indexOf(' ') > 0 ? c.name.lastIndexOf(' ') + 1 : 0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{c.name}</div>
                          <div className="text-[color:var(--muted)]">{c.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-[color:var(--muted)]">{c.phone}</td>
                    <td className="py-2.5 px-2 text-[color:var(--muted)]">{c.need}</td>
                    <td className="py-2.5 px-2">
                      <AdminStatusBadge status={c.status} />
                    </td>
                    <td className="py-2.5 px-2 text-[color:var(--muted)]">
                      {c.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────── Contacts Tab (Preview) ──────────────────────── */

function ContactsTabContent() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      <p className="text-[color:var(--muted)] text-sm">
        Quản lý liên hệ đầy đủ tại{' '}
        <Link href="/admin/contacts" className="text-[color:var(--gold)] hover:underline">
          /admin/contacts
        </Link>
      </p>
    </div>
  )
}

/* ──────────────────────── Settings Tab (Preview) ──────────────────────── */

function SettingsTabContent() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[color:var(--silver)]">Cài đặt website</h3>
        <AdminButton size="sm">Lưu thay đổi</AdminButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adminSettings.slice(0, 8).map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[color:var(--gold)]/10 flex items-center justify-center shrink-0">
              <span className="text-[color:var(--gold)] text-xs font-bold">
                {s.label.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-[color:var(--silver)]">{s.label}</div>
              <div className="text-[10px] text-[color:var(--muted)] truncate">{s.value}</div>
            </div>
            <button className="text-xs text-[color:var(--gold)] hover:text-[color:var(--gold-strong)] cursor-pointer">
              Sửa
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
