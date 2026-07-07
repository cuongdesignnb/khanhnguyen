'use client'

import AdminButton from '@/components/admin/admin-button'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Clipboard,
} from 'lucide-react'

export default function PostEditorCard() {
  return (
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
  )
}
