import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireMenuAdmin, validateMenuItem } from '@/lib/menu-admin'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request, true); if (auth.response) return auth.response
  const { id } = await params; const body = await request.json(); const error = validateMenuItem(body)
  if (error) return Response.json({ success: false, error }, { status: 400 })
  if (body.parentId === id) return Response.json({ success: false, error: 'Một mục không thể là cha của chính nó' }, { status: 400 })
  const data = await prisma.menuItem.update({ where: { id }, data: { parentId: body.parentId || null, label: body.label.trim(), url: body.url.trim(), type: body.type || 'INTERNAL', target: body.target || '_self', icon: body.icon || null, badge: body.badge || null, isActive: body.isActive !== false } })
  return Response.json({ success: true, data })
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMenuAdmin(request, true); if (auth.response) return auth.response
  const id = (await params).id
  await prisma.$transaction([prisma.menuItem.updateMany({ where: { parentId: id }, data: { parentId: null } }), prisma.menuItem.delete({ where: { id } })])
  return Response.json({ success: true })
}
