import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { cleanCanonicalPath } from '@/lib/seo/canonical'
import { recordSeoRedirect } from '@/lib/seo/redirects'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const items = await prisma.seoRedirect.findMany({ orderBy: { updatedAt: 'desc' }, take: 500 })
  return Response.json({ success: true, data: items })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  if (!isAdmin(auth.session)) return Response.json({ success: false, error: 'Chỉ quản trị viên được thay đổi chuyển hướng.' }, { status: 403 })
  const body = await request.json()
  const sourcePath = cleanCanonicalPath(String(body.sourcePath || ''))
  const targetPath = cleanCanonicalPath(String(body.targetPath || ''))
  if (!sourcePath || !targetPath || sourcePath === '/' || sourcePath === targetPath) return Response.json({ success: false, error: 'Đường dẫn chuyển hướng không hợp lệ.' }, { status: 400 })
  const item = await recordSeoRedirect(sourcePath, targetPath)
  return Response.json({ success: true, data: item }, { status: 201 })
}

export const dynamic = 'force-dynamic'
