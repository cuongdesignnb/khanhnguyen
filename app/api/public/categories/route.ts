import { NextRequest, NextResponse } from 'next/server'
import { getVisibleCategories } from '@/lib/public-data'

export async function GET(request: NextRequest) {
  try {
    const categories = await getVisibleCategories()
    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error: any) {
    console.error('Error in public categories API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi hệ thống khi lấy danh mục',
      },
      { status: 500 }
    )
  }
}
