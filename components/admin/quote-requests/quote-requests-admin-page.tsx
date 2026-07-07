'use client'

import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import QuoteRequestsTable from './quote-requests-table'
import { Plus, FileSpreadsheet } from 'lucide-react'

const quoteStats = [
  { label: 'Mới', value: 8, color: 'text-[color:var(--gold)]' },
  { label: 'Đang xử lý', value: 5, color: 'text-blue-400' },
  { label: 'Đã báo giá', value: 12, color: 'text-purple-400' },
  { label: 'Đã chốt', value: 3, color: 'text-emerald-400' },
  { label: 'Bỏ qua', value: 2, color: 'text-[color:var(--muted)]' },
]

export default function QuoteRequestsAdminPage() {
  return (
    <div>
      <AdminPageHeader
        title="Quản lý yêu cầu báo giá"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Báo giá' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton icon={<Plus className="w-4 h-4" />}>Tạo báo giá</AdminButton>
            <AdminButton variant="secondary" icon={<FileSpreadsheet className="w-4 h-4" />}>
              Xuất Excel
            </AdminButton>
          </div>
        }
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

      <QuoteRequestsTable />
    </div>
  )
}
