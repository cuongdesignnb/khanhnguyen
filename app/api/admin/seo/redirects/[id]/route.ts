import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { cleanCanonicalPath } from '@/lib/seo/canonical'

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Context) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  if ((auth.session?.user as any)?.role !== 'ADMIN') return Response.json({ success: false, error: 'Không có quyền thay đổi chuyển hướng.' }, { status: 403 })
  const { id } = await params
  const current = await prisma.seoRedirect.findUnique({ where: { id } })
  if (!current) return Response.json({ success: false, error: 'Không tìm thấy chuyển hướng.' }, { status: 404 })
  const body = await request.json()
  const sourcePath = body.sourcePath === undefined ? current.sourcePath : cleanCanonicalPath(String(body.sourcePath))
  const targetPath = body.targetPath === undefined ? current.targetPath : cleanCanonicalPath(String(body.targetPath))
  if (sourcePath === '/' || sourcePath === targetPath) return Response.json({ success: false, error: 'Đường dẫn chuyển hướng không hợp lệ.' }, { status: 400 })
  const reverse = await prisma.seoRedirect.findFirst({ where: { id: { not: id }, sourcePath: targetPath, targetPath: sourcePath, isActive: true } })
  if (reverse) return Response.json({ success: false, error: 'Chuyển hướng này tạo vòng lặp.' }, { status: 409 })
  const item = await prisma.seoRedirect.update({ where: { id }, data: { sourcePath, targetPath, isActive: body.isActive ?? current.isActive } })
  return Response.json({ success: true, data: item })
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  if ((auth.session?.user as any)?.role !== 'ADMIN') return Response.json({ success: false, error: 'Không có quyền xóa chuyển hướng.' }, { status: 403 })
  const { id } = await params
  await prisma.seoRedirect.delete({ where: { id } })
  return Response.json({ success: true })
}
