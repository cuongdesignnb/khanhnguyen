import { defaultSettings } from '@/data/default-settings'
import type { ProductDetailWarrantySettings } from '@/types/product-detail-settings'

const defaults = defaultSettings.productDetailConfig

function textValue(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function resolveProductDetailWarrantySettings(
  value: Record<string, unknown>,
): ProductDetailWarrantySettings {
  return {
    warrantySectionEnabled: value.warrantySectionEnabled !== false,
    warrantySectionTitle: textValue(value.warrantySectionTitle, defaults.warrantySectionTitle),
    warrantyPrimaryTitle: textValue(value.warrantyPrimaryTitle, defaults.warrantyPrimaryTitle),
    warrantyPrimaryDescription: textValue(value.warrantyPrimaryDescription, defaults.warrantyPrimaryDescription),
    technicalSupportTitle: textValue(value.technicalSupportTitle, defaults.technicalSupportTitle),
    technicalSupportDescription: textValue(value.technicalSupportDescription, defaults.technicalSupportDescription),
    genuinePartsTitle: textValue(value.genuinePartsTitle, defaults.genuinePartsTitle),
    genuinePartsDescription: textValue(value.genuinePartsDescription, defaults.genuinePartsDescription),
    lifetimeSupportTitle: textValue(value.lifetimeSupportTitle, defaults.lifetimeSupportTitle),
    lifetimeSupportDescription: textValue(value.lifetimeSupportDescription, defaults.lifetimeSupportDescription),
  }
}
