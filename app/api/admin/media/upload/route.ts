import type { NextRequest } from 'next/server'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { getMediaFileDto } from '@/lib/media/media-dto'
import { MediaUploadError, uploadMediaFile } from '@/lib/media/upload-media-file'

export async function POST(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 25 * 1024 * 1024) {
    return api.payloadTooLarge('Dung lượng request vượt quá giới hạn 25 MB.')
  }

  let file: File | null = null
  let folderId: string | null = null
  try {
    const formData = await request.formData()
    const candidate = formData.get('file')
    file = candidate instanceof File ? candidate : null
    folderId = String(formData.get('folderId') || '').trim() || null
    if (!file) return api.badRequest('Không tìm thấy file để tải lên.')

    const created = await uploadMediaFile(file, {
      folderId,
      alt: String(formData.get('alt') || ''),
      title: String(formData.get('title') || ''),
    })
    const dto = await getMediaFileDto(created.id)
    return api.created(dto, 'Tải file lên thành công.')
  } catch (error) {
    const userId = (auth.session?.user as { id?: string } | undefined)?.id
    const uploadError = error instanceof MediaUploadError ? error : null
    console.error('Media upload failed:', {
      userId,
      filename: file?.name,
      mimeType: file?.type,
      size: file?.size,
      folderId,
      stage: uploadError?.stage || 'unknown',
      error,
    })
    if (uploadError) return api.badRequest(uploadError.message)
    return api.serverError('Không thể tải file lên. Vui lòng thử lại.')
  }
}

export const dynamic = 'force-dynamic'
