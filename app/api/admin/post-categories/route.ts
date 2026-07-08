import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { z } from 'zod'
import { generateUniqueSlug } from '@/lib/slug'

const postCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục tin tức không được để trống'),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
  isVisible: z.boolean().optional().default(true),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isVisibleParam = searchParams.get('isVisible')

    let whereClause: any = { deletedAt: null }
    if (isVisibleParam === 'true') {
      whereClause.isVisible = true
    } else if (isVisibleParam === 'false') {
      whereClause.isVisible = false
    }

    const categories = await prisma.postCategory.findMany({
      where: whereClause,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    })
    return api.ok(categories)
  } catch (error: any) {
    console.error('PostCategories List API Error:', error)
    return api.serverError('Lỗi lấy danh sách danh mục tin tức')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = postCategorySchema.safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
      const existing = await prisma.postCategory.findUnique({ where: { slug: s } })
      return !!existing
    })

    const postCategory = await prisma.postCategory.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        sortOrder: parsed.data.sortOrder,
        isVisible: parsed.data.isVisible,
      },
    })

    return api.created(postCategory, 'Tạo danh mục tin tức thành công')
  } catch (error: any) {
    console.error('PostCategory Create API Error:', error)
    return api.serverError('Lỗi tạo danh mục tin tức')
  }
}

export const dynamic = 'force-dynamic'
