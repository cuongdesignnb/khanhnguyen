import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { productSchema } from '@/lib/validators/product'
import { generateUniqueSlug } from '@/lib/slug'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const q = searchParams.get('q') || ''
    const categoryId = searchParams.get('categoryId') || undefined
    const brandId = searchParams.get('brandId') || undefined
    const status = searchParams.get('status') || undefined
    const stockStatus = searchParams.get('stockStatus') || undefined
    const isFeatured = searchParams.get('isFeatured') === 'true' ? true : searchParams.get('isFeatured') === 'false' ? false : undefined
    const showOnHome = searchParams.get('showOnHome') === 'true' ? true : searchParams.get('showOnHome') === 'false' ? false : undefined
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { model: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } }
          ]
        } : {},
        categoryId ? { categoryId } : {},
        brandId ? { brandId } : {},
        status ? { status: status as any } : {},
        stockStatus ? { stockStatus: stockStatus as any } : {},
        isFeatured !== undefined ? { isFeatured } : {},
        showOnHome !== undefined ? { showOnHome } : {},
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
      ]
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          thumbnail: true
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return api.ok({
      items,
      total,
      page,
      limit,
      totalPages
    })
  } catch (error: any) {
    console.error('Products List API Error:', error)
    return api.serverError('Lỗi lấy danh sách sản phẩm')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = productSchema.safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
      const existing = await prisma.product.findUnique({ where: { slug: s } })
      return !!existing
    })

    let sku = parsed.data.sku
    if (!sku) {
      const count = await prisma.product.count()
      sku = `KN-${(count + 1).toString().padStart(4, '0')}`
    }

    const product = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.create({
        data: {
          categoryId: parsed.data.categoryId,
          brandId: parsed.data.brandId || null,
          thumbnailId: parsed.data.thumbnailId || null,
          name: parsed.data.name,
          slug,
          sku,
          model: parsed.data.model || null,
          shortDescription: parsed.data.shortDescription || null,
          description: parsed.data.description || null,
          advantages: parsed.data.advantages || Prisma.JsonNull,
          warrantyPolicy: parsed.data.warrantyPolicy || null,
          price: parsed.data.price || null,
          priceLabel: parsed.data.priceLabel || 'Liên hệ',
          badge: parsed.data.badge || null,
          status: parsed.data.status,
          stockStatus: parsed.data.stockStatus,
          isFeatured: parsed.data.isFeatured,
          showOnHome: parsed.data.showOnHome,
          isBestSeller: parsed.data.isBestSeller,
          sortOrder: parsed.data.sortOrder,
          capacity: parsed.data.capacity || null,
          liftHeight: parsed.data.liftHeight || null,
          fuelType: parsed.data.fuelType || null,
          manufactureYear: parsed.data.manufactureYear || null,
          forkLength: parsed.data.forkLength || null,
          condition: parsed.data.condition || null,
          origin: parsed.data.origin || null,
          seoTitle: parsed.data.seoTitle || null,
          seoDescription: parsed.data.seoDescription || null,
        }
      })

      if (parsed.data.specs && parsed.data.specs.length > 0) {
        await tx.productSpec.createMany({
          data: parsed.data.specs.map(spec => ({
            productId: prod.id,
            label: spec.label,
            value: spec.value,
            sortOrder: spec.sortOrder
          }))
        })
      }

      if (parsed.data.images && parsed.data.images.length > 0) {
        await tx.productImage.createMany({
          data: parsed.data.images.map(img => ({
            productId: prod.id,
            mediaId: img.mediaId,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary
          }))
        })
      }

      return prod
    })

    const finalProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        brand: true,
        thumbnail: true,
        images: { include: { media: true } },
        specs: true
      }
    })

    return api.created(finalProduct, 'Tạo sản phẩm thành công')
  } catch (error: any) {
    console.error('Products Create API Error:', error)
    return api.serverError('Lỗi tạo sản phẩm')
  }
}
export const dynamic = 'force-dynamic'
