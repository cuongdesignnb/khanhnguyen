import { NextRequest, NextResponse } from 'next/server'
import { getProductList } from '@/lib/public-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const q = searchParams.get('q') || undefined
    const category = searchParams.get('category') || undefined
    const brand = searchParams.get('brand') || undefined
    const fuel = searchParams.get('fuel') || undefined
    const condition = searchParams.get('condition') || undefined
    const capacity = searchParams.get('capacity') || undefined
    const liftHeight = searchParams.get('liftHeight') || undefined
    const origin = searchParams.get('origin') || undefined
    const manufactureYear = searchParams.get('manufactureYear') || undefined
    const stockStatus = searchParams.get('stockStatus') || undefined
    
    const minPriceStr = searchParams.get('minPrice')
    const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined
    
    const maxPriceStr = searchParams.get('maxPrice')
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined
    
    const sort = (searchParams.get('sort') as any) || 'latest'
    
    const pageStr = searchParams.get('page')
    const page = pageStr ? parseInt(pageStr, 10) : 1
    
    const limitStr = searchParams.get('limit')
    const limit = limitStr ? parseInt(limitStr, 10) : 12

    const result = await getProductList({
      q,
      category,
      brand,
      fuel,
      condition,
      capacity,
      liftHeight,
      origin,
      manufactureYear,
      stockStatus,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Error in public products API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi hệ thống khi lấy danh sách sản phẩm',
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
