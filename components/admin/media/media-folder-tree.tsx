'use client'

import { useState } from 'react'
import { Check, Folder, FolderPlus, Pencil, Trash2, X } from 'lucide-react'
import type { MediaFolderDto } from '@/types/media'

export default function MediaFolderTree({
  folders,
  selectedFolderId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: {
  folders: MediaFolderDto[]
  selectedFolderId: string
  onSelect: (id: string) => void
  onCreate: (name: string) => Promise<void>
  onRename: (id: string, name: string) => Promise<void>
  onDelete: (folder: MediaFolderDto) => Promise<void>
}) {
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  const submitCreate = async () => {
    if (!name.trim()) return
    setBusy(true)
    try {
      await onCreate(name.trim())
      setName('')
      setCreating(false)
    } finally {
      setBusy(false)
    }
  }

  const submitRename = async (id: string) => {
    if (!name.trim()) return
    setBusy(true)
    try {
      await onRename(id, name.trim())
      setName('')
      setEditingId(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="rounded-xl border border-white/10 bg-[color:var(--surface)]/70 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Thư mục</h2>
        <button type="button" aria-label="Tạo thư mục" onClick={() => { setCreating(true); setEditingId(null); setName('') }} className="rounded-md p-1.5 text-[color:var(--gold)] hover:bg-white/5">
          <FolderPlus aria-hidden size={16} />
        </button>
      </div>
      <div className="space-y-1">
        <FolderButton label="Tất cả Media" count={undefined} active={!selectedFolderId} onClick={() => onSelect('')} />
        <FolderButton label="Chưa phân loại" count={undefined} active={selectedFolderId === 'unfiled'} onClick={() => onSelect('unfiled')} />
        {folders.map((folder) => (
          <div key={folder.id}>
            {editingId === folder.id ? (
              <InlineFolderForm value={name} busy={busy} onChange={setName} onSubmit={() => submitRename(folder.id)} onCancel={() => setEditingId(null)} />
            ) : (
              <div className={`group flex items-center rounded-lg ${selectedFolderId === folder.id ? 'bg-[color:var(--gold)]/10' : 'hover:bg-white/5'}`}>
                <button type="button" onClick={() => onSelect(folder.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-xs">
                  <Folder aria-hidden size={14} className="shrink-0 text-[color:var(--gold)]" />
                  <span className="truncate">{folder.name}</span>
                  <span className="ml-auto text-[10px] text-[color:var(--muted)]">{folder.fileCount}</span>
                </button>
                <button type="button" aria-label={`Đổi tên ${folder.name}`} onClick={() => { setEditingId(folder.id); setCreating(false); setName(folder.name) }} className="p-1 text-[color:var(--muted)] opacity-0 group-hover:opacity-100 focus:opacity-100"><Pencil aria-hidden size={12} /></button>
                <button type="button" aria-label={`Xóa ${folder.name}`} onClick={() => onDelete(folder)} className="mr-1 p-1 text-red-300 opacity-0 group-hover:opacity-100 focus:opacity-100"><Trash2 aria-hidden size={12} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
      {creating && <div className="mt-2"><InlineFolderForm value={name} busy={busy} onChange={setName} onSubmit={submitCreate} onCancel={() => setCreating(false)} /></div>}
    </aside>
  )
}

function FolderButton({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs ${active ? 'bg-[color:var(--gold)]/10 text-[color:var(--gold)]' : 'hover:bg-white/5'}`}>
      <Folder aria-hidden size={14} /> <span>{label}</span>{count !== undefined && <span className="ml-auto">{count}</span>}
    </button>
  )
}

function InlineFolderForm({ value, busy, onChange, onSubmit, onCancel }: { value: string; busy: boolean; onChange: (value: string) => void; onSubmit: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-1">
      <input autoFocus value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSubmit() }} placeholder="Tên thư mục" className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-xs outline-none" />
      <button disabled={busy} type="button" aria-label="Lưu thư mục" onClick={onSubmit} className="rounded-md p-1.5 text-emerald-300"><Check aria-hidden size={13} /></button>
      <button type="button" aria-label="Hủy" onClick={onCancel} className="rounded-md p-1.5 text-[color:var(--muted)]"><X aria-hidden size={13} /></button>
    </div>
  )
}
