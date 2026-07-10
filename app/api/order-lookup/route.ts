import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'

// In-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limitWindow = 60 * 1000 // 1 minute
  const maxRequests = 10

  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow })
    return true
  }

  record.count += 1
  if (record.count > maxRequests) {
    return false
  }

  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Quá nhiều yêu cầu tra cứu. Vui lòng thử lại sau 1 phút.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { code, phone } = body

    if (!code || !phone) {
      return api.badRequest('Vui lòng cung cấp mã đơn hàng và số điện thoại')
    }

    // Find order by code
    const order = await prisma.order.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        items: true,
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!order || order.deletedAt) {
      return api.notFound('Không tìm thấy đơn hàng với thông tin đã cung cấp')
    }

    // Normalize phone numbers to digits only
    const normalizedInputPhone = phone.replace(/\D/g, '')
    const normalizedOrderPhone = order.phone.replace(/\D/g, '')

    // Verify ownership: check if the phone numbers match (either exact or input matches the end of order phone with at least 4 digits)
    if (normalizedInputPhone.length < 4) {
      return api.badRequest('Số điện thoại tra cứu không hợp lệ')
    }

    const isMatch =
      normalizedOrderPhone === normalizedInputPhone ||
      normalizedOrderPhone.endsWith(normalizedInputPhone) ||
      normalizedInputPhone.endsWith(normalizedOrderPhone)

    if (!isMatch) {
      return api.notFound('Không tìm thấy đơn hàng với thông tin đã cung cấp')
    }

    // Return public-safe order details
    const publicOrder = {
      code: order.code,
      customerName: order.customerName,
      company: order.company,
      phone: order.phone,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount.toString(),
      depositAmount: order.depositAmount.toString(),
      remainingAmount: order.remainingAmount.toString(),
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        model: item.model,
        sku: item.sku,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
      })),
      timeline: order.timeline.map((event) => ({
        id: event.id,
        type: event.type,
        title: event.title,
        description: event.description,
        createdAt: event.createdAt,
      })),
    }

    return api.ok(publicOrder, 'Tìm thấy thông tin đơn hàng')
  } catch (error: any) {
    console.error('API Order lookup error:', error)
    return api.serverError('Lỗi hệ thống khi tra cứu đơn hàng')
  }
}
