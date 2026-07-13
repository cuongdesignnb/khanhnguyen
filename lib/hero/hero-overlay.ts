export const DEFAULT_HERO_OVERLAY_OPACITY = 70

export function clampHeroOverlayOpacity(
  value: unknown,
  fallback = DEFAULT_HERO_OVERLAY_OPACITY,
): number {
  const fallbackValue = Number(fallback)
  const safeFallback = Number.isFinite(fallbackValue)
    ? Math.min(90, Math.max(0, fallbackValue))
    : DEFAULT_HERO_OVERLAY_OPACITY

  if (value === null || value === undefined || value === '') return safeFallback

  const parsed = Number(value)
  return Number.isFinite(parsed)
    ? Math.min(90, Math.max(0, parsed))
    : safeFallback
}
