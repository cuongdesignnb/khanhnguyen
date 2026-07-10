'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useWishlist } from '@/hooks/sales/use-wishlist'
import { useCompare } from '@/hooks/sales/use-compare'
import { useQuoteCart, QuoteCartItem } from '@/hooks/sales/use-quote-cart'
import { useRecentlyViewed } from '@/hooks/sales/use-recently-viewed'
import { ToastContainer } from './toast-notification'

interface SalesContextType {
  wishlist: string[]
  wishlistCount: number
  addToWishlist: (id: string) => void
  removeFromWishlist: (id: string) => void
  toggleWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void

  compare: string[]
  compareCount: number
  addToCompare: (id: string) => boolean
  removeFromCompare: (id: string) => void
  toggleCompare: (id: string) => { success: boolean; action: 'added' | 'removed' | 'none' }
  isInCompare: (id: string) => boolean
  clearCompare: () => void
  isCompareFull: boolean

  cartItems: QuoteCartItem[]
  cartCount: number
  cartTotalQuantity: number
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  recentlyViewed: string[]
  addRecentlyViewed: (id: string) => void
}

const SalesContext = createContext<SalesContextType | undefined>(undefined)

export function SalesProvider({ children }: { children: ReactNode }) {
  const wishlistHook = useWishlist()
  const compareHook = useCompare()
  const cartHook = useQuoteCart()
  const recentlyViewedHook = useRecentlyViewed()

  const value: SalesContextType = {
    wishlist: wishlistHook.wishlist,
    wishlistCount: wishlistHook.count,
    addToWishlist: wishlistHook.add,
    removeFromWishlist: wishlistHook.remove,
    toggleWishlist: wishlistHook.toggle,
    isInWishlist: wishlistHook.has,
    clearWishlist: wishlistHook.clear,

    compare: compareHook.compare,
    compareCount: compareHook.count,
    addToCompare: compareHook.add,
    removeFromCompare: compareHook.remove,
    toggleCompare: compareHook.toggle,
    isInCompare: compareHook.has,
    clearCompare: compareHook.clear,
    isCompareFull: compareHook.isFull,

    cartItems: cartHook.items,
    cartCount: cartHook.count,
    cartTotalQuantity: cartHook.totalQuantity,
    addToCart: cartHook.addItem,
    removeFromCart: cartHook.removeItem,
    updateCartQuantity: cartHook.updateQuantity,
    clearCart: cartHook.clear,

    recentlyViewed: recentlyViewedHook.items,
    addRecentlyViewed: recentlyViewedHook.add,
  }

  return (
    <SalesContext.Provider value={value}>
      {children}
      <ToastContainer />
    </SalesContext.Provider>
  )
}

export function useSalesContext() {
  const context = useContext(SalesContext)
  if (!context) {
    throw new Error('useSalesContext must be used within a SalesProvider')
  }
  return context
}
