export const PRODUCT_SPEC_OPTIONS = [
  { value: 'model', label: 'Model' },
  { value: 'capacity', label: 'Tải trọng nâng' },
  { value: 'liftHeight', label: 'Chiều cao nâng' },
  { value: 'fuelType', label: 'Nhiên liệu' },
  { value: 'manufactureYear', label: 'Năm sản xuất' },
  { value: 'condition', label: 'Tình trạng' },
  { value: 'origin', label: 'Xuất xứ' },
  { value: 'forkLength', label: 'Chiều dài càng' },
] as const

export interface ProductCardSettings {
  cardQuickSpecsEnabled: boolean
  cardVisibleSpecsLimit: number
  cardHoverSpecsEnabled: boolean
  cardHoverSpecsLimit: number
  cardPrioritySpecs: string[]
  showPrice: boolean
  showQuoteButton: boolean
  showWishlist: boolean
  showCompare: boolean
  cardImageRatio: '4:3' | '1:1' | '16:9'
}

export const DEFAULT_PRODUCT_CARD_SETTINGS: ProductCardSettings = {
  cardQuickSpecsEnabled: true,
  cardVisibleSpecsLimit: 3,
  cardHoverSpecsEnabled: true,
  cardHoverSpecsLimit: 6,
  cardPrioritySpecs: ['model', 'capacity', 'liftHeight'],
  showPrice: true,
  showQuoteButton: true,
  showWishlist: true,
  showCompare: true,
  cardImageRatio: '4:3',
}
