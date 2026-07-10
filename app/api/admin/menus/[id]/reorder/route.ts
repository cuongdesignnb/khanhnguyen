import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireMenuAdmin } from '@/lib/menu-admin'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request, true); if (auth.response) return auth.response
  const menuId = (await params).id; const body = await request.json()
  if (!Array.isArray(body.items)) return Response.json({ success: false, error: 'Danh sách sắp xếp không hợp lệ' }, { status: 400 })
  const ids = body.items.map((item: any) => item.id)
  const owned = await prisma.menuItem.count({ where: { menuId, id: { in: ids } } })
  if (owned !== ids.length) return Response.json({ success: false, error: 'Có mục menu không thuộc menu này' }, { status: 400 })
  await prisma.$transaction(body.items.map((item: any) => prisma.menuItem.update({ where: { id: item.id }, data: { parentId: item.parentId || null, sortOrder: Number(item.sortOrder) || 0 } })))
  return Response.json({ success: true })
}
