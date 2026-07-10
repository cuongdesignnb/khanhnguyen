'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Image as ImageIcon, RotateCcw, Save } from 'lucide-react'
import MediaPicker from '@/components/admin/media-picker'
import { toast } from '@/lib/toast'
import type { MediaItem } from '@/types/admin'

const tabs = [
  ['general.site', 'Chung'], ['brand.identity', 'Thương hiệu'], ['contact.info', 'Liên hệ'],
  ['social.links', 'Mạng xã hội'], ['header.config', 'Đầu trang'], ['footer.config', 'Chân trang'],
  ['home.config', 'Trang chủ'], ['products.config', 'Sản phẩm'], ['services.config', 'Dịch vụ'],
  ['posts.config', 'Tin tức'], ['seo.default', 'SEO'], ['integrations.tracking', 'Tích hợp'],
  ['popup.config', 'Popup/Banner'], ['advanced.config', 'Nâng cao'],
] as const

const labels: Record<string, string> = {
  siteName: 'Tên website', companyName: 'Tên công ty', shortName: 'Tên ngắn', slogan: 'Khẩu hiệu',
  description: 'Mô tả', language: 'Ngôn ngữ', timezone: 'Múi giờ', currency: 'Tiền tệ',
  currencySymbol: 'Ký hiệu tiền tệ', maintenanceMode: 'Chế độ bảo trì', maintenanceMessage: 'Thông báo bảo trì',
  hotline: 'Hotline', hotlineSecondary: 'Hotline phụ', phone: 'Điện thoại', zaloPhone: 'Số Zalo',
  email: 'Email', salesEmail: 'Email kinh doanh', supportEmail: 'Email hỗ trợ', address: 'Địa chỉ',
  showroomAddress: 'Địa chỉ showroom', warehouseAddress: 'Địa chỉ kho', workingHours: 'Giờ làm việc',
  googleMapUrl: 'Google Map URL', googleMapEmbed: 'Mã nhúng Google Map', taxCode: 'Mã số thuế',
  businessLicense: 'Giấy phép kinh doanh', brandColor: 'Màu thương hiệu', accentColor: 'Màu nhấn',
  fontFamily: 'Phông chữ', menuItems: 'Menu chính (JSON)', columns: 'Các cột footer (JSON)',
  bottomLinks: 'Liên kết cuối footer (JSON)', customHeadScript: 'Custom Head Script',
  customBodyScript: 'Custom Body Script', customFooterScript: 'Custom Footer Script',
}
const imageKeys = new Set(['logoId','logoDarkId','logoLightId','faviconId','ogDefaultImageId','heroImageId','promoBannerImageId','categoryBannerDefaultId','defaultPostImageId','ogImageId','imageId','defaultNoImageId'])
const longKeys = /description|message|script|embed|menuItems|columns|bottomLinks/i
const fieldClass = 'w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60'
const humanize = (key: string) => labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())

function Fields({ value, update, chooseImage }: { value: Record<string, any>; update: (key: string, value: any) => void; chooseImage: (key: string) => void }) {
  return <div className="grid gap-5 md:grid-cols-2">{Object.entries(value).map(([key, field]) => {
    if (key === 'menuItems' || key === 'columns') return <div key={key} className="space-y-3 rounded-xl border border-[color:var(--gold)]/20 bg-[color:var(--gold)]/5 p-5 md:col-span-2"><h3 className="font-bold">{key === 'menuItems' ? 'Menu đầu trang' : 'Menu chân trang'}</h3><p className="text-sm text-[color:var(--muted)]">Menu được quản lý bằng giao diện kéo thả riêng, không cần chỉnh JSON.</p><Link href={key === 'menuItems' ? '/admin/menu/header' : '/admin/menu/footer'} className="inline-flex rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black">Quản lý {key === 'menuItems' ? 'Menu đầu trang' : 'Menu chân trang'}</Link></div>
    if (key === 'bottomLinks' && Array.isArray(field)) return <div key={key} className="space-y-3 md:col-span-2"><div className="flex items-center justify-between"><span>Liên kết phụ cuối trang</span><button type="button" onClick={() => update(key, [...field, { label: '', url: '/' }])} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs">+ Thêm link</button></div>{field.map((link: any, index: number) => <div key={index} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-[1fr_1fr_auto]"><input className={fieldClass} placeholder="Tên link" value={link.label} onChange={(e) => update(key, field.map((item: any, i: number) => i === index ? { ...item, label: e.target.value } : item))} /><input className={fieldClass} placeholder="/duong-dan" value={link.url} onChange={(e) => update(key, field.map((item: any, i: number) => i === index ? { ...item, url: e.target.value } : item))} /><button type="button" onClick={() => update(key, field.filter((_: any, i: number) => i !== index))} className="px-3 text-red-300">Xóa</button></div>)}</div>
    if (imageKeys.has(key)) return <div key={key} className="space-y-2"><span className="text-sm">{humanize(key)}</span><div className="flex gap-2"><button type="button" onClick={() => chooseImage(key)} className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm"><ImageIcon size={16} /> Chọn từ Media Library</button>{field && <button type="button" onClick={() => update(key, null)} className="text-xs text-red-300">Xóa ảnh</button>}</div>{field && <p className="break-all text-xs text-[color:var(--muted)]">Media ID: {String(field)}</p>}</div>
    if (typeof field === 'boolean') return <label key={key} className="flex items-center gap-3 rounded-xl border border-white/10 p-4"><input type="checkbox" checked={field} onChange={(e) => update(key, e.target.checked)} /><span>{humanize(key)}</span></label>
    if (typeof field === 'number') return <label key={key} className="space-y-2"><span>{humanize(key)}</span><input className={fieldClass} type="number" value={field} min={0} onChange={(e) => update(key, Number(e.target.value))} /></label>
    if (Array.isArray(field) || (field && typeof field === 'object')) return <div key={key} className="rounded-xl border border-white/10 p-4 text-sm text-[color:var(--muted)] md:col-span-2">Trường {humanize(key)} được hệ thống quản lý tự động.</div>
    const isLong = longKeys.test(key)
    return <label key={key} className={`space-y-2 ${isLong ? 'md:col-span-2' : ''}`}><span>{humanize(key)}</span>{isLong ? <textarea className={`${fieldClass} min-h-28`} value={String(field ?? '')} onChange={(e) => update(key, e.target.value)} /> : <input className={fieldClass} value={String(field ?? '')} type={/email/i.test(key) ? 'email' : 'text'} onChange={(e) => update(key, e.target.value)} />}</label>
  })}</div>
}

export default function SettingsPage() {
  const [active, setActive] = useState<(typeof tabs)[number][0]>('general.site')
  const [all, setAll] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mediaField, setMediaField] = useState<string | null>(null)
  const current = useMemo(() => all[active] || {}, [all, active])
  const load = () => { setLoading(true); fetch('/api/admin/settings').then((r) => r.json()).then((result) => { if (!result.success) throw new Error(result.error); setAll(result.data) }).catch((error) => toast.error(error.message)).finally(() => setLoading(false)) }
  useEffect(load, [])
  const update = (key: string, value: any) => setAll((old) => ({ ...old, [active]: { ...old[active], [key]: value } }))
  const save = async () => { setSaving(true); const result = await fetch(`/api/admin/settings/${encodeURIComponent(active)}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ value: current }) }).then((r) => r.json()); setSaving(false); result.success ? toast.success('Đã lưu cài đặt') : toast.error(result.error) }
  const reset = async () => { if (!confirm('Khôi phục tab này về mặc định?')) return; const result = await fetch('/api/admin/settings/reset', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ group: active }) }).then((r) => r.json()); result.success ? (setAll((old) => ({ ...old, [active]: result.data })), toast.success('Đã khôi phục mặc định')) : toast.error(result.error) }
  return <div className="mx-auto max-w-[1500px] space-y-6 p-6 text-white"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-black">Cài đặt website</h1><p className="text-sm text-[color:var(--muted)]">Quản lý nội dung và hành vi toàn website theo từng lĩnh vực.</p></div><div className="flex gap-2"><Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"><ExternalLink size={15} /> Xem trước</Link><button onClick={reset} className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"><RotateCcw size={15} /> Khôi phục</button><button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-5 py-2 text-sm font-bold text-black disabled:opacity-50"><Save size={15} /> {saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button></div></div>
    <select className={`${fieldClass} md:hidden`} value={active} onChange={(e) => setActive(e.target.value as any)}>{tabs.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
    <div className="hidden flex-wrap gap-2 md:flex">{tabs.map(([id, label]) => <button key={id} onClick={() => setActive(id)} className={`rounded-xl px-3 py-2 text-xs ${active === id ? 'bg-[color:var(--gold)] font-bold text-black' : 'border border-white/10 text-[color:var(--muted)]'}`}>{label}</button>)}<Link href="/admin/cai-dat/ai" className="rounded-xl border border-violet-400/30 px-3 py-2 text-xs text-violet-200">AI/API</Link></div>
    <section className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-6">{loading ? <p>Đang tải cài đặt...</p> : <Fields value={current} update={update} chooseImage={setMediaField} />}</section>
    <MediaPicker isOpen={Boolean(mediaField)} onClose={() => setMediaField(null)} onSelect={(items: MediaItem[]) => { if (mediaField && items[0]) update(mediaField, items[0].id); setMediaField(null) }} />
  </div>
}
