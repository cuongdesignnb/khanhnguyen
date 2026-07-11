'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from '@/lib/toast'

type RedirectItem = { id: string; sourcePath: string; targetPath: string; isActive: boolean; hitCount: number }
const inputClass = 'rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60'

export default function RedirectManager() {
  const [items, setItems] = useState<RedirectItem[]>([])
  const [sourcePath, setSourcePath] = useState('')
  const [targetPath, setTargetPath] = useState('')
  const load = () => fetch('/api/admin/seo/redirects').then((response) => response.json()).then((result) => result.success ? setItems(result.data) : toast.error(result.error))
  useEffect(() => { void load() }, [])
  const add = async () => {
    const result = await fetch('/api/admin/seo/redirects', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sourcePath, targetPath }) }).then((response) => response.json())
    if (!result.success) return toast.error(result.error)
    setSourcePath(''); setTargetPath(''); load(); toast.success('Đã tạo chuyển hướng 301')
  }
  const toggle = async (item: RedirectItem) => { await fetch(`/api/admin/seo/redirects/${item.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) }); load() }
  const remove = async (item: RedirectItem) => { if (!confirm(`Xóa chuyển hướng ${item.sourcePath}?`)) return; await fetch(`/api/admin/seo/redirects/${item.id}`, { method: 'DELETE' }); load() }
  return <div className="space-y-5">
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-[color:var(--surface)] p-5 md:grid-cols-[1fr_1fr_auto]"><input className={inputClass} value={sourcePath} onChange={(event) => setSourcePath(event.target.value)} placeholder="/duong-dan-cu" /><input className={inputClass} value={targetPath} onChange={(event) => setTargetPath(event.target.value)} placeholder="/duong-dan-moi" /><button onClick={add} className="flex items-center justify-center gap-2 rounded-xl bg-[color:var(--gold)] px-5 py-2.5 font-bold text-black"><Plus size={16} /> Thêm 301</button></div>
    <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5 text-[color:var(--muted)]"><tr><th className="p-4">Đường dẫn cũ</th><th className="p-4">Đường dẫn mới</th><th className="p-4">Lượt dùng</th><th className="p-4">Bật</th><th className="p-4"></th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-white/10"><td className="p-4 font-mono">{item.sourcePath}</td><td className="p-4 font-mono">{item.targetPath}</td><td className="p-4">{item.hitCount}</td><td className="p-4"><input type="checkbox" checked={item.isActive} onChange={() => toggle(item)} /></td><td className="p-4"><button aria-label="Xóa" onClick={() => remove(item)} className="text-red-300"><Trash2 size={16} /></button></td></tr>)}</tbody></table>{items.length === 0 && <p className="p-8 text-center text-[color:var(--muted)]">Chưa có chuyển hướng.</p>}</div>
  </div>
}
