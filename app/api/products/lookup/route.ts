import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { mapProductToPublicCard, mapProductToProductDetail } from '@/lib/public-mappers'
import * as api from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return api.badRequest('Danh sách ID sản phẩm không hợp lệ')
    }

    if (ids.length > 50) {
      return api.badRequest('Chỉ hỗ trợ tra cứu tối đa 50 sản phẩm cùng lúc')
    }

    if (ids.length === 0) {
      return api.ok({ cards: [], details: [] })
    }

    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: ids },
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        category: true,
        brand: true,
        thumbnail: true,
        specs: { orderBy: { sortOrder: 'asc' } },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    const cards = dbProducts.map(mapProductToPublicCard)
    const details = dbProducts.map(mapProductToProductDetail)

    return api.ok({ cards, details })
  } catch (error: any) {
    console.error('API Products lookup error:', error)
    return api.serverError('Lỗi xử lý tra cứu sản phẩm')
  }
}
