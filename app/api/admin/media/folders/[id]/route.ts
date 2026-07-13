import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { generateUniqueSlug } from '@/lib/slug'

type FolderContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: FolderContext) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response
  try {
    const { id } = await params
    const existing = await prisma.mediaFolder.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return api.notFound('Không tìm thấy thư mục Media.')
    const raw: unknown = await request.json()
    const body = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
    const name = String(body.name || '').trim().slice(0, 120)
    if (!name) return api.badRequest('Tên thư mục là bắt buộc.')
    const slug = await generateUniqueSlug(name, async (candidate) => {
      const folder = await prisma.mediaFolder.findUnique({ where: { slug: candidate }, select: { id: true } })
      return Boolean(folder && folder.id !== id)
    })
    const folder = await prisma.mediaFolder.update({ where: { id }, data: { name, slug } })
    return api.ok(folder, 'Đã đổi tên thư mục Media.')
  } catch (error) {
    console.error('Media folder update failed:', error)
    return api.serverError('Không thể đổi tên thư mục Media.')
  }
}

export async function DELETE(request: NextRequest, { params }: FolderContext) {
  const auth = await requireMediaRole(request, ['ADMIN'])
  if (auth.response) return auth.response
  try {
    const { id } = await params
    const folder = await prisma.mediaFolder.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: { select: { children: true } },
      },
    })
    if (!folder) return api.notFound('Không tìm thấy thư mục Media.')
    const fileCount = await prisma.mediaFile.count({ where: { folderId: id, deletedAt: null } })
    if (fileCount || folder._count.children) {
      return api.conflict('Chỉ có thể xóa thư mục trống.', {
        fileCount,
        childCount: folder._count.children,
      })
    }
    await prisma.mediaFolder.update({ where: { id }, data: { deletedAt: new Date() } })
    return api.ok(null, 'Đã xóa thư mục Media.')
  } catch (error) {
    console.error('Media folder delete failed:', error)
    return api.serverError('Không thể xóa thư mục Media.')
  }
}

export const dynamic = 'force-dynamic'
