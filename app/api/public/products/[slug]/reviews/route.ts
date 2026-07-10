import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Find the product first
    const product = await prisma.product.findFirst({
      where: { slug, deletedAt: null }
    })

    if (!product) {
      return api.notFound('Không tìm thấy sản phẩm')
    }

    // Get all approved reviews for this product
    const dbReviews = await prisma.productReview.findMany({
      where: {
        productId: product.id,
        status: 'APPROVED',
        deletedAt: null
      },
      include: {
        images: {
          include: {
            media: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedReviews = dbReviews.map((r) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      images: r.images.map((img) => ({
        url: img.media.url,
        alt: img.media.alt || r.name
      }))
    }))

    return api.ok(formattedReviews)
  } catch (error: any) {
    console.error('GET reviews error:', error)
    return api.serverError(error.message || 'Lỗi lấy danh sách đánh giá')
  }
}

export const dynamic = 'force-dynamic'
