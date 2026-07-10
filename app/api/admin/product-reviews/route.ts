import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminSession(request)

    if (authResult.response) {
      return authResult.response
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const q = searchParams.get('q') || undefined

    const where: any = {
      deletedAt: null,
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        {
          product: {
            name: { contains: q, mode: 'insensitive' },
          },
        },
      ]
    }

    const reviews = await prisma.productReview.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnail: true,
          },
        },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: reviews.map((review) => ({
        id: review.id,
        productId: review.productId,
        productName: review.product?.name || '',
        productSlug: review.product?.slug || '',
        name: review.name,
        phone: review.phone,
        rating: review.rating,
        content: review.content,
        status: review.status,
        adminNote: review.adminNote,
        approvedAt: review.approvedAt,
        createdAt: review.createdAt,
        images: review.images.map((image) => ({
          id: image.id,
          url: image.media.url,
          alt: image.media.alt || review.name,
        })),
      })),
    })
  } catch (error) {
    console.error('GET /api/admin/product-reviews error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Không thể tải danh sách đánh giá sản phẩm',
      },
      { status: 500 }
    )
  }
}
