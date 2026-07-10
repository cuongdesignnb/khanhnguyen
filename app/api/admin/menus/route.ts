import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireMenuAdmin } from '@/lib/menu-admin'

export async function GET(request: NextRequest) {
  const auth = await requireMenuAdmin(request)
  if (auth.response) return auth.response
  const data = await prisma.menu.findMany({ include: { _count: { select: { items: true } } }, orderBy: { location: 'asc' } })
  return Response.json({ success: true, data })
}
export async function POST(request: NextRequest) {
  const auth = await requireMenuAdmin(request, true); if (auth.response) return auth.response
  const body = await request.json()
  if (!body.name || !body.slug || !['HEADER','FOOTER','MOBILE'].includes(body.location)) return Response.json({ success: false, error: 'Dữ liệu menu không hợp lệ' }, { status: 400 })
  const data = await prisma.menu.create({ data: { name: String(body.name), slug: String(body.slug), location: body.location, description: body.description || null } })
  return Response.json({ success: true, data }, { status: 201 })
}
