import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { postSchema } from '@/lib/validators/post'
import { generateUniqueSlug } from '@/lib/slug'
import { recordSeoRedirect } from '@/lib/seo/redirects'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
      include: { category: true, author: true, thumbnail: true }
    })

    if (!post) {
      return api.notFound('Không tìm thấy bài viết')
    }

    return api.ok(post)
  } catch (error: any) {
    console.error('Post Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin bài viết')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.post.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existing) {
      return api.notFound('Không tìm thấy bài viết')
    }

    const body = await request.json()
    const parsed = postSchema.partial().safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    let slug = existing.slug
    if (parsed.data.title && parsed.data.title !== existing.title) {
      slug = await generateUniqueSlug(parsed.data.slug || parsed.data.title, async (s) => {
        const check = await prisma.post.findFirst({
          where: { slug: s, id: { not: id } }
        })
        return !!check
      })
    }

    let publishedAt = existing.publishedAt
    if (parsed.data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
      publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date()
    } else if (parsed.data.status === 'DRAFT' || parsed.data.status === 'HIDDEN') {
      publishedAt = null
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug,
        categoryId: parsed.data.categoryId !== undefined ? parsed.data.categoryId : undefined,
        authorId: parsed.data.authorId !== undefined ? parsed.data.authorId : undefined,
        excerpt: parsed.data.excerpt !== undefined ? parsed.data.excerpt : undefined,
        content: parsed.data.content !== undefined ? parsed.data.content : undefined,
        thumbnailId: parsed.data.thumbnailId !== undefined ? parsed.data.thumbnailId : undefined,
        status: parsed.data.status,
        publishedAt,
        scheduledAt: parsed.data.scheduledAt !== undefined ? (parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null) : undefined,
        seoTitle: parsed.data.seoTitle !== undefined ? parsed.data.seoTitle : undefined,
        seoDescription: parsed.data.seoDescription !== undefined ? parsed.data.seoDescription : undefined,
        ogImageId: parsed.data.ogImageId !== undefined ? parsed.data.ogImageId : undefined,
        canonicalUrl: parsed.data.canonicalUrl !== undefined ? parsed.data.canonicalUrl : undefined,
        ogTitle: parsed.data.ogTitle !== undefined ? parsed.data.ogTitle : undefined,
        ogDescription: parsed.data.ogDescription !== undefined ? parsed.data.ogDescription : undefined,
        robotsIndex: parsed.data.robotsIndex,
        robotsFollow: parsed.data.robotsFollow,
        isFeatured: parsed.data.isFeatured,
      },
      include: { category: true, thumbnail: true }
    })
    if (slug !== existing.slug) await recordSeoRedirect(`/tin-tuc/${existing.slug}`, `/tin-tuc/${slug}`)
    revalidatePath('/'); revalidatePath('/tin-tuc'); revalidatePath(`/tin-tuc/${slug}`); revalidatePath('/sitemap.xml')

    return api.ok(updated, 'Cập nhật bài viết thành công')
  } catch (error: any) {
    console.error('Post Update API Error:', error)
    return api.serverError('Lỗi cập nhật bài viết')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null }
    })

    if (!post) {
      return api.notFound('Không tìm thấy bài viết')
    }

    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return api.ok(null, 'Xóa bài viết thành công')
  } catch (error: any) {
    console.error('Post Delete API Error:', error)
    return api.serverError('Lỗi xóa bài viết')
  }
}
export const dynamic = 'force-dynamic'
