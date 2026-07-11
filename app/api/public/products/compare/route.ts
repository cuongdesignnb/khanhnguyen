import { NextResponse } from 'next/server'
import { buildComparisonMatrix } from '@/lib/compare/build-comparison-matrix'
import { getCompareConfig, getPublicCompareProducts, uniqueIds } from '@/lib/compare/server'

export async function POST(request: Request) {
  try {
    const ids=uniqueIds((await request.json()).productIds); const config=await getCompareConfig()
    if(ids.length<1 || ids.length>config.compareMaxItems) return NextResponse.json({success:false,error:`Chọn từ 1 đến ${config.compareMaxItems} sản phẩm.`},{status:400})
    const products=await getPublicCompareProducts(ids); const found=new Set(products.map((p)=>p.id))
    return NextResponse.json({success:true,data:buildComparisonMatrix(products,ids.filter((id)=>!found.has(id)))})
  } catch(error){ console.error('Compare API:',error); return NextResponse.json({success:false,error:'Không thể tải dữ liệu so sánh.'},{status:500}) }
}
export const dynamic='force-dynamic'
