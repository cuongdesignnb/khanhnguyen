'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/lib/toast'

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none'

export default function AiBulkPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [running, setRunning] = useState(false)
  const [form, setForm] = useState({ inputRaw: '', postCategoryId: '', publishMode: 'DRAFT', scheduledStartAt: '', scheduleIntervalMin: 60, generateFeaturedImage: true, generateHeadingImages: true, maxHeadingImages: 3, wordCount: 1500, tone: 'Chuyên gia tư vấn xe nâng, dễ hiểu, bán hàng nhẹ', language: 'vi' })
  useEffect(() => { fetch('/api/admin/post-categories').then((r) => r.json()).then((r) => setCategories(r.data?.items || r.data || [])).catch(() => undefined) }, [])
  const update = (key: string, value: any) => setForm((old) => ({ ...old, [key]: value }))
  const start = async () => {
    if (!confirm('Bắt đầu sinh hàng loạt? Job sẽ tiếp tục chạy ở máy chủ.')) return
    setRunning(true)
    const created = await fetch('/api/admin/ai/news/bulk-jobs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) }).then((r) => r.json())
    if (!created.success) { setRunning(false); return toast.error(created.error) }
    const started = await fetch(`/api/admin/ai/news/bulk-jobs/${created.data.jobId}/run`, { method: 'POST' }).then((r) => r.json())
    setRunning(false)
    if (!started.success) return toast.error(started.error)
    toast.success('Job AI đã được tạo và đang chạy nền')
    router.push(`/admin/tin-tuc/ai/lich-su/${created.data.jobId}`)
  }
  return <div className="mx-auto max-w-6xl space-y-6 p-6 text-white"><div><h1 className="text-2xl font-black">Sinh bài hàng loạt bằng AI</h1><p className="text-sm text-[color:var(--muted)]">Mỗi dòng, dấu phẩy hoặc dấu chấm phẩy được tính là một từ khóa.</p></div><div className="grid gap-6 lg:grid-cols-3"><div className="lg:col-span-2"><textarea className={`${inputClass} min-h-80`} placeholder="Dán mỗi từ khóa trên một dòng" value={form.inputRaw} onChange={(e) => update('inputRaw', e.target.value)} /></div><div className="space-y-4 rounded-2xl border border-white/10 p-5">
    <label className="block space-y-1"><span>Danh mục</span><select className={inputClass} value={form.postCategoryId} onChange={(e) => update('postCategoryId', e.target.value)}><option value="">Không chọn</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="block space-y-1"><span>Trạng thái</span><select className={inputClass} value={form.publishMode} onChange={(e) => update('publishMode', e.target.value)}><option value="DRAFT">Lưu nháp</option><option value="PUBLISH_NOW">Đăng ngay</option><option value="SCHEDULED">Hẹn lịch</option></select></label>
    {form.publishMode === 'SCHEDULED' && <><input className={inputClass} type="datetime-local" value={form.scheduledStartAt} onChange={(e) => update('scheduledStartAt', e.target.value)} /><select className={inputClass} value={form.scheduleIntervalMin} onChange={(e) => update('scheduleIntervalMin', +e.target.value)}><option value={15}>15 phút</option><option value={30}>30 phút</option><option value={60}>1 giờ</option><option value={120}>2 giờ</option></select></>}
    <label className="flex gap-2"><input type="checkbox" checked={form.generateFeaturedImage} onChange={(e) => update('generateFeaturedImage', e.target.checked)} /> Sinh ảnh đại diện</label><label className="flex gap-2"><input type="checkbox" checked={form.generateHeadingImages} onChange={(e) => update('generateHeadingImages', e.target.checked)} /> Sinh ảnh theo heading</label>
    <label className="block space-y-1"><span>Số ảnh heading</span><input className={inputClass} type="number" min={0} max={10} value={form.maxHeadingImages} onChange={(e) => update('maxHeadingImages', +e.target.value)} /></label>
    <label className="block space-y-1"><span>Độ dài bài</span><input className={inputClass} type="number" min={500} max={3000} value={form.wordCount} onChange={(e) => update('wordCount', +e.target.value)} /></label>
    <button onClick={start} disabled={running || !form.inputRaw.trim()} className="w-full rounded-xl bg-[color:var(--gold)] py-3 font-bold text-black disabled:opacity-50">{running ? 'Đang tạo job...' : 'Bắt đầu sinh bài'}</button>
  </div></div></div>
}
