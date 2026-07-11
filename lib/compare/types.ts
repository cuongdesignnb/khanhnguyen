export interface CompareProduct {
  id: string; slug: string; name: string; thumbnail: string; price: string | null
  priceLabel: string; model: string | null; sku: string | null; categoryName: string
  categorySlug: string; brandName: string | null; stockStatus: string; badge?: string | null
}
export interface CompareRow { key: string; label: string; unit?: string | null; values: Record<string, string | null>; isDifferent: boolean }
export interface CompareGroup { key: string; label: string; sortOrder: number; rows: CompareRow[] }
export interface CompareResponse { products: CompareProduct[]; groups: CompareGroup[]; missingProductIds: string[] }
export type CompareActionResult = { success: boolean; action: 'added' | 'removed' | 'none'; reason?: 'FULL' | 'UNAVAILABLE' | 'ERROR' }
