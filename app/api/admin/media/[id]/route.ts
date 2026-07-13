import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { getMediaFileDto } from '@/lib/media/media-dto'
import { mediaSchema } from '@/lib/validators/media'

type MediaRouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: MediaRouteContext) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response
  try {
    const { id } = await params
    const media = await getMediaFileDto(id)
    return media ? api.ok(media) : api.notFound('Không tìm thấy file Media.')
  } catch (error) {
    console.error('Media detail failed:', error)
    return api.serverError('Không thể lấy thông tin Media.')
  }
}

export async function PATCH(request: NextRequest, { params }: MediaRouteContext) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response
  try {
    const { id } = await params
    const existing = await prisma.mediaFile.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return api.notFound('Không tìm thấy file Media.')
    const rawBody: unknown = await request.json()
    const body = rawBody && typeof rawBody === 'object' ? { ...rawBody as Record<string, unknown> } : {}
    if (body.folderId === '') body.folderId = null
    const parsed = mediaSchema.pick({ alt: true, title: true, folderId: true }).partial().safeParse(body)
    if (!parsed.success) return api.badRequest('Dữ liệu Media không hợp lệ.', parsed.error.flatten())
    if (parsed.data.folderId) {
      const folder = await prisma.mediaFolder.findFirst({ where: { id: parsed.data.folderId, deletedAt: null } })
      if (!folder) return api.badRequest('Thư mục Media không tồn tại.')
    }
    await prisma.mediaFile.update({
      where: { id },
      data: {
        alt: parsed.data.alt === undefined ? undefined : parsed.data.alt?.trim() || null,
        title: parsed.data.title === undefined ? undefined : parsed.data.title?.trim() || null,
        folderId: parsed.data.folderId === undefined ? undefined : parsed.data.folderId,
      },
    })
    return api.ok(await getMediaFileDto(id), 'Đã lưu thông tin Media.')
  } catch (error) {
    console.error('Media update failed:', error)
    return api.serverError('Không thể cập nhật Media.')
  }
}

export async function DELETE(request: NextRequest, { params }: MediaRouteContext) {
  const auth = await requireMediaRole(request, ['ADMIN'])
  if (auth.response) return auth.response
  try {
    const { id } = await params
    const media = await getMediaFileDto(id)
    if (!media) return api.notFound('Không tìm thấy file Media.')
    if (!media.usage.includes('unused')) {
      const usageCount = media.usages.reduce((total, item) => total + item.count, 0)
      return api.conflict(`Ảnh đang được sử dụng tại ${usageCount} vị trí nên chưa thể xóa.`, {
        usages: media.usages,
      })
    }
    await prisma.mediaFile.update({ where: { id }, data: { deletedAt: new Date() } })
    return api.ok(null, 'Đã chuyển Media vào thùng rác. File vật lý được giữ để có thể khôi phục.')
  } catch (error) {
    console.error('Media delete failed:', error)
    return api.serverError('Không thể xóa Media.')
  }
}

export const dynamic = 'force-dynamic'
