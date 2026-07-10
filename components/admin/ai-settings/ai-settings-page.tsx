'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/lib/toast'

const field = 'w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60'

export default function AiSettingsPage() {
  const [form, setForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  useEffect(() => { fetch('/api/admin/ai/settings').then((r) => r.json()).then((r) => setForm(r.data)).catch(() => toast.error('Không tải được cài đặt AI')) }, [])
  if (!form) return <div className="p-8 text-white">Đang tải cài đặt AI...</div>
  const set = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }))
  const save = async () => {
    setSaving(true)
    const response = await fetch('/api/admin/ai/settings', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) })
    const result = await response.json()
    setSaving(false)
    result.success ? (setForm(result.data), toast.success('Đã lưu cài đặt AI')) : toast.error(result.error)
  }
  const test = async () => {
    toast.info('Đang kiểm tra kết nối...')
    const result = await fetch('/api/admin/ai/test', { method: 'POST' }).then((r) => r.json())
    result.success ? toast.success('Kết nối OpenAI thành công') : toast.error(result.error)
  }
  return <div className="mx-auto max-w-5xl space-y-6 p-6 text-white">
    <div><h1 className="text-2xl font-black">Cài đặt AI / OpenAI API</h1><p className="mt-1 text-sm text-[color:var(--muted)]">API key được mã hóa và không bao giờ trả về trình duyệt.</p></div>
    <div className="grid gap-5 rounded-2xl border border-white/10 bg-[color:var(--surface)] p-6 md:grid-cols-2">
      <label className="flex items-center gap-3 md:col-span-2"><input type="checkbox" checked={form.isEnabled} onChange={(e) => set('isEnabled', e.target.checked)} /><span>Bật tính năng AI</span></label>
      <label className="space-y-2 md:col-span-2"><span>OpenAI API key {form.hasApiKey && <small className="text-emerald-400">({form.maskedApiKey})</small>}</span><input className={field} type="password" value={form.apiKey || ''} placeholder={form.hasApiKey ? 'Để trống nếu không thay đổi' : 'sk-...'} onChange={(e) => set('apiKey', e.target.value)} autoComplete="new-password" /></label>
      <label className="space-y-2"><span>Text model</span><input className={field} value={form.textModel} onChange={(e) => set('textModel', e.target.value)} /></label>
      <label className="space-y-2"><span>Image model</span><input className={field} value={form.imageModel} onChange={(e) => set('imageModel', e.target.value)} /></label>
      <label className="space-y-2"><span>Số bài tối đa/lần</span><input className={field} type="number" min={1} max={50} value={form.maxBulkItems} onChange={(e) => set('maxBulkItems', +e.target.value)} /></label>
      <label className="space-y-2"><span>Độ dài mặc định</span><input className={field} type="number" min={500} max={3000} value={form.defaultWordCount} onChange={(e) => set('defaultWordCount', +e.target.value)} /></label>
      <label className="space-y-2"><span>Số ảnh heading tối đa</span><input className={field} type="number" min={0} max={10} value={form.maxHeadingImages} onChange={(e) => set('maxHeadingImages', +e.target.value)} /></label>
      <label className="space-y-2"><span>Tone mặc định</span><input className={field} value={form.defaultTone || ''} onChange={(e) => set('defaultTone', e.target.value)} /></label>
      {[['systemPrompt','Prompt hệ thống'],['articlePrompt','Prompt viết bài'],['imagePrompt','Prompt sinh ảnh']].map(([key,label]) => <label key={key} className="space-y-2 md:col-span-2"><span>{label}</span><textarea className={`${field} min-h-32`} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} /></label>)}
      <div className="flex gap-3 md:col-span-2"><button onClick={test} className="rounded-xl border border-white/15 px-4 py-2 text-sm">Kiểm tra kết nối</button><button onClick={save} disabled={saving} className="rounded-xl bg-[color:var(--gold)] px-5 py-2 text-sm font-bold text-black disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button></div>
    </div>
  </div>
}
