import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { orderSchema } from '@/lib/validators/order'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const q = searchParams.get('q') || ''
    const orderStatus = searchParams.get('orderStatus') || undefined
    const paymentStatus = searchParams.get('paymentStatus') || undefined
    const source = searchParams.get('source') || undefined
    const deliveryMethod = searchParams.get('deliveryMethod') || undefined
    const assignedToId = searchParams.get('assignedToId') || undefined
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
      AND: [
        q ? {
          OR: [
            { customerName: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } }
          ]
        } : {},
        orderStatus ? { orderStatus: orderStatus as any } : {},
        paymentStatus ? { paymentStatus: paymentStatus as any } : {},
        source ? { source: source as any } : {},
        deliveryMethod ? { deliveryMethod: deliveryMethod as any } : {},
        assignedToId ? { assignedToId } : {},
      ]
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          assignedTo: true
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where })
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
    console.error('Orders List API Error:', error)
    return api.serverError('Lỗi lấy danh sách đơn hàng')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const year = new Date().getFullYear()
    const prefix = `KN-${year}-`
    
    const lastOrder = await prisma.order.findFirst({
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
    if (lastOrder) {
      const parts = lastOrder.code.split('-')
      const numPart = parseInt(parts[2], 10)
      if (!isNaN(numPart)) {
        nextNum = numPart + 1
      }
    }

    const code = `${prefix}${nextNum.toString().padStart(4, '0')}`

    let paymentStatus = parsed.data.paymentStatus
    const deposit = parsed.data.depositAmount
    const total = parsed.data.totalAmount

    if (deposit >= total) {
      paymentStatus = 'PAID'
    } else if (deposit > 0) {
      paymentStatus = 'PARTIAL'
    } else {
      paymentStatus = 'UNPAID'
    }

    const order = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.create({
        data: {
          code,
          customerName: parsed.data.customerName,
          company: parsed.data.company || null,
          phone: parsed.data.phone,
          email: parsed.data.email || null,
          address: parsed.data.address || null,
          totalAmount: total,
          depositAmount: deposit,
          remainingAmount: parsed.data.remainingAmount,
          discountAmount: parsed.data.discountAmount,
          shippingFee: parsed.data.shippingFee,
          orderStatus: parsed.data.orderStatus,
          paymentStatus,
          source: parsed.data.source,
          deliveryMethod: parsed.data.deliveryMethod,
          paymentMethod: parsed.data.paymentMethod || null,
          assignedToId: parsed.data.assignedToId || null,
          note: parsed.data.note || null,
          internalNote: parsed.data.internalNote || null,
          expectedDeliveryAt: parsed.data.expectedDeliveryAt ? new Date(parsed.data.expectedDeliveryAt) : null,
        }
      })

      await tx.orderItem.createMany({
        data: parsed.data.items.map(item => ({
          orderId: ord.id,
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

      await tx.orderTimelineEvent.create({
        data: {
          orderId: ord.id,
          type: 'create',
          title: 'Đơn hàng được tạo',
          description: `Đơn hàng ${code} được khởi tạo từ ${parsed.data.source === 'WEBSITE' ? 'website' : 'quản trị viên'}.`,
        }
      })

      if (deposit > 0) {
        await tx.orderPayment.create({
          data: {
            orderId: ord.id,
            amount: deposit,
            method: parsed.data.paymentMethod || 'TRANSFER',
            status: 'PAID',
            note: 'Đặt cọc đơn hàng'
          }
        })

        await tx.orderTimelineEvent.create({
          data: {
            orderId: ord.id,
            type: 'payment',
            title: 'Thanh toán tiền cọc',
            description: `Khách hàng đặt cọc số tiền ${new Intl.NumberFormat('vi-VN').format(deposit)}đ.`,
          }
        })
      }

      return ord
    })

    const finalOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        payments: true,
        timeline: true,
        assignedTo: true
      }
    })

    return api.created(finalOrder, 'Tạo đơn hàng thành công')
  } catch (error: any) {
    console.error('Orders Create API Error:', error)
    return api.serverError('Lỗi tạo đơn hàng')
  }
}
export const dynamic = 'force-dynamic'
