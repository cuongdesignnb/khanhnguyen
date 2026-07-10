import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireCustomerSession } from '@/lib/customer-auth'

export const dynamic = 'force-dynamic'

interface RouteProps {
  params: Promise<{ productId: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  try {
    const authResult = await requireCustomerSession(request)

    if (authResult.response) {
      return authResult.response
    }

    const userId = authResult.session!.user.id
    const { productId } = await params

    await prisma.customerWishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi yêu thích',
    })
  } catch (error) {
    console.error('DELETE /api/customer/wishlist/[productId] error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Không thể xóa sản phẩm khỏi yêu thích',
      },
      { status: 500 }
    )
  }
}
