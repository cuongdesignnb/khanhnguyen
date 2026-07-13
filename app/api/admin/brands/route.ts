import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { brandSchema } from '@/lib/validators/brand'
import { generateUniqueSlug } from '@/lib/slug'
import { revalidatePath } from 'next/cache'
import { mapBrandToAdminDto } from '@/lib/admin-mappers'
import { validateBrandLogo } from '@/lib/brands/validate-brand-logo'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isVisibleParam = searchParams.get('isVisible')

    const whereClause: Prisma.BrandWhereInput = { deletedAt: null }
    if (isVisibleParam === 'true') {
      whereClause.isVisible = true
    } else if (isVisibleParam === 'false') {
      whereClause.isVisible = false
    }

    const brands = await prisma.brand.findMany({
      where: whereClause,
      include: {
        logo: true,
        _count: { select: { products: true } },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    })
    return api.ok(brands.map(mapBrandToAdminDto))
  } catch (error: unknown) {
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
    const logoValidation = await validateBrandLogo(parsed.data.logoId)
    if (!logoValidation.valid) return api.badRequest(logoValidation.error)

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
        canonicalUrl: parsed.data.canonicalUrl || null,
        ogTitle: parsed.data.ogTitle || null,
        ogDescription: parsed.data.ogDescription || null,
        ogImageId: parsed.data.ogImageId || null,
        robotsIndex: parsed.data.robotsIndex,
        robotsFollow: parsed.data.robotsFollow,
        isVisible: parsed.data.isVisible,
        sortOrder: parsed.data.sortOrder,
      },
      include: {
        logo: true,
        _count: { select: { products: true } },
      },
    })

    revalidatePath('/')
    return api.created(mapBrandToAdminDto(brand), 'Tạo thương hiệu thành công')
  } catch (error: unknown) {
    console.error('Brand Create API Error:', error)
    return api.serverError('Lỗi tạo thương hiệu')
  }
}

export const dynamic = 'force-dynamic'
