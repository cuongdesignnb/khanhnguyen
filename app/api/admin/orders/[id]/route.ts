import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { orderSchema } from '@/lib/validators/order'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id, deletedAt: null },
      include: {
        items: true,
        payments: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        assignedTo: true
      }
    })

    if (!order) {
      return api.notFound('Không tìm thấy đơn hàng')
    }

    return api.ok(order)
  } catch (error: any) {
    console.error('Order Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin đơn hàng')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingOrder = await prisma.order.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existingOrder) {
      return api.notFound('Không tìm thấy đơn hàng')
    }

    const body = await request.json()
    const parsed = orderSchema.partial().safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const dataToUpdate: any = {
        customerName: parsed.data.customerName,
        company: parsed.data.company !== undefined ? parsed.data.company : undefined,
        phone: parsed.data.phone,
        email: parsed.data.email !== undefined ? parsed.data.email : undefined,
        address: parsed.data.address !== undefined ? parsed.data.address : undefined,
        totalAmount: parsed.data.totalAmount,
        depositAmount: parsed.data.depositAmount,
        remainingAmount: parsed.data.remainingAmount,
        discountAmount: parsed.data.discountAmount,
        shippingFee: parsed.data.shippingFee,
        orderStatus: parsed.data.orderStatus,
        paymentStatus: parsed.data.paymentStatus,
        source: parsed.data.source,
        deliveryMethod: parsed.data.deliveryMethod,
        paymentMethod: parsed.data.paymentMethod !== undefined ? parsed.data.paymentMethod : undefined,
        assignedToId: parsed.data.assignedToId !== undefined ? parsed.data.assignedToId : undefined,
        note: parsed.data.note !== undefined ? parsed.data.note : undefined,
        internalNote: parsed.data.internalNote !== undefined ? parsed.data.internalNote : undefined,
        expectedDeliveryAt: parsed.data.expectedDeliveryAt ? new Date(parsed.data.expectedDeliveryAt) : undefined,
      }

      const ord = await tx.order.update({
        where: { id },
        data: dataToUpdate
      })

      if (parsed.data.orderStatus && parsed.data.orderStatus !== existingOrder.orderStatus) {
        let title = 'Cập nhật trạng thái đơn hàng'
        let description = `Trạng thái đơn hàng được chuyển từ ${existingOrder.orderStatus} sang ${parsed.data.orderStatus}.`
        
        if (parsed.data.orderStatus === 'CONFIRMED') {
          title = 'Đơn hàng được xác nhận'
          description = 'Đơn hàng đã được quản trị viên xác nhận thông tin.'
        } else if (parsed.data.orderStatus === 'PROCESSING') {
          title = 'Đang xử lý đơn hàng'
          description = 'Đang chuẩn bị sản phẩm/xe nâng và các giấy tờ liên quan.'
        } else if (parsed.data.orderStatus === 'SHIPPING') {
          title = 'Bắt đầu vận chuyển/lắp đặt'
          description = 'Sản phẩm đang được vận chuyển đến địa điểm bàn giao của khách hàng.'
        } else if (parsed.data.orderStatus === 'COMPLETED') {
          title = 'Hoàn thành bàn giao đơn hàng'
          description = 'Đã bàn giao xe nâng hoàn tất, nghiệm thu và thanh lý hợp đồng.'
        } else if (parsed.data.orderStatus === 'CANCELLED') {
          title = 'Đã hủy đơn hàng'
          description = `Đơn hàng bị hủy. Ghi chú: ${parsed.data.note || 'Không có lý do chi tiết'}.`
        }

        await tx.orderTimelineEvent.create({
          data: {
            orderId: id,
            type: 'update',
            title,
            description,
          }
        })
      }

      if (parsed.data.paymentStatus && parsed.data.paymentStatus !== existingOrder.paymentStatus) {
        await tx.orderTimelineEvent.create({
          data: {
            orderId: id,
            type: 'payment',
            title: 'Cập nhật trạng thái thanh toán',
            description: `Trạng thái thanh toán của đơn hàng chuyển sang ${parsed.data.paymentStatus}.`,
          }
        })
      }

      if (body.items !== undefined) {
        await tx.orderItem.deleteMany({ where: { orderId: id } })
        if (parsed.data.items && parsed.data.items.length > 0) {
          await tx.orderItem.createMany({
            data: parsed.data.items.map(item => ({
              orderId: id,
              productId: item.productId || null,
              productName: item.productName,
              model: item.model || null,
              sku: item.sku || null,
              imageUrl: item.imageUrl || null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice
            }))
          })
        }
      }

      return ord
    })

    const finalOrder = await prisma.order.findUnique({
      where: { id: updatedOrder.id },
      include: {
        items: true,
        payments: true,
        timeline: true,
        assignedTo: true
      }
    })

    return api.ok(finalOrder, 'Cập nhật đơn hàng thành công')
  } catch (error: any) {
    console.error('Order Update API Error:', error)
    return api.serverError('Lỗi cập nhật đơn hàng')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id, deletedAt: null }
    })

    if (!order) {
      return api.notFound('Không tìm thấy đơn hàng')
    }

    await prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return api.ok(null, 'Xóa đơn hàng thành công')
  } catch (error: any) {
    console.error('Order Delete API Error:', error)
    return api.serverError('Lỗi xóa đơn hàng')
  }
}
export const dynamic = 'force-dynamic'
