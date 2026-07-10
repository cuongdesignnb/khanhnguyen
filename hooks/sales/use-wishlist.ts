'use client'

import { useLocalStorage } from './use-local-storage'
import { useCallback } from 'react'

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage<string[]>('kn_wishlist', [])

  const add = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        if (prev.includes(id)) return prev
        return [...prev, id]
      })
    },
    [setWishlist]
  )

  const remove = useCallback(
    (id: string) => {
      setWishlist((prev) => prev.filter((item) => item !== id))
    },
    [setWishlist]
  )

  const toggle = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return [...prev, id]
      })
    },
    [setWishlist]
  )

  const has = useCallback(
    (id: string) => {
      return wishlist.includes(id)
    },
    [wishlist]
  )

  const clear = useCallback(() => {
    setWishlist([])
  }, [setWishlist])

  return {
    wishlist,
    add,
    remove,
    toggle,
    has,
    clear,
    count: wishlist.length,
  }
}
