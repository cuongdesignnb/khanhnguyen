'use client'

import { useState } from 'react'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import ContactsTable from './contacts-table'
import {
  Phone,
  Mail,
  Eye,
  MessageCircle,
  X,
  Save,
} from 'lucide-react'
import type { ContactAdminItem } from '@/types/admin'

const contactStats = [
  { label: 'Liên hệ mới', value: 12, color: 'text-[color:var(--gold)]' },
  { label: 'Đang xử lý', value: 8, color: 'text-blue-400' },
  { label: 'Đã liên hệ', value: 15, color: 'text-emerald-400' },
  { label: 'Đã đóng', value: 5, color: 'text-[color:var(--muted)]' },
]

export default function ContactsAdminPage() {
  const [selectedContact, setSelectedContact] = useState<ContactAdminItem | null>(null)

  return (
    <div>
      <AdminPageHeader
        title="Quản lý liên hệ"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Liên hệ' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {contactStats.map((s) => (
          <div
            key={s.label}
            className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4"
          >
            <div className="text-xs text-[color:var(--muted)] mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table */}
        <ContactsTable
          selectedId={selectedContact?.id ?? null}
          onSelect={(contact) => setSelectedContact(contact)}
        />

        {/* Detail Panel */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          {selectedContact ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[color:var(--silver)]">Chi tiết liên hệ</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-[color:var(--muted)] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[color:var(--gold)]/10 flex items-center justify-center text-lg font-bold text-[color:var(--gold)]">
                    {selectedContact.name.charAt(selectedContact.name.lastIndexOf(' ') + 1)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedContact.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">{selectedContact.company}</div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    { label: 'SĐT', value: selectedContact.phone },
                    { label: 'Email', value: selectedContact.email },
                    { label: 'Công ty', value: selectedContact.company },
                    { label: 'Nhu cầu', value: selectedContact.need },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs text-[color:var(--muted)] mb-0.5">{item.label}</div>
                      <div className="text-[color:var(--silver)]">{item.value}</div>
                    </div>
                  ))}

                  <div>
                    <div className="text-xs text-[color:var(--muted)] mb-0.5">Trạng thái</div>
                    <AdminStatusBadge status={selectedContact.status} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)] mb-1.5 block">
                    Ghi chú nội bộ
                  </label>
                  <textarea
                    defaultValue={selectedContact.note}
                    placeholder="Nhập ghi chú..."
                    className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-20"
                  />
                </div>

                <div className="flex gap-3">
                  <AdminButton variant="secondary" size="sm" className="flex-1">
                    <Phone className="w-3.5 h-3.5" />
                    Gọi
                  </AdminButton>
                  <AdminButton variant="secondary" size="sm" className="flex-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Zalo
                  </AdminButton>
                  <AdminButton variant="secondary" size="sm" className="flex-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </AdminButton>
                </div>

                <AdminButton size="sm" className="w-full" icon={<Save className="w-3.5 h-3.5" />}>
                  Lưu ghi chú
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Eye className="w-10 h-10 text-[color:var(--muted)] mb-3" />
              <p className="text-sm text-[color:var(--muted)]">
                Chọn một liên hệ để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
