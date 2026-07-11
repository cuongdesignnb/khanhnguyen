import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { generateUniqueSlug } from '@/lib/slug'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const q = searchParams.get('q') || ''
    const folderId = searchParams.get('folderId')
    const type = searchParams.get('type')
    const format = searchParams.get('format')
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []

    const where: any = { deletedAt: null }

    if (ids.length) where.id = { in: ids }

    if (q) {
      where.OR = [
        { filename: { contains: q, mode: 'insensitive' } },
        { originalName: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
        { alt: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (folderId === 'null' || folderId === 'root') {
      where.folderId = null
    } else if (folderId) {
      where.folderId = folderId
    }

    if (type) {
      where.type = type
    }

    if (format) {
      where.extension = { equals: format, mode: 'insensitive' }
    }

    const [items, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.mediaFile.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return api.ok({
      items,
      total,
      page,
      limit,
      totalPages,
    })
  } catch (error: any) {
    console.error('Media List API Error:', error)
    return api.serverError('Lỗi lấy danh sách tập tin đa phương tiện')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return api.badRequest('Tên thư mục là bắt buộc')
    }

    const name = body.name.trim()
    if (!name) {
      return api.badRequest('Tên thư mục không được để trống')
    }

    // Sanitize empty string to null for parentId
    const parentId = body.parentId === '' ? null : body.parentId || null

    if (parentId) {
      const parentFolder = await prisma.mediaFolder.findFirst({
        where: { id: parentId, deletedAt: null },
      })
      if (!parentFolder) {
        return api.badRequest('Thư mục cha không tồn tại hoặc đã bị xóa')
      }
    }

    const slug = await generateUniqueSlug(name, async (s) => {
      const existing = await prisma.mediaFolder.findUnique({ where: { slug: s } })
      return !!existing
    })

    const folder = await prisma.mediaFolder.create({
      data: {
        name,
        slug,
        parentId,
      },
    })

    return api.created(folder, 'Tạo thư mục thành công')
  } catch (error: any) {
    console.error('Media Folder Create API Error:', error)
    return api.serverError('Lỗi tạo thư mục đa phương tiện')
  }
}

export const dynamic = 'force-dynamic'
