import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { quoteRequestSchema } from '@/lib/validators/quote'
import * as api from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = quoteRequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const year = new Date().getFullYear()
    const prefix = `BG-${year}-`
    
    const lastQuote = await prisma.quoteRequest.findFirst({
      where: {
        code: {
          startsWith: prefix,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    let nextNum = 1
    if (lastQuote) {
      const parts = lastQuote.code.split('-')
      const numPart = parseInt(parts[2], 10)
      if (!isNaN(numPart)) {
        nextNum = numPart + 1
      }
    }

    const code = `${prefix}${nextNum.toString().padStart(4, '0')}`

    const quote = await prisma.quoteRequest.create({
      data: {
        code,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        company: parsed.data.company || null,
        productId: parsed.data.productId || null,
        productName: parsed.data.productName || null,
        quantity: parsed.data.quantity || 1,
        budget: parsed.data.budget || null,
        message: parsed.data.message || null,
        status: 'NEW',
      },
    })

    return api.created(quote, 'Gửi yêu cầu báo giá thành công')
  } catch (error: any) {
    console.error('API Quote request error:', error)
    return api.serverError('Lỗi xử lý yêu cầu báo giá')
  }
}
