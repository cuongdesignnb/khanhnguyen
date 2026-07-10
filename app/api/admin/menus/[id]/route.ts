import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { buildMenuTree } from '@/lib/menu'
import { requireMenuAdmin } from '@/lib/menu-admin'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request); if (auth.response) return auth.response
  const { id } = await params
  const menu = await prisma.menu.findUnique({ where: { id }, include: { items: true } })
  return menu ? Response.json({ success: true, data: { ...menu, items: buildMenuTree(menu.items, false) } }) : Response.json({ success: false, error: 'Không tìm thấy menu' }, { status: 404 })
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request, true); if (auth.response) return auth.response
  const { id } = await params; const body = await request.json()
  const data = await prisma.menu.update({ where: { id }, data: { name: body.name, description: body.description, isActive: body.isActive } })
  return Response.json({ success: true, data })
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request, true); if (auth.response) return auth.response
  await prisma.menu.delete({ where: { id: (await params).id } })
  return Response.json({ success: true })
}
