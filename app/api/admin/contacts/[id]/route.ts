import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { contactSchema } from '@/lib/validators/contact'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contact = await prisma.contact.findUnique({
      where: { id, deletedAt: null },
      include: { assignedTo: true }
    })

    if (!contact) {
      return api.notFound('Không tìm thấy liên hệ')
    }

    return api.ok(contact)
  } catch (error: any) {
    console.error('Contact Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin liên hệ')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.contact.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existing) {
      return api.notFound('Không tìm thấy liên hệ')
    }

    const body = await request.json()
    const parsed = contactSchema.partial().safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email !== undefined ? parsed.data.email : undefined,
        company: parsed.data.company !== undefined ? parsed.data.company : undefined,
        need: parsed.data.need !== undefined ? parsed.data.need : undefined,
        message: parsed.data.message !== undefined ? parsed.data.message : undefined,
        status: parsed.data.status,
        internalNote: parsed.data.internalNote !== undefined ? parsed.data.internalNote : undefined,
        assignedToId: parsed.data.assignedToId !== undefined ? parsed.data.assignedToId : undefined,
      },
      include: { assignedTo: true }
    })

    return api.ok(updated, 'Cập nhật liên hệ thành công')
  } catch (error: any) {
    console.error('Contact Update API Error:', error)
    return api.serverError('Lỗi cập nhật liên hệ')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contact = await prisma.contact.findUnique({
      where: { id, deletedAt: null }
    })

    if (!contact) {
      return api.notFound('Không tìm thấy liên hệ')
    }

    await prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return api.ok(null, 'Xóa liên hệ thành công')
  } catch (error: any) {
    console.error('Contact Delete API Error:', error)
    return api.serverError('Lỗi xóa liên hệ')
  }
}
export const dynamic = 'force-dynamic'
