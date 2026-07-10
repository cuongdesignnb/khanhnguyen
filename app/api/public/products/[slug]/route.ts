import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug, getRelatedProducts } from '@/lib/public-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const product = await getProductBySlug(resolvedParams.slug)
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy sản phẩm',
        },
        { status: 404 }
      )
    }

    const relatedProducts = await getRelatedProducts(
      product.id,
      product.categoryId,
      6
    )

    return NextResponse.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    })
  } catch (error: any) {
    console.error('Error in public product detail API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi hệ thống khi lấy chi tiết sản phẩm',
      },
      { status: 500 }
    )
  }
}
