import { NextRequest } from 'next/server'
import { handleUpload } from '@/lib/upload'
import * as api from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folderId = formData.get('folderId') as string | null

    if (!file) {
      return api.badRequest('Không tìm thấy file để upload')
    }

    const result = await handleUpload(file, folderId)
    return api.created(result, 'Upload file thành công')
  } catch (error: any) {
    console.error('API Upload error:', error)
    return api.badRequest(error.message || 'Lỗi upload file')
  }
}
export const dynamic = 'force-dynamic'
