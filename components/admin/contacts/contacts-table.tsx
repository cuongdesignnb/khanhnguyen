'use client'

import { useState } from 'react'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminContacts } from '@/data/admin'
import { Search, Phone, Mail, Eye } from 'lucide-react'
import type { ContactAdminItem } from '@/types/admin'

interface ContactsTableProps {
  onSelect?: (contact: ContactAdminItem) => void
  selectedId?: string | null
}

const PAGE_SIZE = 10

export default function ContactsTable({ onSelect, selectedId }: ContactsTableProps) {
  const [statusFilter, setStatusFilter] = useState('')
  const [needFilter, setNeedFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = adminContacts.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false
    if (needFilter && c.need !== needFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.phone.includes(q) &&
        !c.email.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const uniqueNeeds = [...new Set(adminContacts.map((c) => c.need))]

  return (
    <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="processing">Đang xử lý</option>
          <option value="contacted">Đã liên hệ</option>
          <option value="closed">Đã đóng</option>
        </select>
        <select
          value={needFilter}
          onChange={(e) => {
            setNeedFilter(e.target.value)
            setPage(1)
          }}
          className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer"
        >
          <option value="">Tất cả nhu cầu</option>
          {uniqueNeeds.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <div className="flex-1 min-w-[200px] flex items-center bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-[color:var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Tìm tên / SĐT / email..."
            className="bg-transparent text-xs text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none flex-1"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['Khách hàng', 'Công ty', 'SĐT', 'Email', 'Nhu cầu', 'Trạng thái', 'Ghi chú', 'Ngày gửi', 'Thao tác'].map((h) => (
                <th
                  key={h}
                  className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-2 text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr
                key={c.id}
                className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                  selectedId === c.id ? 'bg-white/[0.03]' : ''
                }`}
                onClick={() => onSelect?.(c)}
              >
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[color:var(--gold)]/10 flex items-center justify-center text-xs font-bold text-[color:var(--gold)] shrink-0">
                      {c.name.charAt(c.name.lastIndexOf(' ') + 1)}
                    </div>
                    <span className="text-white font-medium text-sm">{c.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{c.company}</td>
                <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{c.phone}</td>
                <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{c.email}</td>
                <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{c.need}</td>
                <td className="py-3 px-2">
                  <AdminStatusBadge status={c.status} />
                </td>
                <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{c.note || '—'}</td>
                <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{c.date}</td>
                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-emerald-400 cursor-pointer">
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-blue-400 cursor-pointer">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-[color:var(--muted)]">
          Hiển thị {paged.length} / {filtered.length} liên hệ
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg text-xs text-[color:var(--muted)] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                page === p
                  ? 'bg-[color:var(--gold)] text-black'
                  : 'text-[color:var(--muted)] hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg text-xs text-[color:var(--muted)] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  )
}
