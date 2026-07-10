'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from '@/lib/toast'

type Item = { id: string; label: string; url: string; type: string; target: string; icon?: string; badge?: string; isActive: boolean; sortOrder: number; parentId?: string | null; children: Item[] }
const field = 'w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60'
const empty = { id: '', label: '', url: '', type: 'INTERNAL', target: '_self', parentId: '', icon: '', badge: '', isActive: true }

function flatten(items: Item[], depth = 0): Array<Item & { depth: number }> {
  return items.flatMap((item) => [{ ...item, depth }, ...flatten(item.children || [], depth + 1)])
}

function SortableRow({ item, edit, remove }: { item: Item & { depth: number }; edit: () => void; remove: () => void }) {
  const sortable = useSortable({ id: item.id })
  return <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition, marginLeft: Math.min(item.depth, 2) * 28 }} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
    <button {...sortable.attributes} {...sortable.listeners} className="cursor-grab text-[color:var(--muted)]"><GripVertical size={18} /></button>
    <div className="min-w-0 flex-1"><p className="font-semibold">{item.label} {!item.isActive && <span className="text-xs text-amber-300">(Đang ẩn)</span>}</p><p className="truncate text-xs text-[color:var(--muted)]">{item.url}</p></div>
    <button onClick={edit} className="p-2 text-[color:var(--gold)]"><Pencil size={16} /></button>
    <button onClick={remove} className="p-2 text-red-300"><Trash2 size={16} /></button>
  </div>
}

export default function MenuEditor({ location }: { location: 'HEADER' | 'FOOTER' | 'MOBILE' }) {
  const [menu, setMenu] = useState<any>(null)
  const [items, setItems] = useState<Item[]>([])
  const [form, setForm] = useState<any>(empty)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const flat = useMemo(() => flatten(items), [items])
  const load = async () => {
    const list = await fetch('/api/admin/menus').then((r) => r.json())
    const selected = list.data?.find((entry: any) => entry.location === location)
    if (!selected) return
    setMenu(selected)
    const detail = await fetch(`/api/admin/menus/${selected.id}`).then((r) => r.json())
    setItems(detail.data?.items || [])
  }
  useEffect(() => { load(); fetch('/api/admin/route-suggestions?type=all').then((r) => r.json()).then((r) => setSuggestions(r.data || [])) }, [location])
  const parents = flat.filter((item) => item.id !== form.id && item.depth < 2)
  const filtered = search.trim() ? suggestions.filter((item) => `${item.label} ${item.url}`.toLowerCase().includes(search.toLowerCase())).slice(0, 8) : []
  const saveItem = async () => {
    if (!menu) return
    const url = form.id ? `/api/admin/menu-items/${form.id}` : `/api/admin/menus/${menu.id}/items`
    const result = await fetch(url, { method: form.id ? 'PATCH' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) }).then((r) => r.json())
    if (!result.success) return toast.error(result.error)
    toast.success(form.id ? 'Đã cập nhật mục menu' : 'Đã thêm mục menu'); setForm(empty); setSearch(''); load()
  }
  const remove = async (id: string) => {
    if (!confirm('Xóa mục menu này? Menu con sẽ được chuyển lên cấp cao nhất.')) return
    const result = await fetch(`/api/admin/menu-items/${id}`, { method: 'DELETE' }).then((r) => r.json())
    result.success ? (toast.success('Đã xóa mục menu'), load()) : toast.error(result.error)
  }
  const dragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || !menu) return
    const activeItem = flat.find((x) => x.id === active.id); const overItem = flat.find((x) => x.id === over.id)
    if (!activeItem || !overItem || activeItem.parentId !== overItem.parentId) return toast.error('Chỉ kéo sắp xếp trong cùng cấp; dùng “Menu cha” để đổi cấp.')
    const siblings = flat.filter((x) => (x.parentId || null) === (activeItem.parentId || null))
    const moved = arrayMove(siblings, siblings.findIndex((x) => x.id === active.id), siblings.findIndex((x) => x.id === over.id))
    const payload = moved.map((item, index) => ({ id: item.id, parentId: item.parentId || null, sortOrder: index }))
    const result = await fetch(`/api/admin/menus/${menu.id}/reorder`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: payload }) }).then((r) => r.json())
    result.success ? (toast.success('Đã lưu thứ tự'), load()) : toast.error(result.error)
  }
  const title = location === 'HEADER' ? 'Menu đầu trang' : location === 'FOOTER' ? 'Menu chân trang' : 'Menu di động'
  return <div className="mx-auto max-w-7xl space-y-6 p-6 text-white">
    <div className="flex justify-between"><div><h1 className="text-2xl font-black">Quản lý {title}</h1><p className="text-sm text-[color:var(--muted)]">Kéo thả để sắp xếp; chọn menu cha để tạo phân cấp.</p></div><Link href="/" target="_blank" className="rounded-xl border border-white/15 px-4 py-2 text-sm">Xem ngoài website</Link></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]"><DndContext collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={flat.map((x) => x.id)} strategy={verticalListSortingStrategy}><div className="space-y-2 rounded-2xl border border-white/10 p-5">{!menu ? <p>Đang tải menu...</p> : flat.length ? flat.map((item) => <SortableRow key={item.id} item={item} edit={() => setForm({ ...item, parentId: item.parentId || '' })} remove={() => remove(item.id)} />) : <p>Chưa có mục menu nào.</p>}</div></SortableContext></DndContext>
      <div className="space-y-4 rounded-2xl border border-white/10 p-5"><h2 className="font-bold">{form.id ? 'Sửa mục menu' : 'Thêm mục menu'}</h2>
        <label className="block space-y-1"><span>Tìm route nội bộ</span><input className={field} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nhập tên trang, sản phẩm..." /></label>
        {filtered.length > 0 && <div className="max-h-48 overflow-auto rounded-xl border border-white/10">{filtered.map((x) => <button key={`${x.type}-${x.url}`} onClick={() => { setForm((old: any) => ({ ...old, label: x.label, url: x.url, type: x.type === 'product' ? 'PRODUCT' : x.type === 'service' ? 'SERVICE' : x.type === 'post' ? 'POST' : x.type === 'category' ? 'CATEGORY' : 'INTERNAL' })); setSearch('') }} className="block w-full border-b border-white/5 p-3 text-left text-sm hover:bg-white/5"><b>{x.label}</b><br/><span className="text-xs text-[color:var(--muted)]">{x.url}</span></button>)}</div>}
        <label className="block space-y-1"><span>Tên hiển thị</span><input className={field} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></label>
        <label className="block space-y-1"><span>Loại link</span><select className={field} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, target: e.target.value === 'EXTERNAL' ? '_blank' : '_self' })}>{['INTERNAL','CATEGORY','PRODUCT','SERVICE','POST','EXTERNAL','CUSTOM'].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="block space-y-1"><span>Link/Route</span><input className={field} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
        <label className="block space-y-1"><span>Menu cha</span><select className={field} value={form.parentId || ''} onChange={(e) => setForm({ ...form, parentId: e.target.value })}><option value="">Không có (cấp 1)</option>{parents.map((x) => <option key={x.id} value={x.id}>{'— '.repeat(x.depth)}{x.label}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3"><label className="space-y-1"><span>Icon</span><input className={field} value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></label><label className="space-y-1"><span>Badge</span><input className={field} value={form.badge || ''} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></label></div>
        <label className="flex gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Hiển thị mục menu</label>
        <div className="flex gap-2"><button onClick={saveItem} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[color:var(--gold)] py-3 font-bold text-black"><Save size={16}/>{form.id ? 'Cập nhật' : 'Thêm mục menu'}</button>{form.id && <button onClick={() => setForm(empty)} className="rounded-xl border border-white/15 px-4">Hủy</button>}</div>
      </div></div>
  </div>
}
