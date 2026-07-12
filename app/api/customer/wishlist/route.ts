import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireCustomerSession } from '@/lib/customer-auth'
import { mapProductToPublicCard } from '@/lib/public-mappers'

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
        product: mapProductToPublicCard(item.product),
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
