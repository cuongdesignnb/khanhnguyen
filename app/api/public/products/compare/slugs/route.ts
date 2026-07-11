import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { buildComparisonMatrix } from '@/lib/compare/build-comparison-matrix'
import { getCompareConfig, uniqueIds } from '@/lib/compare/server'
export async function POST(request:Request){
 try{const slugs=uniqueIds((await request.json()).slugs);const c=await getCompareConfig();if(!slugs.length||slugs.length>c.compareMaxItems)return NextResponse.json({success:false,error:'Danh sách không hợp lệ.'},{status:400})
 const db=await prisma.product.findMany({where:{slug:{in:slugs},status:'PUBLISHED',deletedAt:null},include:{category:true,brand:true,thumbnail:true,specs:{orderBy:{sortOrder:'asc'}}}});const map=new Map(db.map(p=>[p.slug,p]));const ordered=slugs.map(s=>map.get(s)).filter((p):p is NonNullable<typeof p>=>!!p)
 return NextResponse.json({success:true,data:buildComparisonMatrix(ordered,[])})}catch(e){console.error(e);return NextResponse.json({success:false,error:'Không thể mở liên kết so sánh.'},{status:500})}}
