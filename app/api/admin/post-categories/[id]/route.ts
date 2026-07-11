import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { z } from 'zod'
import { generateUniqueSlug } from '@/lib/slug'
import { recordSeoRedirect } from '@/lib/seo/redirects'
import { revalidatePath } from 'next/cache'

const postCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục tin tức không được để trống'),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(), ogTitle: z.string().nullable().optional(), ogDescription: z.string().nullable().optional(),
  ogImageId: z.string().uuid('Ảnh SEO không hợp lệ').nullable().optional(), robotsIndex: z.boolean().optional().default(true), robotsFollow: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
  isVisible: z.boolean().optional().default(true),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postCategory = await prisma.postCategory.findFirst({
      where: { id, deletedAt: null },
      include: {
        posts: {
          where: { deletedAt: null },
        },
      },
    })

    if (!postCategory) {
      return api.notFound('Không tìm thấy danh mục tin tức')
    }

    return api.ok(postCategory)
  } catch (error: any) {
    console.error('PostCategory Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin danh mục tin tức')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingCategory = await prisma.postCategory.findFirst({
      where: { id, deletedAt: null },
    })

    if (!existingCategory) {
      return api.notFound('Không tìm thấy danh mục tin tức')
    }

    const body = await request.json()
    const parsed = postCategorySchema.partial().safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    let slug = existingCategory.slug
    if (parsed.data.name && parsed.data.name !== existingCategory.name) {
      slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
        const existing = await prisma.postCategory.findFirst({
          where: { slug: s, id: { not: id } },
        })
        return !!existing
      })
    }

    const updatedCategory = await prisma.postCategory.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description !== undefined ? parsed.data.description : undefined,
        seoTitle: parsed.data.seoTitle !== undefined ? parsed.data.seoTitle : undefined,
        seoDescription: parsed.data.seoDescription !== undefined ? parsed.data.seoDescription : undefined,
        canonicalUrl: parsed.data.canonicalUrl !== undefined ? parsed.data.canonicalUrl : undefined,
        ogTitle: parsed.data.ogTitle !== undefined ? parsed.data.ogTitle : undefined,
        ogDescription: parsed.data.ogDescription !== undefined ? parsed.data.ogDescription : undefined,
        ogImageId: parsed.data.ogImageId !== undefined ? parsed.data.ogImageId : undefined,
        robotsIndex: parsed.data.robotsIndex, robotsFollow: parsed.data.robotsFollow,
        sortOrder: parsed.data.sortOrder !== undefined ? parsed.data.sortOrder : undefined,
        isVisible: parsed.data.isVisible !== undefined ? parsed.data.isVisible : undefined,
      },
    })
    if (slug !== existingCategory.slug) await recordSeoRedirect(`/tin-tuc/danh-muc/${existingCategory.slug}`, `/tin-tuc/danh-muc/${slug}`)
    revalidatePath('/tin-tuc'); revalidatePath(`/tin-tuc/danh-muc/${slug}`); revalidatePath('/sitemap.xml')

    return api.ok(updatedCategory, 'Cập nhật danh mục tin tức thành công')
  } catch (error: any) {
    console.error('PostCategory Update API Error:', error)
    return api.serverError('Lỗi cập nhật danh mục tin tức')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postCategory = await prisma.postCategory.findFirst({
      where: { id, deletedAt: null },
    })

    if (!postCategory) {
      return api.notFound('Không tìm thấy danh mục tin tức')
    }

    // Prevent if active posts exist in this category
    const postsCount = await prisma.post.count({
      where: { categoryId: id, deletedAt: null },
    })
    if (postsCount > 0) {
      return api.badRequest('Không thể xóa danh mục tin tức vì vẫn còn bài viết liên kết')
    }

    await prisma.postCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return api.ok(null, 'Xóa danh mục tin tức thành công (soft delete)')
  } catch (error: any) {
    console.error('PostCategory Delete API Error:', error)
    return api.serverError('Lỗi xóa danh mục tin tức')
  }
}
