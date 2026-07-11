import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { productSchema } from '@/lib/validators/product'
import { generateUniqueSlug } from '@/lib/slug'
import { Prisma } from '@prisma/client'
import { recordSeoRedirect } from '@/lib/seo/redirects'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        brand: true,
        thumbnail: true,
        images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
        specs: { orderBy: { sortOrder: 'asc' } }
      }
    })

    if (!product) {
      return api.notFound('Không tìm thấy sản phẩm')
    }

    return api.ok(product)
  } catch (error: any) {
    console.error('Product Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin sản phẩm')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingProduct = await prisma.product.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existingProduct) {
      return api.notFound('Không tìm thấy sản phẩm')
    }

    const body = await request.json()
    const parsed = productSchema.partial().safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    let slug = existingProduct.slug
    if (parsed.data.name && parsed.data.name !== existingProduct.name) {
      slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
        const existing = await prisma.product.findFirst({
          where: { slug: s, id: { not: id } }
        })
        return !!existing
      })
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.update({
        where: { id },
        data: {
          categoryId: parsed.data.categoryId,
          brandId: parsed.data.brandId !== undefined ? parsed.data.brandId : undefined,
          thumbnailId: parsed.data.thumbnailId !== undefined ? parsed.data.thumbnailId : undefined,
          name: parsed.data.name,
          slug,
          sku: parsed.data.sku !== undefined ? parsed.data.sku : undefined,
          model: parsed.data.model !== undefined ? parsed.data.model : undefined,
          shortDescription: parsed.data.shortDescription !== undefined ? parsed.data.shortDescription : undefined,
          description: parsed.data.description !== undefined ? parsed.data.description : undefined,
          advantages: parsed.data.advantages !== undefined ? (parsed.data.advantages || Prisma.JsonNull) : undefined,
          warrantyPolicy: parsed.data.warrantyPolicy !== undefined ? parsed.data.warrantyPolicy : undefined,
          price: parsed.data.price !== undefined ? parsed.data.price : undefined,
          priceLabel: parsed.data.priceLabel !== undefined ? parsed.data.priceLabel : undefined,
          badge: parsed.data.badge !== undefined ? parsed.data.badge : undefined,
          status: parsed.data.status,
          stockStatus: parsed.data.stockStatus,
          isFeatured: parsed.data.isFeatured,
          showOnHome: parsed.data.showOnHome,
          isBestSeller: parsed.data.isBestSeller,
          sortOrder: parsed.data.sortOrder,
          capacity: parsed.data.capacity !== undefined ? parsed.data.capacity : undefined,
          liftHeight: parsed.data.liftHeight !== undefined ? parsed.data.liftHeight : undefined,
          fuelType: parsed.data.fuelType !== undefined ? parsed.data.fuelType : undefined,
          manufactureYear: parsed.data.manufactureYear !== undefined ? parsed.data.manufactureYear : undefined,
          forkLength: parsed.data.forkLength !== undefined ? parsed.data.forkLength : undefined,
          condition: parsed.data.condition !== undefined ? parsed.data.condition : undefined,
          origin: parsed.data.origin !== undefined ? parsed.data.origin : undefined,
          seoTitle: parsed.data.seoTitle !== undefined ? parsed.data.seoTitle : undefined,
          seoDescription: parsed.data.seoDescription !== undefined ? parsed.data.seoDescription : undefined,
          canonicalUrl: parsed.data.canonicalUrl !== undefined ? parsed.data.canonicalUrl : undefined,
          ogTitle: parsed.data.ogTitle !== undefined ? parsed.data.ogTitle : undefined,
          ogDescription: parsed.data.ogDescription !== undefined ? parsed.data.ogDescription : undefined,
          ogImageId: parsed.data.ogImageId !== undefined ? parsed.data.ogImageId : undefined,
          robotsIndex: parsed.data.robotsIndex,
          robotsFollow: parsed.data.robotsFollow,
        }
      })

      if (body.specs !== undefined) {
        await tx.productSpec.deleteMany({ where: { productId: id } })
        if (parsed.data.specs && parsed.data.specs.length > 0) {
          await tx.productSpec.createMany({
            data: parsed.data.specs.map(spec => ({
              productId: id,
              label: spec.label,
              value: spec.value,
              sortOrder: spec.sortOrder
            }))
          })
        }
      }

      if (body.images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } })
        if (parsed.data.images && parsed.data.images.length > 0) {
          await tx.productImage.createMany({
            data: parsed.data.images.map(img => ({
              productId: id,
              mediaId: img.mediaId,
              sortOrder: img.sortOrder,
              isPrimary: img.isPrimary
            }))
          })
        }
      }

      return prod
    })

    const finalProduct = await prisma.product.findUnique({
      where: { id: updatedProduct.id },
      include: {
        category: true,
        brand: true,
        thumbnail: true,
        images: { include: { media: true } },
        specs: true
      }
    })
    if (slug !== existingProduct.slug) await recordSeoRedirect(`/san-pham/${existingProduct.slug}`, `/san-pham/${slug}`)
    revalidatePath('/'); revalidatePath('/san-pham'); revalidatePath(`/san-pham/${slug}`); revalidatePath('/sitemap.xml')

    return api.ok(finalProduct, 'Cập nhật sản phẩm thành công')
  } catch (error: any) {
    console.error('Product Update API Error:', error)
    return api.serverError('Lỗi cập nhật sản phẩm')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null }
    })

    if (!product) {
      return api.notFound('Không tìm thấy sản phẩm')
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return api.ok(null, 'Xóa sản phẩm thành công (soft delete)')
  } catch (error: any) {
    console.error('Product Delete API Error:', error)
    return api.serverError('Lỗi xóa sản phẩm')
  }
}
