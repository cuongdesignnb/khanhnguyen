import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireCustomerSession } from '@/lib/customer-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireCustomerSession(request)

    if (authResult.response) {
      return authResult.response
    }

    const userId = authResult.session!.user.id

    const items = await prisma.customerWishlist.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
            thumbnail: true,
            specs: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        createdAt: item.createdAt,
        product: {
          id: item.product.id,
          slug: item.product.slug,
          badge: item.product.badge || undefined,
          category: item.product.category?.name || 'Sản phẩm',
          categorySlug: item.product.category?.slug || '',
          brand: item.product.brand?.name || null,
          name: item.product.name,
          model: item.product.model || item.product.name,
          image: item.product.thumbnail?.url || '/images/placeholder.jpg',
          specs:
            item.product.specs?.length > 0
              ? item.product.specs.slice(0, 3).map((spec) => ({
                  label: spec.label,
                  value: spec.value,
                }))
              : [
                  ...(item.product.capacity
                    ? [{ label: 'Tải trọng', value: item.product.capacity }]
                    : []),
                  ...(item.product.liftHeight
                    ? [{ label: 'Chiều cao nâng', value: item.product.liftHeight }]
                    : []),
                  ...(item.product.manufactureYear
                    ? [{ label: 'Năm SX', value: String(item.product.manufactureYear) }]
                    : []),
                ],
          price: item.product.price ? String(item.product.price) : null,
          priceLabel: item.product.priceLabel || 'Liên hệ',
        },
      })),
    })
  } catch (error) {
    console.error('GET /api/customer/wishlist error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Không thể tải danh sách yêu thích',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireCustomerSession(request)

    if (authResult.response) {
      return authResult.response
    }

    const userId = authResult.session!.user.id
    const body = await request.json()
    const productId = body.productId

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thiếu productId',
        },
        { status: 400 }
      )
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sản phẩm không tồn tại',
        },
        { status: 404 }
      )
    }

    const item = await prisma.customerWishlist.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
    })

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Đã thêm sản phẩm vào yêu thích',
    })
  } catch (error) {
    console.error('POST /api/customer/wishlist error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Không thể thêm sản phẩm vào yêu thích',
      },
      { status: 500 }
    )
  }
}
