'use client'

import { useState, useEffect } from 'react'
import { adminContacts } from '@/data/admin'
import Link from 'next/link'
import AdminStatusBadge from '../admin-status-badge'
import { adminApi } from '@/lib/admin-api'
import { mapContactToAdminItem } from '@/lib/admin-mappers'
import type { ContactAdminItem } from '@/types/admin'

export default function RecentContactsPanel() {
  const [contacts, setContacts] = useState<ContactAdminItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .getContacts({ page: 1, limit: 5 })
      .then((res) => {
        if (res.items) {
          setContacts(res.items.map(mapContactToAdminItem))
        } else {
          setContacts(adminContacts.slice(0, 5))
        }
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách liên hệ gần đây:', err)
        setContacts(adminContacts.slice(0, 5))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[color:var(--text)]">Liên hệ mới nhất</h3>
        <Link href="/admin/contacts" className="text-xs text-[color:var(--gold)] hover:underline">
          Xem tất cả →
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-10 text-center text-xs text-[color:var(--muted)]">Đang tải...</div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/20 flex items-center justify-center shrink-0">
                <span className="text-[color:var(--gold)] text-xs font-bold">
                  {contact.name.charAt(contact.name.lastIndexOf(' ') + 1) || contact.name[0]}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[color:var(--text)] truncate">{contact.name}</div>
                <div className="text-[11px] text-[color:var(--muted)] truncate">{contact.company || 'Cá nhân'}</div>
              </div>

              {/* Email */}
              <div className="hidden sm:block text-[11px] text-[color:var(--muted)] truncate max-w-[140px]">
                {contact.email || '—'}
              </div>

              {/* Status */}
              <AdminStatusBadge status={contact.status} />

              {/* Time */}
              <div className="text-right shrink-0">
                <div className="text-[11px] text-[color:var(--muted)]">{contact.time}</div>
                <div className="text-[10px] text-[color:var(--muted)]/60">{contact.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
