'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import { adminSettings } from '@/data/admin'
import { Save, X, RefreshCw } from 'lucide-react'
import { iconMap } from '@/components/admin/icon-map'
import { adminApi } from '@/lib/admin-api'
import { toast } from '@/lib/toast'

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getSettings()
      // Map icons to match the UI icons list based on setting key/group
      const mapped = data.map((s: any) => {
        let icon = 'Settings'
        if (s.key.includes('phone') || s.key.includes('hotline')) icon = 'Phone'
        else if (s.key.includes('email')) icon = 'Mail'
        else if (s.key.includes('address')) icon = 'MapPin'
        else if (s.key.includes('social') || s.key.includes('facebook') || s.key.includes('zalo')) icon = 'Share2'
        else if (s.key.includes('meta') || s.key.includes('seo') || s.key.includes('title')) icon = 'Globe'

        return {
          id: s.id,
          key: s.key,
          label: s.label,
          value: s.value,
          type: s.type || 'text',
          icon,
        }
      })
      setSettings(mapped)
      setUsingFallback(false)
    } catch (err) {
      console.error('Lỗi tải cài đặt:', err)
      // Fallback
      setSettings(adminSettings)
      setUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleEditClick = (setting: any) => {
    setEditingId(setting.id)
    setEditValue(setting.value)
  }

  const handleSaveSetting = async (setting: any) => {
    setSavingId(setting.id)
    try {
      await adminApi.updateSetting(setting.key, { value: editValue })
      toast.success(`Cập nhật "${setting.label}" thành công`)
      setEditingId(null)
      loadSettings()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi cập nhật cài đặt')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Cài đặt website"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Cài đặt website' },
        ]}
      />

      {usingFallback && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs rounded-xl flex items-center justify-between animate-fade-in">
          <span>Đang sử dụng dữ liệu tạm. Vui lòng kiểm tra kết nối database.</span>
          <button onClick={loadSettings} className="p-1 hover:bg-white/5 rounded-lg text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading && settings.length === 0 ? (
        <div className="py-20 flex justify-center">
          <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {settings.map((setting) => {
            const Icon = iconMap[setting.icon] || iconMap.Settings
            const isEditing = editingId === setting.id

            return (
              <div
                key={setting.id}
                className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl p-4 hover:border-[color:var(--gold)]/20 transition-colors group flex flex-col justify-between"
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
                    <div className="text-xs font-semibold text-[color:var(--silver)] mb-1">
                      {setting.label}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        {setting.type === 'textarea' ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[color:var(--gold)]/50 resize-none h-16"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[color:var(--gold)]/50"
                          />
                        )}
                        <div className="flex gap-2">
                          <AdminButton
                            size="sm"
                            className="flex-1 justify-center"
                            loading={savingId === setting.id}
                            onClick={() => handleSaveSetting(setting)}
                          >
                            <Save className="w-3 h-3 mr-1" /> Lưu
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
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="text-[11px] text-[color:var(--muted)] truncate max-w-[150px]" title={setting.value}>
                          {setting.value}
                        </div>
                        <button
                          onClick={() => handleEditClick(setting)}
                          className="text-xs text-[color:var(--gold)] hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shrink-0 font-medium"
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
      )}
    </div>
  )
}
