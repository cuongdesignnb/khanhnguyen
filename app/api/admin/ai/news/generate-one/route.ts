import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { generateNewsArticle } from '@/lib/ai/news-generator'
import { generatePostImage, insertHeadingImages } from '@/lib/ai/image-generator'

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const body = await request.json()
    const keyword = String(body.title || body.keyword || '').trim()
    if (!keyword || keyword.length > 200) return Response.json({ success: false, error: 'Tiêu đề hoặc từ khóa phải có 1-200 ký tự' }, { status: 400 })
    const wordCount = Math.min(3000, Math.max(500, Number(body.wordCount) || 1500))
    const article = await generateNewsArticle({ ...body, keyword, wordCount })
    let featuredImage
    if (body.generateFeaturedImage) featuredImage = await generatePostImage({ title: article.title, prompt: article.imagePrompts.featured, imageModel: body.imageModel })
    const headingImages = []
    if (body.generateHeadingImages) {
      for (const item of article.imagePrompts.headings.slice(0, Math.min(10, Math.max(0, Number(body.maxHeadingImages) || 3)))) {
        headingImages.push({ heading: item.heading, ...(await generatePostImage({ title: item.heading, prompt: item.prompt, imageModel: body.imageModel })) })
      }
    }
    return Response.json({ success: true, data: { ...article, contentHtml: insertHeadingImages(article.contentHtml, headingImages), featuredImage, headingImages } })
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Không thể sinh bài' }, { status: 400 })
  }
}
