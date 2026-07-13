import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { getMediaFileDto } from '@/lib/media/media-dto'
import { mediaUrlToDiskPath } from '@/lib/media/media-path'
import {
  MediaUploadError,
  safeUnlink,
  writeMediaFileToVolume,
} from '@/lib/media/upload-media-file'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response
  let newPath: string | null = null
  try {
    const { id } = await params
    const existing = await prisma.mediaFile.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return api.notFound('Không tìm thấy file Media cần thay thế.')
    const formData = await request.formData()
    const candidate = formData.get('file')
    if (!(candidate instanceof File)) return api.badRequest('Không tìm thấy file thay thế.')
    const stored = await writeMediaFileToVolume(candidate)
    newPath = stored.path
    try {
      await prisma.mediaFile.update({
        where: { id },
        data: {
          filename: stored.filename,
          originalName: stored.originalName,
          path: stored.path,
          url: stored.url,
          mimeType: stored.mimeType,
          extension: stored.extension,
          size: stored.size,
          width: stored.width,
          height: stored.height,
          type: stored.type,
        },
      })
    } catch (error) {
      await safeUnlink(stored.path)
      throw new MediaUploadError('Không thể cập nhật database; file thay thế đã được dọn.', 'database', { cause: error })
    }
    const oldPath = mediaUrlToDiskPath(existing.url)
    if (oldPath && oldPath !== stored.path) await safeUnlink(oldPath)
    return api.ok(await getMediaFileDto(id), 'Đã thay thế file và giữ nguyên Media ID.')
  } catch (error) {
    console.error('Media replace failed:', { newPath, error })
    if (error instanceof MediaUploadError) return api.badRequest(error.message)
    return api.serverError('Không thể thay thế file Media.')
  }
}

export const dynamic = 'force-dynamic'
