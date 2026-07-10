'use client'

import { useLocalStorage } from './use-local-storage'
import { useCallback } from 'react'

export function useCompare() {
  const [compare, setCompare] = useLocalStorage<string[]>('kn_compare', [])

  const add = useCallback(
    (id: string): boolean => {
      let success = false
      setCompare((prev) => {
        if (prev.includes(id)) {
          success = true
          return prev
        }
        if (prev.length >= 4) {
          success = false
          return prev
        }
        success = true
        return [...prev, id]
      })
      return success
    },
    [setCompare]
  )

  const remove = useCallback(
    (id: string) => {
      setCompare((prev) => prev.filter((item) => item !== id))
    },
    [setCompare]
  )

  const toggle = useCallback(
    (id: string): { success: boolean; action: 'added' | 'removed' | 'none' } => {
      let result: { success: boolean; action: 'added' | 'removed' | 'none' } = {
        success: false,
        action: 'none',
      }

      setCompare((prev) => {
        if (prev.includes(id)) {
          result = { success: true, action: 'removed' }
          return prev.filter((item) => item !== id)
        }
        if (prev.length >= 4) {
          result = { success: false, action: 'none' }
          return prev
        }
        result = { success: true, action: 'added' }
        return [...prev, id]
      })

      return result
    },
    [setCompare]
  )

  const has = useCallback(
    (id: string) => {
      return compare.includes(id)
    },
    [compare]
  )

  const clear = useCallback(() => {
    setCompare([])
  }, [setCompare])

  return {
    compare,
    add,
    remove,
    toggle,
    has,
    clear,
    count: compare.length,
    isFull: compare.length >= 4,
  }
}
