import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const { id } = await params
  const job = await prisma.aiGenerationJob.findUnique({ where: { id }, include: { items: { include: { post: { select: { id: true, title: true, slug: true } } }, orderBy: { createdAt: 'asc' } }, postCategory: true } })
  return job ? Response.json({ success: true, data: job }) : Response.json({ success: false, error: 'Không tìm thấy job' }, { status: 404 })
}
