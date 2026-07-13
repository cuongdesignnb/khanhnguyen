import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { generateUniqueSlug } from '@/lib/slug'
import type { MediaFolderDto } from '@/types/media'

export async function GET(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response
  try {
    const [folders, counts] = await Promise.all([
      prisma.mediaFolder.findMany({
        where: { deletedAt: null },
        include: { _count: { select: { children: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.mediaFile.groupBy({
        by: ['folderId'],
        where: { deletedAt: null, folderId: { not: null } },
        _count: { _all: true },
      }),
    ])
    const countMap = new Map(counts.map((item) => [item.folderId, item._count._all]))
    const data: MediaFolderDto[] = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      slug: folder.slug,
      parentId: folder.parentId,
      fileCount: countMap.get(folder.id) || 0,
      childCount: folder._count.children,
      createdAt: folder.createdAt.toISOString(),
    }))
    return api.ok(data)
  } catch (error) {
    console.error('Media folders failed:', error)
    return api.serverError('Không thể lấy danh sách thư mục Media.')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response
  try {
    const raw: unknown = await request.json()
    const body = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
    const name = String(body.name || '').trim().slice(0, 120)
    const parentId = String(body.parentId || '').trim() || null
    if (!name) return api.badRequest('Tên thư mục là bắt buộc.')
    if (parentId) {
      const parent = await prisma.mediaFolder.findFirst({ where: { id: parentId, deletedAt: null } })
      if (!parent) return api.badRequest('Thư mục cha không tồn tại.')
    }
    const slug = await generateUniqueSlug(name, async (candidate) => {
      return Boolean(await prisma.mediaFolder.findUnique({ where: { slug: candidate }, select: { id: true } }))
    })
    const folder = await prisma.mediaFolder.create({ data: { name, slug, parentId } })
    return api.created({
      id: folder.id,
      name: folder.name,
      slug: folder.slug,
      parentId: folder.parentId,
      fileCount: 0,
      childCount: 0,
      createdAt: folder.createdAt.toISOString(),
    } satisfies MediaFolderDto, 'Đã tạo thư mục Media.')
  } catch (error) {
    console.error('Media folder create failed:', error)
    return api.serverError('Không thể tạo thư mục Media.')
  }
}

export const dynamic = 'force-dynamic'
