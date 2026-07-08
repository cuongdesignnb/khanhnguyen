import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { contactSchema } from '@/lib/validators/contact'
import * as api from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)
    
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const contact = await prisma.contact.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        company: parsed.data.company || null,
        need: parsed.data.need || null,
        message: parsed.data.message || null,
        status: 'NEW',
      },
    })

    return api.created(contact, 'Gửi liên hệ thành công')
  } catch (error: any) {
    console.error('API Contact error:', error)
    return api.serverError('Lỗi xử lý yêu cầu liên hệ')
  }
}
