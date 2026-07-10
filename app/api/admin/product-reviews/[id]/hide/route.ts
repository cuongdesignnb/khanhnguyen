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

    const review = await prisma.productReview.update({
      where: { id },
      data: {
        status: 'HIDDEN',
      },
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Đã ẩn đánh giá',
    })
  } catch (error) {
    console.error('PATCH hide review error:', error)

    return NextResponse.json(
      { success: false, error: 'Không thể ẩn đánh giá' },
      { status: 500 }
    )
  }
}
