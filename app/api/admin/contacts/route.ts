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

    const where: Prisma.ContactWhereInput = {
      deletedAt: null,
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } }
          ]
        } : {},
        status ? { status: status as any } : {},
      ]
    }

    const [items, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: { assignedTo: true },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.contact.count({ where })
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
    console.error('Contacts List API Error:', error)
    return api.serverError('Lỗi lấy danh sách liên hệ')
  }
}
export const dynamic = 'force-dynamic'
