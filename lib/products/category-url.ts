export function getProductCategoryHref(slug: string | null | undefined) {
  const normalizedSlug = String(slug || '').trim()
  return normalizedSlug
    ? `/san-pham?category=${encodeURIComponent(normalizedSlug)}`
    : '/san-pham'
}
