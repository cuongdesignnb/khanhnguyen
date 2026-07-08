/**
 * Returns the unified application site URL.
 * Prioritizes NEXT_PUBLIC_SITE_URL (Docker config) -> NEXT_PUBLIC_APP_URL -> default local dev port.
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000'
  )
}
