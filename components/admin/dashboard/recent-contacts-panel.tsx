'use client'

import { adminContacts } from '@/data/admin'
import Link from 'next/link'
import AdminStatusBadge from '../admin-status-badge'

export default function RecentContactsPanel() {
  const recentContacts = adminContacts.slice(0, 5)

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
        {recentContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/20 flex items-center justify-center shrink-0">
              <span className="text-[color:var(--gold)] text-sm font-bold">
                {contact.name.charAt(contact.name.lastIndexOf(' ') + 1)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[color:var(--text)] truncate">{contact.name}</div>
              <div className="text-[11px] text-[color:var(--muted)] truncate">{contact.company}</div>
            </div>

            {/* Email */}
            <div className="hidden sm:block text-[11px] text-[color:var(--muted)] truncate max-w-[140px]">
              {contact.email}
            </div>

            {/* Status */}
            <AdminStatusBadge status={contact.status} />

            {/* Time */}
            <div className="text-right shrink-0">
              <div className="text-[11px] text-[color:var(--muted)]">{contact.time}</div>
              <div className="text-[10px] text-[color:var(--muted)]/60">{contact.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
