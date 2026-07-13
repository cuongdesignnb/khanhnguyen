'use client'

import { useCallback, useState } from 'react'
import type { MediaFileDto } from '@/types/media'

export function useMediaSelection({
  multiple,
  maxSelect,
}: {
  multiple: boolean
  maxSelect: number
}) {
  const [selected, setSelected] = useState<Map<string, MediaFileDto>>(() => new Map())

  const toggle = useCallback((item: MediaFileDto) => {
    if (item.missing) return
    setSelected((current) => {
      const next = new Map(current)
      if (next.has(item.id)) next.delete(item.id)
      else if (!multiple) return new Map([[item.id, item]])
      else if (next.size < maxSelect) next.set(item.id, item)
      return next
    })
  }, [maxSelect, multiple])

  const add = useCallback((items: MediaFileDto[]) => {
    setSelected((current) => {
      if (!multiple) return items[0] ? new Map([[items[0].id, items[0]]]) : current
      const next = new Map(current)
      for (const item of items) {
        if (next.size >= maxSelect) break
        if (!item.missing) next.set(item.id, item)
      }
      return next
    })
  }, [maxSelect, multiple])

  const reset = useCallback((items: MediaFileDto[]) => {
    setSelected(new Map(items.filter((item) => !item.missing).slice(0, maxSelect).map((item) => [item.id, item])))
  }, [maxSelect])

  return { selected, selectedItems: [...selected.values()], toggle, add, reset, clear: () => setSelected(new Map()) }
}
