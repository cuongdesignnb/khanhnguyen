import { NextRequest, NextResponse } from 'next/server'
import { getProductFilterOptions } from '@/lib/public-data'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') || undefined
    const data = await getProductFilterOptions(category)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error in product-filter-options API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi hệ thống khi lấy bộ lọc',
      },
      { status: 500 }
    )
  }
}
