'use client'

import { useLocalStorage } from './use-local-storage'
import { useCallback, useEffect } from 'react'
import { authClient } from '@/lib/auth-client'

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage<string[]>('kn_wishlist', [])
  const { data: session } = authClient.useSession()

  // Sync with DB on mount / session change if logged in
  useEffect(() => {
    if (!session?.user) return

    let active = true

    async function sync() {
      try {
        const response = await fetch('/api/customer/wishlist', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })
        if (response.ok && active) {
          const result = await response.json()
          if (result.success && Array.isArray(result.data)) {
            const dbIds = result.data.map((item: any) => item.productId)
            const mismatch = dbIds.length !== wishlist.length || dbIds.some((id: string) => !wishlist.includes(id))
            if (mismatch) {
              setWishlist(dbIds)
            }
          }
        }
      } catch (e) {
        // Ignore
      }
    }
    sync()

    return () => {
      active = false
    }
  }, [session, setWishlist])

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
