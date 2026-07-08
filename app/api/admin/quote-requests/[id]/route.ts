import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { quoteRequestSchema } from '@/lib/validators/quote'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quote = await prisma.quoteRequest.findUnique({
      where: { id, deletedAt: null },
      include: { product: true, assignedTo: true }
    })

    if (!quote) {
      return api.notFound('Không tìm thấy yêu cầu báo giá')
    }

    return api.ok(quote)
  } catch (error: any) {
    console.error('Quote Request Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin yêu cầu báo giá')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.quoteRequest.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existing) {
      return api.notFound('Không tìm thấy yêu cầu báo giá')
    }

    const body = await request.json()
    const parsed = quoteRequestSchema.partial().safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email !== undefined ? parsed.data.email : undefined,
        company: parsed.data.company !== undefined ? parsed.data.company : undefined,
        productId: parsed.data.productId !== undefined ? parsed.data.productId : undefined,
        productName: parsed.data.productName !== undefined ? parsed.data.productName : undefined,
        quantity: parsed.data.quantity,
        budget: parsed.data.budget !== undefined ? parsed.data.budget : undefined,
        message: parsed.data.message !== undefined ? parsed.data.message : undefined,
        status: parsed.data.status,
        internalNote: parsed.data.internalNote !== undefined ? parsed.data.internalNote : undefined,
        assignedToId: parsed.data.assignedToId !== undefined ? parsed.data.assignedToId : undefined,
      },
      include: { product: true, assignedTo: true }
    })

    return api.ok(updated, 'Cập nhật yêu cầu báo giá thành công')
  } catch (error: any) {
    console.error('Quote Request Update API Error:', error)
    return api.serverError('Lỗi cập nhật yêu cầu báo giá')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quote = await prisma.quoteRequest.findUnique({
      where: { id, deletedAt: null }
    })

    if (!quote) {
      return api.notFound('Không tìm thấy yêu cầu báo giá')
    }

    await prisma.quoteRequest.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return api.ok(null, 'Xóa yêu cầu báo giá thành công')
  } catch (error: any) {
    console.error('Quote Request Delete API Error:', error)
    return api.serverError('Lỗi xóa yêu cầu báo giá')
  }
}
export const dynamic = 'force-dynamic'
