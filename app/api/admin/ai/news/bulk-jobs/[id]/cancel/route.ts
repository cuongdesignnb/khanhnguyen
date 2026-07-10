import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const { id } = await params
  const job = await prisma.aiGenerationJob.findUnique({ where: { id } })
  if (!job) return Response.json({ success: false, error: 'Không tìm thấy job' }, { status: 404 })
  await prisma.$transaction([
    prisma.aiGenerationJob.update({ where: { id }, data: { status: 'CANCELLED', finishedAt: new Date() } }),
    prisma.aiGeneratedPostItem.updateMany({ where: { jobId: id, status: 'PENDING' }, data: { status: 'SKIPPED' } }),
  ])
  return Response.json({ success: true, data: { jobId: id, status: 'CANCELLED' } })
}
