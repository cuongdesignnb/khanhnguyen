export function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, '')
}

export function absoluteUrl(pathOrUrl: string | null | undefined, siteUrl: string) {
  if (!pathOrUrl) return undefined
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${normalizeSiteUrl(siteUrl)}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

export function cleanCanonicalPath(path: string) {
  return path.split('?')[0].split('#')[0] || '/'
}

export function hasIndexBlockingQuery(params: Record<string, string | string[] | undefined>) {
  const blocked = ['q','brand','fuel','capacity','condition','sort','minPrice','maxPrice','origin','manufactureYear','stockStatus']
  return blocked.some((key) => params[key] !== undefined)
}

export function paginatedCanonical(path: string, page?: number) {
  return page && page > 1 ? `${cleanCanonicalPath(path)}?page=${page}` : cleanCanonicalPath(path)
}
