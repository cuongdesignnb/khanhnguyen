import { NextRequest, NextResponse } from 'next/server'
import { getVisibleBrands } from '@/lib/public-data'

export async function GET(request: NextRequest) {
  try {
    const brands = await getVisibleBrands()
    return NextResponse.json({
      success: true,
      data: brands,
    })
  } catch (error: any) {
    console.error('Error in public brands API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi hệ thống khi lấy thương hiệu',
      },
      { status: 500 }
    )
  }
}
