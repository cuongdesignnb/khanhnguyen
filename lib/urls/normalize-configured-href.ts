const ABSOLUTE_PROTOCOL = /^(?:https?:\/\/|tel:|mailto:|sms:)/i

export function normalizeConfiguredHref(value: unknown) {
  let href = String(value || '').trim()
  href = href.replace(/^\/+\s*(?=https?:\/\/)/i, '')

  if (/^www\./i.test(href)) return `https://${href}`
  return href
}

export function isBrowserHandledHref(value: string) {
  return ABSOLUTE_PROTOCOL.test(normalizeConfiguredHref(value))
}

export function isValidConfiguredHref(value: unknown) {
  const href = normalizeConfiguredHref(value)
  return !href || href.startsWith('/') || ABSOLUTE_PROTOCOL.test(href)
}
