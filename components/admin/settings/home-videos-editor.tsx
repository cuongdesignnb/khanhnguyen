'use client'

import Image from 'next/image'
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2, Video } from 'lucide-react'
import MediaPreviewPicker from '@/components/admin/media/media-preview-picker'
import { normalizeVideoUrl } from '@/lib/videos/normalize-video-url'
import type { HomeVideoSettingItem, HomeVideoSource } from '@/types/home-video'

const inputClass = 'w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60'

function newItem(index: number): HomeVideoSettingItem {
  return { id: crypto.randomUUID(), title: '', source: 'youtube', url: '', thumbnailId: null, isEnabled: true, sortOrder: index }
}

function normalizeOrder(items: HomeVideoSettingItem[]) {
  return items.map((item, index) => ({ ...item, sortOrder: index }))
}

export default function HomeVideosEditor({ value, onChange }: { value: HomeVideoSettingItem[]; onChange: (value: HomeVideoSettingItem[]) => void }) {
  const validItems = value.slice(0, 12)
  const normalizedUrls = validItems.map((item) => normalizeVideoUrl(item.url)?.embedUrl || '')

  function update(index: number, patch: Partial<HomeVideoSettingItem>) {
    onChange(validItems.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item))
  }

  function updateUrl(index: number, url: string) {
    const normalized = normalizeVideoUrl(url)
    update(index, { url, ...(normalized ? { source: normalized.source } : {}) })
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= validItems.length) return
    const next = [...validItems]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(normalizeOrder(next))
  }

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-semibold">Danh sách video</p><p className="mt-1 text-xs text-[color:var(--muted)]">Tối đa 12 video. Video chỉ được tải khi khách truy cập bấm xem.</p></div>
        <button type="button" disabled={validItems.length >= 12} onClick={() => onChange([...validItems, newItem(validItems.length)])} className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-4 py-2.5 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"><Plus aria-hidden size={16} />Thêm video</button>
      </div>

      {validItems.length === 0 && <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-white/15 text-center text-sm text-[color:var(--muted)]"><div><Video className="mx-auto mb-2" aria-hidden />Chưa có video nào. Section Video ngoài Trang chủ sẽ được ẩn.</div></div>}

      {validItems.map((item, index) => {
        const normalized = normalizeVideoUrl(item.url)
        const duplicate = Boolean(normalizedUrls[index] && normalizedUrls.some((url, urlIndex) => urlIndex !== index && url === normalizedUrls[index]))
        return (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-bold text-white">Video {index + 1}</p>
              <div className="flex items-center gap-1">
                <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Di chuyển video ${index + 1} lên`} className="grid size-10 place-items-center rounded-lg border border-white/10 disabled:opacity-30"><ArrowUp aria-hidden size={16} /></button>
                <button type="button" disabled={index === validItems.length - 1} onClick={() => move(index, 1)} aria-label={`Di chuyển video ${index + 1} xuống`} className="grid size-10 place-items-center rounded-lg border border-white/10 disabled:opacity-30"><ArrowDown aria-hidden size={16} /></button>
                <button type="button" onClick={() => onChange(normalizeOrder(validItems.filter((_, itemIndex) => itemIndex !== index)))} aria-label={`Xóa video ${index + 1}`} className="grid size-10 place-items-center rounded-lg border border-red-400/20 text-red-300"><Trash2 aria-hidden size={16} /></button>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.4fr)]">
              <div className="space-y-3">
                <MediaPreviewPicker value={item.thumbnailId} label="Ảnh đại diện" description={item.source === 'facebook' ? 'Facebook không tự lấy thumbnail; nên chọn một ảnh.' : 'Ảnh Media được ưu tiên hơn thumbnail YouTube.'} aspectRatio="video" onChange={(thumbnailId) => update(index, { thumbnailId })} />
                {!item.thumbnailId && normalized?.autoThumbnailUrl && <div><p className="mb-2 text-xs text-[color:var(--muted)]">Thumbnail YouTube tự động</p><div className="relative aspect-video overflow-hidden rounded-xl border border-white/10"><Image src={normalized.autoThumbnailUrl} alt="" fill sizes="400px" className="object-cover" /></div></div>}
              </div>

              <div className="grid content-start gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Tiêu đề</span><input className={inputClass} value={item.title} maxLength={180} onChange={(event) => update(index, { title: event.target.value })} /></label>
                <label><span className="mb-2 block text-sm font-semibold">Nguồn video</span><select className={inputClass} value={item.source} onChange={(event) => update(index, { source: event.target.value as HomeVideoSource })}><option value="youtube">YouTube</option><option value="facebook">Facebook</option></select></label>
                <div><span className="mb-2 block text-sm font-semibold">Trạng thái</span><button type="button" role="switch" aria-checked={item.isEnabled} onClick={() => update(index, { isEnabled: !item.isEnabled })} className={`relative h-7 w-12 rounded-full ${item.isEnabled ? 'bg-[color:var(--gold)]' : 'bg-white/15'}`}><span className={`absolute top-1 size-5 rounded-full bg-white transition ${item.isEnabled ? 'left-6' : 'left-1'}`} /></button></div>
                <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">URL video</span><input className={inputClass} type="url" placeholder="https://www.youtube.com/watch?v=..." value={item.url} onChange={(event) => updateUrl(index, event.target.value)} /></label>
                {item.url && !normalized && <p className="sm:col-span-2 text-sm text-red-300">Liên kết YouTube/Facebook không hợp lệ hoặc không được hỗ trợ.</p>}
                {normalized && normalized.source !== item.source && <p className="sm:col-span-2 text-sm text-red-300">Nguồn đã chọn không khớp với liên kết video.</p>}
                {duplicate && <p className="sm:col-span-2 text-sm text-red-300">Liên kết video đang bị trùng.</p>}
                {normalized && <a href={normalized.originalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--gold)]">Xem thử trên nền tảng<ExternalLink aria-hidden size={15} /></a>}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
