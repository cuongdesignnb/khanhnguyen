import prisma from '@/lib/prisma'
import { generateUniqueSlug } from '@/lib/slug'
import { generateNewsArticle } from './news-generator'
import { insertHeadingImages, tryGeneratePostImage } from './image-generator'
import { addRelatedPostLinks } from './internal-linking'

export async function runAiNewsJob(jobId: string) {
  const job = await prisma.aiGenerationJob.findUnique({
    where: { id: jobId },
    include: { items: { orderBy: { createdAt: 'asc' } }, postCategory: true },
  })
  if (!job || job.status === 'CANCELLED') return
  await prisma.aiGenerationJob.update({
    where: { id: jobId },
    data: { status: 'RUNNING', startedAt: job.startedAt || new Date(), errorMessage: null },
  })
  for (const [index, item] of job.items.entries()) {
    const current = await prisma.aiGenerationJob.findUnique({ where: { id: jobId }, select: { status: true } })
    if (current?.status === 'CANCELLED') return
    if (item.status === 'COMPLETED' || item.status === 'SKIPPED') continue
    await prisma.aiGeneratedPostItem.update({ where: { id: item.id }, data: { status: 'GENERATING', errorMessage: null } })
    try {
      const article = await generateNewsArticle({
        keyword: item.keyword,
        categoryName: job.postCategory?.name,
        tone: job.tone || undefined,
        language: job.language,
        wordCount: job.wordCount,
        textModel: job.textModel,
      })
      const warnings: string[] = []
      let featuredImage: Awaited<ReturnType<typeof tryGeneratePostImage>>['image']
      if (job.generateFeaturedImage) {
        const result = await tryGeneratePostImage({
          title: article.title,
          prompt: article.imagePrompts.featured,
          imageModel: job.imageModel,
        })
        featuredImage = result.image
        if (result.warning) warnings.push(result.warning)
      }
      const headingImages: Array<{ heading: string; url: string; alt: string }> = []
      if (job.generateHeadingImages) {
        for (const headingPrompt of article.imagePrompts.headings.slice(0, job.maxHeadingImages)) {
          const result = await tryGeneratePostImage({
            title: headingPrompt.heading,
            prompt: headingPrompt.prompt,
            imageModel: job.imageModel,
          })
          if (result.image) headingImages.push({ heading: headingPrompt.heading, ...result.image })
          if (result.warning) warnings.push(result.warning)
        }
      }
      const content = insertHeadingImages(await addRelatedPostLinks({
        contentHtml: article.contentHtml,
        categoryId: job.postCategoryId,
        focusKeywords: article.focusKeywords,
      }), headingImages)
      const slug = await generateUniqueSlug(article.slug || article.title, async (candidate) =>
        Boolean(await prisma.post.findUnique({ where: { slug: candidate }, select: { id: true } })),
      )
      const scheduledAt = job.publishMode === 'SCHEDULED' && job.scheduledStartAt
        ? new Date(job.scheduledStartAt.getTime() + index * (job.scheduleIntervalMin || 60) * 60_000)
        : null
      const status = job.publishMode === 'DRAFT' ? 'DRAFT' : job.publishMode === 'SCHEDULED' ? 'SCHEDULED' : 'PUBLISHED'
      const post = await prisma.post.create({
        data: {
          title: article.title,
          slug,
          excerpt: article.excerpt,
          content,
          categoryId: job.postCategoryId,
          authorId: job.createdById,
          status,
          publishedAt: status === 'PUBLISHED' ? new Date() : scheduledAt,
          scheduledAt,
          thumbnailId: featuredImage?.mediaId,
          ogImageId: featuredImage?.mediaId,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
        },
      })
      await prisma.aiGeneratedPostItem.update({
        where: { id: item.id },
        data: {
          status: 'COMPLETED',
          postId: post.id,
          title: article.title,
          slug,
          scheduledAt,
          rawAiResponse: { ...article, warnings: [...new Set(warnings)] },
        },
      })
      await prisma.aiGenerationJob.update({ where: { id: jobId }, data: { completedItems: { increment: 1 } } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định'
      await prisma.aiGeneratedPostItem.update({ where: { id: item.id }, data: { status: 'FAILED', errorMessage: message } })
      await prisma.aiGenerationJob.update({ where: { id: jobId }, data: { failedItems: { increment: 1 } } })
    }
  }
  const totals = await prisma.aiGenerationJob.findUnique({ where: { id: jobId }, select: { totalItems: true, failedItems: true } })
  await prisma.aiGenerationJob.update({
    where: { id: jobId },
    data: {
      status: totals?.failedItems === totals?.totalItems ? 'FAILED' : 'COMPLETED',
      finishedAt: new Date(),
      errorMessage: totals?.failedItems === totals?.totalItems ? 'Tất cả bài viết đều sinh lỗi' : null,
    },
  })
}
