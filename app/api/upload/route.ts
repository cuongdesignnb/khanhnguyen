import type { NextRequest } from 'next/server'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { getMediaFileDto } from '@/lib/media/media-dto'
import { MediaUploadError, uploadMediaFile } from '@/lib/media/upload-media-file'

/** @deprecated Frontend mới phải dùng POST /api/admin/media/upload. */
export async function POST(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response
  try {
    const formData = await request.formData()
    const candidate = formData.get('file')
    if (!(candidate instanceof File)) return api.badRequest('Không tìm thấy file để tải lên.')
    const created = await uploadMediaFile(candidate, {
      folderId: String(formData.get('folderId') || '').trim() || null,
      alt: String(formData.get('alt') || ''),
      title: String(formData.get('title') || ''),
    })
    return api.created(await getMediaFileDto(created.id), 'Tải file lên thành công.')
  } catch (error) {
    console.error('Deprecated upload endpoint failed:', error)
    if (error instanceof MediaUploadError) return api.badRequest(error.message)
    return api.serverError('Không thể tải file lên.')
  }
}

export const dynamic = 'force-dynamic'
