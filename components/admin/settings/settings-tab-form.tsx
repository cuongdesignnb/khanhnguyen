'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import type { SettingsTabDefinition } from '@/types/settings'
import MediaPreviewPicker from '@/components/admin/media/media-preview-picker'
import GoogleSearchPreview from '@/components/admin/seo/google-search-preview'
import SeoSocialPreview from '@/components/admin/seo/seo-social-preview'
import SettingsColorPicker from './settings-color-picker'
import HeaderUtilityItemsEditor from './header-utility-items-editor'
import ProductSpecPriorityEditor from './product-spec-priority-editor'
import HomeVideosEditor from './home-videos-editor'
import type { HomeVideoSettingItem } from '@/types/home-video'

const input = 'w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60'

export default function SettingsTabForm({ tab }: { tab: SettingsTabDefinition }) {
  const [value, setValue] = useState<Record<string, any>>({})
  const [original, setOriginal] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const dirty = useMemo(() => JSON.stringify(value) !== JSON.stringify(original), [value, original])
  const update = (key: string, nextValue: any) => setValue((old) => ({ ...old, [key]: nextValue }))

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/settings/${encodeURIComponent(tab.group)}`)
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) throw Error(result.error)
        setValue(result.data)
        setOriginal(result.data)
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [tab.group])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    addEventListener('beforeunload', handleBeforeUnload)
    return () => removeEventListener('beforeunload', handleBeforeUnload)
  }, [dirty])

  async function save() {
    setSaving(true)
    const response = await fetch(`/api/admin/settings/${encodeURIComponent(tab.group)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value }),
    })
    const result = await response.json()
    setSaving(false)
    if (result.success) {
      setOriginal(value)
      toast.success('Đã lưu cài đặt')
    } else toast.error(result.error)
  }

  async function reset() {
    if (!confirm('Thao tác này sẽ thay thế cấu hình hiện tại bằng dữ liệu mặc định. Bạn có chắc chắn?')) return
    const result = await fetch('/api/admin/settings/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ group: tab.group }),
    }).then((response) => response.json())
    if (result.success) {
      setValue(result.data)
      setOriginal(result.data)
      toast.success('Đã khôi phục mặc định')
    } else toast.error(result.error)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-2xl font-black">{tab.title}</h1><p className="mt-1 max-w-3xl text-sm text-[color:var(--muted)]">{tab.description}</p></div>
        {tab.previewUrl && <Link target="_blank" href={tab.previewUrl} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"><ExternalLink size={15} />Xem ngoài website</Link>}
      </header>
      <section className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-5 md:p-6">
        {loading ? <p>Đang tải cài đặt...</p> : (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              {tab.fields.map((field) => <Field key={field.key} field={field} value={value[field.key]} update={(nextValue) => update(field.key, nextValue)} />)}
            </div>
            {tab.slug === 'dau-trang' && <div className="mt-6 space-y-4"><HeaderUtilityItemsEditor label="Top Header bên trái" value={value.utilityLeft || []} onChange={(nextValue) => update('utilityLeft', nextValue)} /><HeaderUtilityItemsEditor label="Top Header bên phải" value={value.utilityRight || []} onChange={(nextValue) => update('utilityRight', nextValue)} /></div>}
            {tab.slug === 'seo' && <div className="mt-8 grid gap-6 xl:grid-cols-2"><div><h2 className="mb-3 font-bold">Xem trước trên Google</h2><GoogleSearchPreview siteName={value.siteName || 'Khanh Nguyên'} url={value.siteUrl || 'https://khanhnguyen.vn'} title={value.defaultTitle || ''} description={value.defaultDescription || ''} /></div><div><h2 className="mb-3 font-bold">Xem trước chia sẻ mạng xã hội</h2><SeoSocialPreview title={value.defaultTitle || ''} description={value.defaultDescription || ''} /></div></div>}
          </>
        )}
      </section>
      <div className="sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur">
        <span className="mr-auto text-sm text-[color:var(--muted)]">{dirty ? 'Thay đổi chưa được lưu' : 'Mọi thay đổi đã được lưu'}</span>
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm"><RotateCcw size={15} />Khôi phục mặc định</button>
        {dirty && <button onClick={() => setValue(original)} className="px-3 py-2 text-sm">Hủy thay đổi</button>}
        <button disabled={!dirty || saving} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black disabled:opacity-40"><Save size={15} />{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
      </div>
    </div>
  )
}

function Field({ field, value, update }: { field: any; value: any; update: (value: any) => void }) {
  if (field.type === 'color') return <SettingsColorPicker label={field.label} description={field.description} value={value || '#F5B51B'} onChange={update} />
  if (field.type === 'media') return <div className="md:col-span-2"><MediaPreviewPicker value={value} label={field.label} description={field.description} aspectRatio={/logo/i.test(field.key) ? 'logo' : /favicon/i.test(field.key) ? 'favicon' : /og/i.test(field.key) ? 'video' : 'wide'} onChange={update} /></div>
  if (field.type === 'product-spec-priority') return <ProductSpecPriorityEditor value={Array.isArray(value) ? value : []} onChange={update} />
  if (field.type === 'home-videos') return <HomeVideosEditor value={Array.isArray(value) ? value as HomeVideoSettingItem[] : []} onChange={update} />

  return (
    <div className={field.type === 'textarea' || field.type === 'repeater' ? 'md:col-span-2' : ''}>
      <label className="mb-2 block text-sm font-semibold">{field.label}</label>
      {field.type === 'switch' ? <button type="button" role="switch" aria-checked={Boolean(value)} onClick={() => update(!value)} className={`relative h-7 w-12 rounded-full ${value ? 'bg-[color:var(--gold)]' : 'bg-white/15'}`}><span className={`absolute top-1 size-5 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} /></button>
        : field.type === 'textarea' ? <textarea className={`${input} min-h-28`} value={value ?? ''} onChange={(event) => update(event.target.value)} />
        : field.type === 'number' ? <input className={input} type="number" min={field.min} max={field.max} value={value ?? 0} onChange={(event) => update(Number(event.target.value))} />
        : field.type === 'select' ? <select className={input} value={value ?? ''} onChange={(event) => update(event.target.value)}>{field.options?.map((option: any) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        : field.type === 'repeater' ? <Repeater value={Array.isArray(value) ? value : []} onChange={update} />
        : <input className={input} type={field.type === 'url' ? 'url' : 'text'} value={value ?? ''} onChange={(event) => update(event.target.value)} />}
    </div>
  )
}

function Repeater({ value, onChange }: { value: any[]; onChange: (value: any[]) => void }) {
  return (
    <div className="space-y-2">
      <button type="button" onClick={() => onChange([...value, { label: '', url: '/', isEnabled: true }])} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"><Plus size={14} />Thêm mục</button>
      {value.map((item, index) => <div key={index} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-[1fr_1fr_auto]"><input className={input} placeholder="Tên hiển thị" value={item.label || item.title || ''} onChange={(event) => onChange(value.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: event.target.value } : entry))} /><input className={input} placeholder="Liên kết" value={item.url || ''} onChange={(event) => onChange(value.map((entry, entryIndex) => entryIndex === index ? { ...entry, url: event.target.value } : entry))} /><button aria-label="Xóa mục" onClick={() => onChange(value.filter((_, entryIndex) => entryIndex !== index))} className="px-3 text-red-300"><Trash2 size={16} /></button></div>)}
    </div>
  )
}
