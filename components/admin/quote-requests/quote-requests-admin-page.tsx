'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import QuoteRequestsTable from './quote-requests-table'
import { Phone, Mail, Eye, MessageCircle, X, Save, RefreshCw } from 'lucide-react'
import type { QuoteRequestItem } from '@/types/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapQuoteRequestToItem } from '@/lib/admin-mappers'
import { adminQuoteRequests } from '@/data/admin'
import { toast } from '@/lib/toast'

const quoteStats = [
  { label: 'Mới', value: 8, color: 'text-[color:var(--gold)]' },
  { label: 'Đang xử lý', value: 5, color: 'text-blue-400' },
  { label: 'Đã báo giá', value: 12, color: 'text-purple-400' },
  { label: 'Đã chốt', value: 3, color: 'text-emerald-400' },
  { label: 'Bỏ qua', value: 2, color: 'text-[color:var(--muted)]' },
]

export default function QuoteRequestsAdminPage() {
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequestItem | null>(null)

  // Edit states inside panel
  const [internalNote, setInternalNote] = useState('')
  const [statusVal, setStatusVal] = useState<'NEW' | 'PROCESSING' | 'QUOTED' | 'CLOSED' | 'IGNORED'>('NEW')

  const {
    items: quotes,
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
  } = useAdminList<any, QuoteRequestItem>({
    fetcher: adminApi.getQuoteRequests,
    initialParams: { page: 1, limit: 10, q: '', status: '' },
    fallbackData: adminQuoteRequests,
    mapItem: mapQuoteRequestToItem,
  })

  // Watch selectedQuote to update form states
  useEffect(() => {
    if (selectedQuote) {
      setInternalNote(selectedQuote.note || '')
      setStatusVal((selectedQuote.status || 'new').toUpperCase() as any)
    }
  }, [selectedQuote])

  const { mutate: saveQuote, loading: saving } = useAdminMutation(
    async () => {
      if (!selectedQuote) return
      return adminApi.updateQuoteRequest(selectedQuote.id, {
        internalNote,
        status: statusVal,
      })
    },
    {
      successMessage: 'Cập nhật yêu cầu báo giá thành công',
      onSuccess: () => {
        setSelectedQuote(null)
        reload()
      },
    }
  )

  const handlePhoneCall = (num: string) => {
    window.open(`tel:${num}`)
  }

  const handleZalo = (num: string) => {
    window.open(`https://zalo.me/${num.replace(/\s+/g, '')}`, '_blank')
  }

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`)
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Quản lý yêu cầu báo giá"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Báo giá' },
        ]}
      />

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {quoteStats.map((s) => (
          <div
            key={s.label}
            className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4"
          >
            <div className="text-xs text-[color:var(--muted)] mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {usingFallback && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs rounded-xl flex items-center justify-between animate-fade-in">
          <span>Đang sử dụng dữ liệu tạm. Vui lòng kiểm tra kết nối database.</span>
          <button onClick={reload} className="p-1 hover:bg-white/5 rounded-lg text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table */}
        <QuoteRequestsTable
          quotes={quotes}
          loading={loading}
          page={page}
          total={total}
          totalPages={totalPages}
          onPageChange={(p) => setParams({ page: p })}
          params={params}
          setParams={setParams}
          selectedId={selectedQuote?.id ?? null}
          onEdit={(q) => setSelectedQuote(q)}
        />

        {/* Detail Panel */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5 self-start sticky top-20">
          {selectedQuote ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[color:var(--silver)]">Chi tiết yêu cầu</h3>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-[color:var(--muted)] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[color:var(--gold)]/10 flex items-center justify-center text-lg font-bold text-[color:var(--gold)]">
                    {selectedQuote.code.slice(-2)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedQuote.name}</div>
                    <div className="text-xs text-[color:var(--muted)] font-mono">{selectedQuote.code}</div>
                  </div>
                </div>

                <div className="space-y-3 text-sm bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  {[
                    { label: 'Số điện thoại', value: selectedQuote.phone },
                    { label: 'Email', value: selectedQuote.email || '—' },
                    { label: 'Công ty', value: selectedQuote.company || '—' },
                    { label: 'Sản phẩm quan tâm', value: selectedQuote.product },
                    { label: 'Số lượng', value: selectedQuote.quantity },
                    { label: 'Ngân sách dự kiến', value: selectedQuote.budget },
                    { label: 'Phụ trách', value: selectedQuote.assignedTo },
                    { label: 'Ngày gửi', value: selectedQuote.date },
                  ].map((item) => (
                    <div key={item.label} className="border-b border-white/5 last:border-0 pb-1.5 last:pb-0">
                      <div className="text-[10px] text-[color:var(--muted)] mb-0.5">{item.label}</div>
                      <div className="text-[color:var(--silver)] font-medium">{item.value}</div>
                    </div>
                  ))}

                  <div className="pt-1.5 flex items-center justify-between">
                    <div className="text-[10px] text-[color:var(--muted)]">Trạng thái</div>
                    <select
                      value={statusVal}
                      onChange={(e: any) => setStatusVal(e.target.value)}
                      className="bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none cursor-pointer focus:border-[color:var(--gold)]/50"
                    >
                      <option value="NEW">Mới</option>
                      <option value="PROCESSING">Đang xử lý</option>
                      <option value="QUOTED">Đã báo giá</option>
                      <option value="CLOSED">Đã chốt</option>
                      <option value="IGNORED">Bỏ qua</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)] mb-1.5 block">
                    Ghi chú nội bộ
                  </label>
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Nhập tiến độ tư vấn, báo giá..."
                    className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-20"
                  />
                </div>

                <div className="flex gap-2">
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePhoneCall(selectedQuote.phone)}
                  >
                    <Phone className="w-3.5 h-3.5" /> Gọi điện
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleZalo(selectedQuote.phone)}
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Zalo
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEmail(selectedQuote.email)}
                    disabled={!selectedQuote.email}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </AdminButton>
                </div>

                <AdminButton
                  size="sm"
                  className="w-full justify-center"
                  loading={saving}
                  onClick={() => saveQuote()}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Lưu thay đổi
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Eye className="w-10 h-10 text-[color:var(--muted)] mb-3" />
              <p className="text-sm text-[color:var(--muted)]">
                Chọn một yêu cầu báo giá để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
