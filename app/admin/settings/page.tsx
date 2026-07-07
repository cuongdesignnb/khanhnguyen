'use client'

import { useState } from 'react'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import { adminSettings } from '@/data/admin'
import { Save, X, Pencil } from 'lucide-react'
import { iconMap } from '@/components/admin/icon-map'

export default function SettingsPage() {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div>
      <AdminPageHeader
        title="Cài đặt website"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Cài đặt website' },
        ]}
        actions={
          <AdminButton icon={<Save className="w-4 h-4" />}>Lưu thay đổi</AdminButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {adminSettings.map((setting) => {
          const Icon = iconMap[setting.icon]
          const isEditing = editingId === setting.id

          return (
            <div
              key={setting.id}
              className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 hover:border-[color:var(--gold)]/20 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[color:var(--gold)]/10 flex items-center justify-center shrink-0">
                  {Icon ? (
                    <Icon className="w-5 h-5 text-[color:var(--gold)]" />
                  ) : (
                    <span className="text-[color:var(--gold)] text-sm font-bold">
                      {setting.label.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[color:var(--silver)] mb-1">
                    {setting.label}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      {setting.type === 'textarea' ? (
                        <textarea
                          defaultValue={setting.value}
                          className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-[color:var(--text)] outline-none focus:border-[color:var(--gold)]/50 resize-none h-16"
                        />
                      ) : (
                        <input
                          type="text"
                          defaultValue={setting.value}
                          className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-[color:var(--text)] outline-none focus:border-[color:var(--gold)]/50"
                        />
                      )}
                      <div className="flex gap-2">
                        <AdminButton size="sm" className="flex-1">
                          <Save className="w-3 h-3" /> Lưu
                        </AdminButton>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] text-[color:var(--muted)] truncate">
                        {setting.value}
                      </div>
                      <button
                        onClick={() => setEditingId(setting.id)}
                        className="text-xs text-[color:var(--gold)] hover:text-[color:var(--gold-strong)] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        Sửa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
