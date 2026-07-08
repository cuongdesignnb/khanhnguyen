import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { brandSchema } from '@/lib/validators/brand'
import { generateUniqueSlug } from '@/lib/slug'

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

    const brands = await prisma.brand.findMany({
      where: whereClause,
      include: {
        logo: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    })
    return api.ok(brands)
  } catch (error: any) {
    console.error('Brands List API Error:', error)
    return api.serverError('Lỗi lấy danh sách thương hiệu')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sanitize empty strings to null for UUID fields
    if (body.logoId === '') body.logoId = null

    const parsed = brandSchema.safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
      const existing = await prisma.brand.findUnique({ where: { slug: s } })
      return !!existing
    })

    const brand = await prisma.brand.create({
      data: {
        name: parsed.data.name,
        slug,
        logoId: parsed.data.logoId || null,
        description: parsed.data.description || null,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        isVisible: parsed.data.isVisible,
        sortOrder: parsed.data.sortOrder,
      },
      include: {
        logo: true,
      },
    })

    return api.created(brand, 'Tạo thương hiệu thành công')
  } catch (error: any) {
    console.error('Brand Create API Error:', error)
    return api.serverError('Lỗi tạo thương hiệu')
  }
}

export const dynamic = 'force-dynamic'
