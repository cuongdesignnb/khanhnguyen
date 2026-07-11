export function compactObject<T>(value: T): T {
  if (Array.isArray(value)) return value.map(compactObject).filter((item) => item !== undefined && item !== null && item !== '') as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined && item !== null && item !== '')
      .map(([key, item]) => [key, compactObject(item)])) as T
  }
  return value
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(compactObject(data)).replace(/</g, '\\u003c')
}
