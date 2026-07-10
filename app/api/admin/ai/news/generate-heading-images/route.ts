import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { generatePostImage, insertHeadingImages } from '@/lib/ai/image-generator'

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const headings = Array.isArray(body.headings) ? body.headings.slice(0, Math.min(10, Number(body.maxHeadingImages) || 3)) : []
    const images = []
    for (const heading of headings) {
      const title = String(typeof heading === 'string' ? heading : heading.heading).slice(0, 200)
      images.push({ heading: title, ...(await generatePostImage({ title, prompt: heading.prompt, imageModel: body.imageModel })) })
    }
    return Response.json({ success: true, data: { images, contentHtml: insertHeadingImages(String(body.contentHtml || ''), images) } })
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Không thể sinh ảnh heading' }, { status: 400 })
  }
}
