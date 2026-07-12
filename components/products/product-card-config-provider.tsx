'use client'

import { createContext, useContext } from 'react'
import {
  DEFAULT_PRODUCT_CARD_SETTINGS,
  type ProductCardSettings,
} from '@/types/product-card-settings'

const ProductCardConfigContext = createContext<ProductCardSettings>(DEFAULT_PRODUCT_CARD_SETTINGS)

export function ProductCardConfigProvider({
  settings,
  children,
}: {
  settings?: Partial<ProductCardSettings>
  children: React.ReactNode
}) {
  const value = { ...DEFAULT_PRODUCT_CARD_SETTINGS, ...settings }
  return <ProductCardConfigContext.Provider value={value}>{children}</ProductCardConfigContext.Provider>
}

export function useProductCardConfig() {
  return useContext(ProductCardConfigContext)
}
