import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { generatePostImage } from '@/lib/ai/image-generator'

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const title = String(body.heading || body.title || '').trim()
    if (!title || title.length > 200) return Response.json({ success: false, error: 'Tiêu đề ảnh phải có 1-200 ký tự' }, { status: 400 })
    return Response.json({ success: true, data: await generatePostImage({ title, prompt: body.prompt, imageModel: body.imageModel }) })
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Không thể sinh ảnh' }, { status: 400 })
  }
}
