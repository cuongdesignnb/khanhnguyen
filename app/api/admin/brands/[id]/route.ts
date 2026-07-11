import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { brandSchema } from '@/lib/validators/brand'
import { generateUniqueSlug } from '@/lib/slug'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await prisma.brand.findFirst({
      where: { id, deletedAt: null },
      include: {
        logo: true,
      },
    })

    if (!brand) {
      return api.notFound('Không tìm thấy thương hiệu')
    }

    return api.ok(brand)
  } catch (error: any) {
    console.error('Brand Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin thương hiệu')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingBrand = await prisma.brand.findFirst({
      where: { id, deletedAt: null },
    })

    if (!existingBrand) {
      return api.notFound('Không tìm thấy thương hiệu')
    }

    const body = await request.json()

    // Sanitize empty strings to null for UUID fields
    if (body.logoId === '') body.logoId = null

    const parsed = brandSchema.partial().safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    let slug = existingBrand.slug
    if (parsed.data.name && parsed.data.name !== existingBrand.name) {
      slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
        const existing = await prisma.brand.findFirst({
          where: { slug: s, id: { not: id } },
        })
        return !!existing
      })
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        logoId: parsed.data.logoId !== undefined ? parsed.data.logoId : undefined,
        description: parsed.data.description !== undefined ? parsed.data.description : undefined,
        seoTitle: parsed.data.seoTitle !== undefined ? parsed.data.seoTitle : undefined,
        seoDescription: parsed.data.seoDescription !== undefined ? parsed.data.seoDescription : undefined,
        canonicalUrl: parsed.data.canonicalUrl !== undefined ? parsed.data.canonicalUrl : undefined,
        ogTitle: parsed.data.ogTitle !== undefined ? parsed.data.ogTitle : undefined,
        ogDescription: parsed.data.ogDescription !== undefined ? parsed.data.ogDescription : undefined,
        ogImageId: parsed.data.ogImageId !== undefined ? parsed.data.ogImageId : undefined,
        robotsIndex: parsed.data.robotsIndex,
        robotsFollow: parsed.data.robotsFollow,
        isVisible: parsed.data.isVisible !== undefined ? parsed.data.isVisible : undefined,
        sortOrder: parsed.data.sortOrder !== undefined ? parsed.data.sortOrder : undefined,
      },
      include: {
        logo: true,
      },
    })

    return api.ok(updatedBrand, 'Cập nhật thương hiệu thành công')
  } catch (error: any) {
    console.error('Brand Update API Error:', error)
    return api.serverError('Lỗi cập nhật thương hiệu')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await prisma.brand.findFirst({
      where: { id, deletedAt: null },
    })

    if (!brand) {
      return api.notFound('Không tìm thấy thương hiệu')
    }

    // Prevent if products exist in this brand
    const productsCount = await prisma.product.count({
      where: { brandId: id, deletedAt: null },
    })
    if (productsCount > 0) {
      return api.badRequest('Không thể xóa thương hiệu vì vẫn còn sản phẩm liên kết')
    }

    await prisma.brand.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return api.ok(null, 'Xóa thương hiệu thành công (soft delete)')
  } catch (error: any) {
    console.error('Brand Delete API Error:', error)
    return api.serverError('Lỗi xóa thương hiệu')
  }
}
