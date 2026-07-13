import path from 'node:path'

export const uploadRoot = path.resolve(process.cwd(), 'public', 'uploads')

export function mediaUrlToDiskPath(url: string) {
  if (!url.startsWith('/uploads/')) return null
  const relative = url.slice('/uploads/'.length).replaceAll('\\', '/')
  if (!relative || relative.split('/').some((part) => part === '..')) return null
  const resolved = path.resolve(uploadRoot, relative)
  return resolved.startsWith(`${uploadRoot}${path.sep}`) ? resolved : null
}

export function diskPathToMediaUrl(filePath: string) {
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(`${uploadRoot}${path.sep}`)) return null
  return `/uploads/${path.relative(uploadRoot, resolved).split(path.sep).join('/')}`
}
