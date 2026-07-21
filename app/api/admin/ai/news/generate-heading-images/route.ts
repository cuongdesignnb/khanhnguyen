import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { insertHeadingImages, tryGeneratePostImage } from '@/lib/ai/image-generator'

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const limit = Math.min(10, Math.max(0, Number(body.maxHeadingImages) || 3))
    const headings = Array.isArray(body.headings) ? body.headings.slice(0, limit) : []
    const images: Array<{ heading: string; url: string; alt: string }> = []
    const warnings: string[] = []
    for (const heading of headings) {
      const title = String(typeof heading === 'string' ? heading : heading.heading).slice(0, 200)
      const result = await tryGeneratePostImage({
        title,
        prompt: typeof heading === 'string' ? undefined : heading.prompt,
        imageModel: body.imageModel,
      })
      if (result.image) images.push({ heading: title, ...result.image })
      if (result.warning) warnings.push(result.warning)
    }
    return Response.json({
      success: true,
      data: {
        images,
        warnings: [...new Set(warnings)],
        contentHtml: insertHeadingImages(String(body.contentHtml || ''), images),
      },
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Khong the sinh anh heading',
    }, { status: 400 })
  }
}
