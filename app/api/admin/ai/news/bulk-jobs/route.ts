import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

function parseKeywords(inputRaw: string, supplied?: unknown) {
  const values = Array.isArray(supplied) ? supplied : inputRaw.split(/[\n,;]+/)
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))]
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const jobs = await prisma.aiGenerationJob.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { postCategory: true } })
  return Response.json({ success: true, data: jobs })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const body = await request.json()
  const setting = await prisma.aiSetting.findFirst({ orderBy: { updatedAt: 'desc' } })
  const inputRaw = String(body.inputRaw || '')
  const keywords = parseKeywords(inputRaw, body.keywords)
  const max = setting?.maxBulkItems || 10
  if (!keywords.length) return Response.json({ success: false, error: 'Vui lòng nhập ít nhất một từ khóa' }, { status: 400 })
  if (keywords.length > max) return Response.json({ success: false, error: `Tối đa ${max} từ khóa mỗi lần` }, { status: 400 })
  if (keywords.some((keyword) => keyword.length > 200)) return Response.json({ success: false, error: 'Mỗi từ khóa không được quá 200 ký tự' }, { status: 400 })
  const publishMode = ['DRAFT', 'PUBLISH_NOW', 'SCHEDULED'].includes(body.publishMode) ? body.publishMode : 'DRAFT'
  if (publishMode === 'SCHEDULED' && !body.scheduledStartAt) return Response.json({ success: false, error: 'Vui lòng chọn ngày giờ bắt đầu đăng' }, { status: 400 })
  const job = await prisma.aiGenerationJob.create({
    data: {
      code: `AI-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      publishMode,
      postCategoryId: body.postCategoryId || null,
      scheduledStartAt: body.scheduledStartAt ? new Date(body.scheduledStartAt) : null,
      scheduleIntervalMin: Math.max(1, Number(body.scheduleIntervalMin) || 60),
      totalItems: keywords.length,
      textModel: String(body.textModel || setting?.textModel || 'gpt-5.4-mini'),
      imageModel: String(body.imageModel || setting?.imageModel || 'chatgpt-image-2'),
      generateFeaturedImage: body.generateFeaturedImage !== false,
      generateHeadingImages: body.generateHeadingImages !== false,
      maxHeadingImages: Math.min(setting?.maxHeadingImages || 3, Math.max(0, Number(body.maxHeadingImages) || 3)),
      tone: String(body.tone || setting?.defaultTone || ''),
      language: String(body.language || setting?.defaultLanguage || 'vi'),
      wordCount: Math.min(3000, Math.max(500, Number(body.wordCount) || setting?.defaultWordCount || 1500)),
      inputRaw,
      createdById: auth.session?.user.id,
      items: { create: keywords.map((keyword) => ({ keyword })) },
    },
  })
  return Response.json({ success: true, data: { jobId: job.id, totalItems: job.totalItems } }, { status: 201 })
}
