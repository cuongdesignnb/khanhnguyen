import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || undefined
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const where: Prisma.QuoteRequestWhereInput = {
      deletedAt: null,
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } }
          ]
        } : {},
        status ? { status: status as any } : {},
      ]
    }

    const [items, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        include: { product: true, assignedTo: true },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.quoteRequest.count({ where })
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
    console.error('Quote Requests List API Error:', error)
    return api.serverError('Lỗi lấy danh sách yêu cầu báo giá')
  }
}
export const dynamic = 'force-dynamic'
