'use client'

import { useLocalStorage } from './use-local-storage'
import { useCallback } from 'react'

export interface QuoteCartItem {
  productId: string
  quantity: number
}

export function useQuoteCart() {
  const [items, setItems] = useLocalStorage<QuoteCartItem[]>('kn_quote_cart', [])

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.productId === productId)
        if (existingIndex > -1) {
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          }
          return updated
        }
        return [...prev, { productId, quantity }]
      })
    },
    [setItems]
  )

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((item) => item.productId !== productId))
    },
    [setItems]
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) return
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      )
    },
    [setItems]
  )

  const clear = useCallback(() => {
    setItems([])
  }, [setItems])

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    count: items.length,
    totalQuantity,
  }
}
