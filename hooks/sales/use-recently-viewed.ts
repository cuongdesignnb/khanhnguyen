'use client'

import { useLocalStorage } from './use-local-storage'
import { useCallback } from 'react'

export function useRecentlyViewed() {
  const [items, setItems] = useLocalStorage<string[]>('kn_recently_viewed', [])

  const add = useCallback(
    (id: string) => {
      setItems((prev) => {
        const filtered = prev.filter((item) => item !== id)
        const updated = [id, ...filtered]
        return updated.slice(0, 20) // Keep at most 20 items
      })
    },
    [setItems]
  )

  return {
    items,
    add,
  }
}
