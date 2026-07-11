import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { postSchema } from '@/lib/validators/post'
import { generateUniqueSlug } from '@/lib/slug'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const q = searchParams.get('q') || ''
    const categoryId = searchParams.get('categoryId') || undefined
    const status = searchParams.get('status') || undefined
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      AND: [
        q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } }
          ]
        } : {},
        categoryId ? { categoryId } : {},
        status ? { status: status as any } : {},
      ]
    }

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { category: true, author: true, thumbnail: true },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return api.ok({
      items,
      total,
      page,
      limit,
      totalPages
    })
  } catch (error: any) {
    console.error('Posts List API Error:', error)
    return api.serverError('Lỗi lấy danh sách bài viết')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = postSchema.safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const slug = await generateUniqueSlug(parsed.data.slug || parsed.data.title, async (s) => {
      const existing = await prisma.post.findUnique({ where: { slug: s } })
      return !!existing
    })

    const publishedAt = parsed.data.status === 'PUBLISHED' 
      ? (parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date())
      : null

    const post = await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug,
        categoryId: parsed.data.categoryId || null,
        authorId: parsed.data.authorId || null,
        excerpt: parsed.data.excerpt || null,
        content: parsed.data.content || null,
        thumbnailId: parsed.data.thumbnailId || null,
        status: parsed.data.status,
        publishedAt,
        scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        ogImageId: parsed.data.ogImageId || null,
        canonicalUrl: parsed.data.canonicalUrl || null,
        ogTitle: parsed.data.ogTitle || null,
        ogDescription: parsed.data.ogDescription || null,
        robotsIndex: parsed.data.robotsIndex,
        robotsFollow: parsed.data.robotsFollow,
        isFeatured: parsed.data.isFeatured,
      },
      include: { category: true, thumbnail: true }
    })

    return api.created(post, 'Tạo bài viết thành công')
  } catch (error: any) {
    console.error('Posts Create API Error:', error)
    return api.serverError('Lỗi tạo bài viết')
  }
}
export const dynamic = 'force-dynamic'
