import { NextRequest, after } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { runAiNewsJob } from '@/lib/ai/ai-job-runner'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const { id } = await params
  const job = await prisma.aiGenerationJob.findUnique({ where: { id } })
  if (!job) return Response.json({ success: false, error: 'Không tìm thấy job' }, { status: 404 })
  if (job.status === 'RUNNING') return Response.json({ success: false, error: 'Job đang chạy' }, { status: 409 })
  await prisma.aiGeneratedPostItem.updateMany({ where: { jobId: id, status: 'FAILED' }, data: { status: 'PENDING', errorMessage: null } })
  after(() => runAiNewsJob(id))
  return Response.json({ success: true, data: { jobId: id, status: 'PENDING' } }, { status: 202 })
}
