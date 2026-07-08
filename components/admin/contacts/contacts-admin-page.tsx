'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import ContactsTable from './contacts-table'
import { Phone, Mail, Eye, MessageCircle, X, Save, RefreshCw } from 'lucide-react'
import type { ContactAdminItem } from '@/types/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapContactToAdminItem } from '@/lib/admin-mappers'
import { adminContacts } from '@/data/admin'
import { toast } from '@/lib/toast'

const contactStats = [
  { label: 'Liên hệ mới', value: 12, color: 'text-[color:var(--gold)]' },
  { label: 'Đang xử lý', value: 8, color: 'text-blue-400' },
  { label: 'Đã liên hệ', value: 15, color: 'text-emerald-400' },
  { label: 'Đã đóng', value: 5, color: 'text-[color:var(--muted)]' },
]

export default function ContactsAdminPage() {
  const [selectedContact, setSelectedContact] = useState<ContactAdminItem | null>(null)

  // Edit states inside panel
  const [internalNote, setInternalNote] = useState('')
  const [statusVal, setStatusVal] = useState<'NEW' | 'CALLED' | 'PROCESSING' | 'QUOTED' | 'CLOSED' | 'IGNORED'>('NEW')

  const {
    items: contacts,
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
  } = useAdminList<any, ContactAdminItem>({
    fetcher: adminApi.getContacts,
    initialParams: { page: 1, limit: 10, q: '', status: '' },
    fallbackData: adminContacts,
    mapItem: mapContactToAdminItem,
  })

  // Watch selectedContact to update form states
  useEffect(() => {
    if (selectedContact) {
      setInternalNote(selectedContact.note || '')
      // Convert lowercase status back to uppercase DB enum
      setStatusVal((selectedContact.status || 'new').toUpperCase() as any)
    }
  }, [selectedContact])

  const { mutate: saveContact, loading: saving } = useAdminMutation(
    async () => {
      if (!selectedContact) return
      return adminApi.updateContact(selectedContact.id, {
        internalNote,
        status: statusVal,
      })
    },
    {
      successMessage: 'Cập nhật liên hệ thành công',
      onSuccess: () => {
        setSelectedContact(null)
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

      {usingFallback && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs rounded-xl flex items-center justify-between">
          <span>Đang sử dụng dữ liệu tạm. Vui lòng kiểm tra kết nối database.</span>
          <button onClick={reload} className="p-1 hover:bg-white/5 rounded-lg text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table */}
        <ContactsTable
          contacts={contacts}
          loading={loading}
          page={page}
          total={total}
          totalPages={totalPages}
          onPageChange={(p) => setParams({ page: p })}
          params={params}
          setParams={setParams}
          selectedId={selectedContact?.id ?? null}
          onSelect={(contact) => setSelectedContact(contact)}
        />

        {/* Detail Panel */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5 self-start sticky top-20">
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
                    {selectedContact.name.charAt(selectedContact.name.lastIndexOf(' ') + 1) || selectedContact.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedContact.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">{selectedContact.company || 'Cá nhân'}</div>
                  </div>
                </div>

                <div className="space-y-3 text-sm bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  {[
                    { label: 'Số điện thoại', value: selectedContact.phone },
                    { label: 'Email', value: selectedContact.email || '—' },
                    { label: 'Công ty', value: selectedContact.company || '—' },
                    { label: 'Yêu cầu tư vấn', value: selectedContact.need },
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
                      <option value="CALLED">Đã liên hệ</option>
                      <option value="PROCESSING">Đang xử lý</option>
                      <option value="QUOTED">Đã báo giá</option>
                      <option value="CLOSED">Đã đóng</option>
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
                    placeholder="Nhập tiến độ xử lý..."
                    className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-20"
                  />
                </div>

                <div className="flex gap-2">
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePhoneCall(selectedContact.phone)}
                  >
                    <Phone className="w-3.5 h-3.5" /> Gọi điện
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleZalo(selectedContact.phone)}
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Zalo
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEmail(selectedContact.email)}
                    disabled={!selectedContact.email}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </AdminButton>
                </div>

                <AdminButton
                  size="sm"
                  className="w-full justify-center"
                  loading={saving}
                  onClick={() => saveContact()}
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
                Chọn một liên hệ để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
