import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const authResult = await requireAdminSession(request)

    if (authResult.response) {
      return authResult.response
    }

    const { id } = await params
    const body = await request.json()

    const rating = Number(body.rating)

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập họ tên' },
        { status: 400 }
      )
    }

    if (!body.phone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập số điện thoại' },
        { status: 400 }
      )
    }

    if (!body.content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập nội dung đánh giá' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Số sao phải từ 1 đến 5' },
        { status: 400 }
      )
    }

    const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'HIDDEN']

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Trạng thái không hợp lệ' },
        { status: 400 }
      )
    }

    const updated = await prisma.productReview.update({
      where: { id },
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        rating,
        content: body.content.trim(),
        status: body.status,
        adminNote: body.adminNote?.trim() || null,
        approvedAt: body.status === 'APPROVED' ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Cập nhật đánh giá thành công',
    })
  } catch (error) {
    console.error('PATCH /api/admin/product-reviews/[id] error:', error)

    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật đánh giá' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  try {
    const authResult = await requireAdminSession(request)

    if (authResult.response) {
      return authResult.response
    }

    const { id } = await params

    await prisma.productReview.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa đánh giá thành công',
    })
  } catch (error) {
    console.error('DELETE /api/admin/product-reviews/[id] error:', error)

    return NextResponse.json(
      { success: false, error: 'Không thể xóa đánh giá' },
      { status: 500 }
    )
  }
}
