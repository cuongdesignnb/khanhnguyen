import { access, readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import prisma from '@/lib/prisma'
import { diskPathToMediaUrl, mediaUrlToDiskPath, uploadRoot } from './media-path'
import type { MediaHealthEntry, MediaHealthReport, MediaType } from '@/types/media'

async function walkFiles(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true })
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const target = path.join(directory, entry.name)
        if (entry.isDirectory()) return walkFiles(target)
        if (entry.isFile() && !entry.name.startsWith('.upload-')) return [target]
        return []
      }),
    )
    return nested.flat()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

export async function isLocalMediaMissing(url: string) {
  const filePath = mediaUrlToDiskPath(url)
  if (!filePath) return false
  try {
    await access(filePath)
    return false
  } catch {
    return true
  }
}

export async function scanMediaHealth(): Promise<MediaHealthReport> {
  const [databaseMedia, diskFiles] = await Promise.all([
    prisma.mediaFile.findMany({
      where: { deletedAt: null, url: { startsWith: '/uploads/' } },
      select: { id: true, url: true, filename: true },
    }),
    walkFiles(uploadRoot),
  ])

  const databaseUrls = new Map(databaseMedia.map((item) => [item.url, item]))
  const filesystemUrls = new Map(
    diskFiles.flatMap((filePath) => {
      const url = diskPathToMediaUrl(filePath)
      return url ? [[url, filePath] as const] : []
    }),
  )

  const databaseOnly: MediaHealthEntry[] = databaseMedia
    .filter((item) => !filesystemUrls.has(item.url))
    .map((item) => ({ id: item.id, url: item.url, filename: item.filename, reason: 'Có bản ghi database nhưng thiếu file vật lý.' }))

  const filesystemOnly: MediaHealthEntry[] = [...filesystemUrls.entries()]
    .filter(([url]) => !databaseUrls.has(url))
    .map(([url, filePath]) => ({ url, filename: path.basename(filePath), reason: 'Có file trong volume nhưng chưa có bản ghi database.' }))

  return {
    scannedAt: new Date().toISOString(),
    totalLocalMedia: databaseMedia.length,
    healthy: databaseMedia.length - databaseOnly.length,
    missingFiles: databaseOnly.length,
    orphanFiles: filesystemOnly.length,
    databaseOnly,
    filesystemOnly,
  }
}

function typeFromExtension(extension: string): { mimeType: string; type: MediaType } {
  const types: Record<string, { mimeType: string; type: MediaType }> = {
    '.jpg': { mimeType: 'image/jpeg', type: 'IMAGE' },
    '.jpeg': { mimeType: 'image/jpeg', type: 'IMAGE' },
    '.png': { mimeType: 'image/png', type: 'IMAGE' },
    '.webp': { mimeType: 'image/webp', type: 'IMAGE' },
    '.avif': { mimeType: 'image/avif', type: 'IMAGE' },
    '.gif': { mimeType: 'image/gif', type: 'IMAGE' },
    '.pdf': { mimeType: 'application/pdf', type: 'DOCUMENT' },
  }
  return types[extension] || { mimeType: 'application/octet-stream', type: 'OTHER' }
}

export async function registerOrphanFile(url: string) {
  const filePath = mediaUrlToDiskPath(url)
  if (!filePath) throw new Error('Đường dẫn orphan không hợp lệ.')
  const existing = await prisma.mediaFile.findFirst({ where: { url, deletedAt: null } })
  if (existing) return existing
  const fileStat = await stat(filePath)
  const extension = path.extname(filePath).toLowerCase()
  const detected = typeFromExtension(extension)
  let width: number | null = null
  let height: number | null = null
  if (detected.type === 'IMAGE') {
    try {
      const metadata = await sharp(filePath, { animated: true, failOn: 'none' }).metadata()
      width = metadata.width ?? null
      height = metadata.height ?? null
    } catch {
      // File vẫn được đăng ký để Admin có thể thay thế nếu nội dung ảnh lỗi.
    }
  }
  return prisma.mediaFile.create({
    data: {
      filename: path.basename(filePath),
      originalName: path.basename(filePath),
      path: filePath,
      url,
      mimeType: detected.mimeType,
      extension,
      size: fileStat.size,
      width,
      height,
      type: detected.type,
    },
  })
}

export async function deleteOrphanFile(url: string) {
  const filePath = mediaUrlToDiskPath(url)
  if (!filePath) throw new Error('Đường dẫn orphan không hợp lệ.')
  const existing = await prisma.mediaFile.findFirst({ where: { url, deletedAt: null } })
  if (existing) throw new Error('File đã có bản ghi Media nên không thể xóa theo chế độ orphan.')
  await unlink(filePath)
}
