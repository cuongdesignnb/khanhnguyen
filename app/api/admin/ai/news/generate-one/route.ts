import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { OpenAiRequestError } from '@/lib/ai/openai-client'
import { generateNewsArticle } from '@/lib/ai/news-generator'
import { insertHeadingImages, tryGeneratePostImage } from '@/lib/ai/image-generator'

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const keyword = String(body.title || body.keyword || '').trim()
    if (!keyword || keyword.length > 200) {
      return Response.json({ success: false, error: 'Tieu de hoac tu khoa phai co 1-200 ky tu' }, { status: 400 })
    }
    const wordCount = Math.min(3000, Math.max(500, Number(body.wordCount) || 1500))
    const article = await generateNewsArticle({ ...body, keyword, wordCount })
    const warnings: string[] = []
    let featuredImage: Awaited<ReturnType<typeof tryGeneratePostImage>>['image']

    if (body.generateFeaturedImage) {
      const result = await tryGeneratePostImage({
        title: article.title,
        prompt: article.imagePrompts.featured,
        imageModel: body.imageModel,
      })
      featuredImage = result.image
      if (result.warning) warnings.push(result.warning)
    }

    const headingImages: Array<{ heading: string; url: string; alt: string }> = []
    if (body.generateHeadingImages) {
      const limit = Math.min(10, Math.max(0, Number(body.maxHeadingImages) || 3))
      for (const item of article.imagePrompts.headings.slice(0, limit)) {
        const result = await tryGeneratePostImage({
          title: item.heading,
          prompt: item.prompt,
          imageModel: body.imageModel,
        })
        if (result.image) headingImages.push({ heading: item.heading, ...result.image })
        if (result.warning) warnings.push(result.warning)
      }
    }

    return Response.json({
      success: true,
      data: {
        ...article,
        contentHtml: insertHeadingImages(article.contentHtml, headingImages),
        featuredImage: featuredImage || null,
        headingImages,
        warnings: [...new Set(warnings)],
      },
    })
  } catch (error) {
    const status = error instanceof OpenAiRequestError ? 424 : 400
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Khong the sinh bai',
    }, { status })
  }
}
