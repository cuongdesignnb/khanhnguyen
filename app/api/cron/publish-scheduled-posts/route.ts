import { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
  if (!secret || supplied.length !== secret.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(secret))) {
    return Response.json({ success: false, error: 'Không có quyền truy cập' }, { status: 401 })
  }
  const result = await prisma.post.updateMany({
    where: { status: 'SCHEDULED', publishedAt: { lte: new Date() }, deletedAt: null },
    data: { status: 'PUBLISHED', scheduledAt: null },
  })
  return Response.json({ success: true, data: { published: result.count } })
}
