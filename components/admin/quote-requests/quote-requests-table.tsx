'use client'

import AdminStatusBadge from '@/components/admin/admin-status-badge'
import AdminPagination from '@/components/admin/admin-pagination'
import { Search, Phone, Mail, Eye } from 'lucide-react'
import type { QuoteRequestItem } from '@/types/admin'

interface QuoteRequestsTableProps {
  quotes: QuoteRequestItem[]
  loading: boolean
  page: number
  total: number
  totalPages: number
  onPageChange: (p: number) => void
  params: any
  setParams: (p: any) => void
  onEdit?: (quote: QuoteRequestItem) => void
  selectedId?: string | null
}

export default function QuoteRequestsTable({
  quotes,
  loading,
  page,
  total,
  totalPages,
  onPageChange,
  params,
  setParams,
  onEdit,
  selectedId,
}: QuoteRequestsTableProps) {
  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const handleMailClick = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`)
    }
  }

  return (
    <div className="xl:col-span-2">
      {/* Filters */}
      <div className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={params.status || ''}
            onChange={(e) => setParams({ status: e.target.value })}
            className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="NEW">Mới</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="QUOTED">Đã báo giá</option>
            <option value="CLOSED">Đã chốt</option>
            <option value="IGNORED">Bỏ qua</option>
          </select>
          <div className="flex-1 min-w-[200px] flex items-center bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-[color:var(--muted)]" />
            <input
              type="text"
              value={params.q || ''}
              onChange={(e) => setParams({ q: e.target.value })}
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
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[color:var(--muted)]">
                    <div className="flex justify-center">
                      <svg className="animate-spin w-6 h-6 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-[color:var(--muted)]">
                    Chưa có yêu cầu báo giá nào.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr
                    key={q.id}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      selectedId === q.id ? 'bg-white/[0.03]' : ''
                    }`}
                    onClick={() => onEdit?.(q)}
                  >
                    <td className="py-3 px-2 text-sm font-mono text-[color:var(--gold)] font-semibold">
                      {q.code}
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <div className="text-sm text-white font-medium">{q.name}</div>
                        {q.company && (
                          <div className="text-xs text-[color:var(--muted)]">{q.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{q.phone}</td>
                    <td className="py-3 px-2 text-xs text-[color:var(--silver)]">{q.product}</td>
                    <td className="py-3 px-2 text-sm text-white text-center">{q.quantity}</td>
                    <td className="py-3 px-2 text-sm text-[color:var(--gold)] font-medium">{q.budget}</td>
                    <td className="py-3 px-2">
                      <AdminStatusBadge status={q.status} />
                    </td>
                    <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{q.assignedTo}</td>
                    <td className="py-3 px-2 text-xs text-[color:var(--muted)]">{q.date}</td>
                    <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handlePhoneClick(q.phone)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-emerald-400 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMailClick(q.email)}
                          disabled={!q.email}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit?.(q)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
            <div className="text-xs text-[color:var(--muted)]">
              Hiển thị {quotes.length} / {total} yêu cầu
            </div>
            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
