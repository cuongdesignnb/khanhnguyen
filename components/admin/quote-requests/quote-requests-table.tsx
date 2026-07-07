'use client'

import { useState } from 'react'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminQuoteRequests } from '@/data/admin'
import { Search, Phone, Mail, Pencil } from 'lucide-react'

const PAGE_SIZE = 10

export default function QuoteRequestsTable() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = adminQuoteRequests.filter((q) => {
    if (statusFilter && q.status !== statusFilter) return false
    if (search) {
      const s = search.toLowerCase()
      if (
        !q.code.toLowerCase().includes(s) &&
        !q.name.toLowerCase().includes(s) &&
        !q.phone.includes(s)
      )
        return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {/* Filter */}
      <div className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
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
            <option value="quoted">Đã báo giá</option>
            <option value="closed">Đã chốt</option>
            <option value="ignored">Bỏ qua</option>
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
              placeholder="Tìm theo mã, khách hàng, SĐT..."
              className="bg-transparent text-xs text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none flex-1"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {[
                  'Mã yêu cầu',
                  'Khách hàng',
                  'SĐT',
                  'Sản phẩm quan tâm',
                  'Số lượng',
                  'Ngân sách',
                  'Trạng thái',
                  'Phụ trách',
                  'Ngày gửi',
                  'Thao tác',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-2 text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-2 text-sm font-mono text-[color:var(--gold)]">
                    {q.code}
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <div className="text-sm text-white font-medium">{q.name}</div>
                      <div className="text-xs text-[color:var(--muted)]">{q.company}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{q.phone}</td>
                  <td className="py-3 px-2 text-xs text-[color:var(--silver)]">{q.product}</td>
                  <td className="py-3 px-2 text-sm text-white text-center">{q.quantity}</td>
                  <td className="py-3 px-2 text-sm text-[color:var(--gold)]">{q.budget}</td>
                  <td className="py-3 px-2">
                    <AdminStatusBadge status={q.status} />
                  </td>
                  <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{q.assignedTo}</td>
                  <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{q.date}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-emerald-400 cursor-pointer">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-blue-400 cursor-pointer">
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
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
            Hiển thị {paged.length} / {filtered.length} yêu cầu
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
    </div>
  )
}
