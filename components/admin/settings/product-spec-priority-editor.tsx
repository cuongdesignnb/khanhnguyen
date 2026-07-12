'use client'

import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { PRODUCT_SPEC_OPTIONS } from '@/types/product-card-settings'

export default function ProductSpecPriorityEditor({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const selected = value.filter((key) => PRODUCT_SPEC_OPTIONS.some((option) => option.value === key)).slice(0, 3)

  function toggle(key: string) {
    if (selected.includes(key)) return onChange(selected.filter((item) => item !== key))
    if (selected.length < 3) onChange([...selected, key])
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return
    const from = selected.indexOf(String(event.active.id))
    const to = selected.indexOf(String(event.over.id))
    onChange(arrayMove(selected, from, to))
  }

  return (
    <div className="space-y-4 rounded-xl border border-white/10 p-4 md:col-span-2">
      <div>
        <h3 className="font-semibold">Thông số ưu tiên trên card</h3>
        <p className="mt-1 text-xs text-[color:var(--muted)]">Chọn tối đa 3 mục, sau đó kéo để đổi thứ tự ưu tiên.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_SPEC_OPTIONS.map((option) => {
          const checked = selected.includes(option.value)
          const disabled = !checked && selected.length >= 3
          return (
            <label key={option.value} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${checked ? 'border-[color:var(--gold)]/50 bg-[color:var(--gold)]/10' : 'border-white/10'} ${disabled ? 'opacity-45' : 'cursor-pointer'}`}>
              <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(option.value)} />
              {option.label}
            </label>
          )
        })}
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selected} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {selected.map((key, index) => <SortableSpec key={key} specKey={key} index={index} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function SortableSpec({ specKey, index }: { specKey: string; index: number }) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: specKey })
  const label = PRODUCT_SPEC_OPTIONS.find((option) => option.value === specKey)?.label || specKey
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[.02] px-3 py-2 text-sm">
      <button type="button" aria-label={`Kéo sắp xếp ${label}`} {...attributes} {...listeners} className="cursor-grab text-[color:var(--muted)]"><GripVertical size={17} /></button>
      <span className="flex size-6 items-center justify-center rounded-full bg-[color:var(--gold)] text-xs font-black text-black">{index + 1}</span>
      <span>{label}</span>
    </div>
  )
}
