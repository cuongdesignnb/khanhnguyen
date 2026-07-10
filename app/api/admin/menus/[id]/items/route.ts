import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { buildMenuTree } from '@/lib/menu'
import { requireMenuAdmin, validateMenuItem } from '@/lib/menu-admin'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request); if (auth.response) return auth.response
  const items = await prisma.menuItem.findMany({ where: { menuId: (await params).id }, orderBy: { sortOrder: 'asc' } })
  return Response.json({ success: true, data: buildMenuTree(items, false) })
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request, true); if (auth.response) return auth.response
  const { id } = await params; const body = await request.json(); const error = validateMenuItem(body)
  if (error) return Response.json({ success: false, error }, { status: 400 })
  const count = await prisma.menuItem.count({ where: { menuId: id, parentId: body.parentId || null } })
  const data = await prisma.menuItem.create({ data: { menuId: id, parentId: body.parentId || null, label: body.label.trim(), url: body.url.trim(), type: body.type || 'INTERNAL', target: body.target || '_self', icon: body.icon || null, badge: body.badge || null, isActive: body.isActive !== false, sortOrder: count } })
  return Response.json({ success: true, data }, { status: 201 })
}
