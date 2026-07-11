import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { categorySchema } from '@/lib/validators/category'
import { generateUniqueSlug } from '@/lib/slug'
import { recordSeoRedirect } from '@/lib/seo/redirects'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: {
        bannerImage: true,
        parent: true,
        children: {
          where: { deletedAt: null },
        },
      },
    })

    if (!category) {
      return api.notFound('Không tìm thấy danh mục')
    }

    return api.ok(category)
  } catch (error: any) {
    console.error('Category Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin danh mục')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingCategory = await prisma.category.findFirst({
      where: { id, deletedAt: null },
    })

    if (!existingCategory) {
      return api.notFound('Không tìm thấy danh mục')
    }

    const body = await request.json()

    // Sanitize empty strings to null for UUID fields
    if (body.parentId === '') body.parentId = null
    if (body.bannerImageId === '') body.bannerImageId = null

    // We use partial() to support patching only changed fields
    const parsed = categorySchema.partial().safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    if (parsed.data.parentId === id) {
      return api.badRequest('Danh mục cha không thể là chính nó')
    }

    if (parsed.data.parentId) {
      const parentExists = await prisma.category.findFirst({
        where: { id: parsed.data.parentId, deletedAt: null },
      })
      if (!parentExists) {
        return api.badRequest('Danh mục cha không tồn tại hoặc đã bị xóa')
      }
    }

    let slug = existingCategory.slug
    if (parsed.data.name && parsed.data.name !== existingCategory.name) {
      slug = await generateUniqueSlug(parsed.data.slug || parsed.data.name, async (s) => {
        const existing = await prisma.category.findFirst({
          where: { slug: s, id: { not: id } },
        })
        return !!existing
      })
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        parentId: parsed.data.parentId !== undefined ? parsed.data.parentId : undefined,
        subtitle: parsed.data.subtitle !== undefined ? parsed.data.subtitle : undefined,
        description: parsed.data.description !== undefined ? parsed.data.description : undefined,
        icon: parsed.data.icon !== undefined ? parsed.data.icon : undefined,
        bannerImageId: parsed.data.bannerImageId !== undefined ? parsed.data.bannerImageId : undefined,
        seoTitle: parsed.data.seoTitle !== undefined ? parsed.data.seoTitle : undefined,
        seoDescription: parsed.data.seoDescription !== undefined ? parsed.data.seoDescription : undefined,
        canonicalUrl: parsed.data.canonicalUrl !== undefined ? parsed.data.canonicalUrl : undefined,
        ogTitle: parsed.data.ogTitle !== undefined ? parsed.data.ogTitle : undefined,
        ogDescription: parsed.data.ogDescription !== undefined ? parsed.data.ogDescription : undefined,
        ogImageId: parsed.data.ogImageId !== undefined ? parsed.data.ogImageId : undefined,
        robotsIndex: parsed.data.robotsIndex,
        robotsFollow: parsed.data.robotsFollow,
        sortOrder: parsed.data.sortOrder !== undefined ? parsed.data.sortOrder : undefined,
        isVisible: parsed.data.isVisible !== undefined ? parsed.data.isVisible : undefined,
      },
      include: {
        bannerImage: true,
        parent: true,
      },
    })
    if (slug !== existingCategory.slug) await recordSeoRedirect(`/${existingCategory.slug}`, `/${slug}`)
    revalidatePath('/'); revalidatePath('/san-pham'); revalidatePath(`/${slug}`); revalidatePath('/sitemap.xml')

    return api.ok(updatedCategory, 'Cập nhật danh mục thành công')
  } catch (error: any) {
    console.error('Category Update API Error:', error)
    return api.serverError('Lỗi cập nhật danh mục')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findFirst({
      where: { id, deletedAt: null },
    })

    if (!category) {
      return api.notFound('Không tìm thấy danh mục')
    }

    // Prevent if products exist in this category
    const productsCount = await prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    })
    if (productsCount > 0) {
      return api.badRequest('Không thể xóa danh mục vì vẫn còn sản phẩm liên kết')
    }

    // Prevent if subcategories exist
    const subcategoriesCount = await prisma.category.count({
      where: { parentId: id, deletedAt: null },
    })
    if (subcategoriesCount > 0) {
      return api.badRequest('Không thể xóa danh mục vì vẫn còn danh mục con')
    }

    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return api.ok(null, 'Xóa danh mục thành công (soft delete)')
  } catch (error: any) {
    console.error('Category Delete API Error:', error)
    return api.serverError('Lỗi xóa danh mục')
  }
}
