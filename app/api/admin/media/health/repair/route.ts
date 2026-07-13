import type { NextRequest } from 'next/server'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { deleteOrphanFile, registerOrphanFile } from '@/lib/media/media-health'

export async function POST(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN'])
  if (auth.response) return auth.response
  try {
    const raw: unknown = await request.json()
    const body = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
    const action = String(body.action || '')
    const url = String(body.url || '')
    if (!url.startsWith('/uploads/')) return api.badRequest('Đường dẫn Media không hợp lệ.')
    if (action === 'register-orphan') {
      const media = await registerOrphanFile(url)
      return api.created(media, 'Đã tạo bản ghi cho file orphan.')
    }
    if (action === 'delete-orphan') {
      await deleteOrphanFile(url)
      return api.ok(null, 'Đã xóa file orphan khỏi volume.')
    }
    return api.badRequest('Thao tác sửa Media không hợp lệ.')
  } catch (error) {
    console.error('Media health repair failed:', error)
    return api.badRequest(error instanceof Error ? error.message : 'Không thể xử lý Media lỗi.')
  }
}

export const dynamic = 'force-dynamic'
