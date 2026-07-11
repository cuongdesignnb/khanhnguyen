import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { categorySchema } from '@/lib/validators/category'
import { generateUniqueSlug } from '@/lib/slug'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'list'
    const parentId = searchParams.get('parentId')
    const isVisibleParam = searchParams.get('isVisible')

    let whereClause: any = { deletedAt: null }

    if (parentId === 'null') {
      whereClause.parentId = null
    } else if (parentId) {
      whereClause.parentId = parentId
    }

    if (isVisibleParam === 'true') {
      whereClause.isVisible = true
    } else if (isVisibleParam === 'false') {
      whereClause.isVisible = false
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        bannerImage: true,
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    })

    if (mode === 'tree') {
      const categoryMap = new Map<string, any>()
      const roots: any[] = []

      categories.forEach((cat: any) => {
        categoryMap.set(cat.id, { ...cat, children: [] })
      })

      categories.forEach((cat: any) => {
        const mapped = categoryMap.get(cat.id)
        if (cat.parentId && categoryMap.has(cat.parentId)) {
          categoryMap.get(cat.parentId).children.push(mapped)
        } else {
          roots.push(mapped)
        }
      })

      return api.ok(roots)
    }

    return api.ok(categories)
  } catch (error: any) {
    console.error('Categories List API Error:', error)
    return api.serverError('Lỗi lấy danh sách danh mục')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sanitize empty strings to null for UUID fields to satisfy Zod validation
    if (body.parentId === '') body.parentId = null
    if (body.bannerImageId === '') body.bannerImageId = null

    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    if (parsed.data.parentId) {
      const parentExists = await prisma.category.findFirst({
        where: { id: parsed.data.parentId, deletedAt: null },
      })
      if (!parentExists) {
        return api.badRequest('Danh mục cha không tồn tại hoặc đã bị xóa')
      }
    }

    const slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
      const existing = await prisma.category.findUnique({ where: { slug: s } })
      return !!existing
    })

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug,
        parentId: parsed.data.parentId || null,
        subtitle: parsed.data.subtitle || null,
        description: parsed.data.description || null,
        icon: parsed.data.icon || null,
        bannerImageId: parsed.data.bannerImageId || null,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        canonicalUrl: parsed.data.canonicalUrl || null,
        ogTitle: parsed.data.ogTitle || null,
        ogDescription: parsed.data.ogDescription || null,
        ogImageId: parsed.data.ogImageId || null,
        robotsIndex: parsed.data.robotsIndex,
        robotsFollow: parsed.data.robotsFollow,
        sortOrder: parsed.data.sortOrder,
        isVisible: parsed.data.isVisible,
      },
      include: {
        bannerImage: true,
        parent: true,
      },
    })

    return api.created(category, 'Tạo danh mục thành công')
  } catch (error: any) {
    console.error('Category Create API Error:', error)
    return api.serverError('Lỗi tạo danh mục')
  }
}

export const dynamic = 'force-dynamic'
