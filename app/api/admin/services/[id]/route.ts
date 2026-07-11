import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { serviceSchema } from '@/lib/validators/service'
import { generateUniqueSlug } from '@/lib/slug'
import { recordSeoRedirect } from '@/lib/seo/redirects'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findFirst({
      where: { id, deletedAt: null },
      include: {
        image: true,
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!service) {
      return api.notFound('Không tìm thấy dịch vụ')
    }

    return api.ok(service)
  } catch (error: any) {
    console.error('Service Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin dịch vụ')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingService = await prisma.service.findFirst({
      where: { id, deletedAt: null },
    })

    if (!existingService) {
      return api.notFound('Không tìm thấy dịch vụ')
    }

    const body = await request.json()

    // Sanitize empty strings to null for UUID fields
    if (body.imageId === '') body.imageId = null

    const parsed = serviceSchema.partial().safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    let slug = existingService.slug
    if (parsed.data.title && parsed.data.title !== existingService.title) {
      slug = await generateUniqueSlug(parsed.data.slug || parsed.data.title, async (s) => {
        const existing = await prisma.service.findFirst({
          where: { slug: s, id: { not: id } },
        })
        return !!existing
      })
    }

    const updatedService = await prisma.$transaction(async (tx) => {
      // If faqs array is passed in the body, delete all existing and recreate
      if (body.faqs !== undefined) {
        await tx.serviceFAQ.deleteMany({
          where: { serviceId: id },
        })
      }

      const srv = await tx.service.update({
        where: { id },
        data: {
          title: parsed.data.title,
          slug,
          subtitle: parsed.data.subtitle !== undefined ? parsed.data.subtitle : undefined,
          description: parsed.data.description !== undefined ? parsed.data.description : undefined,
          content: parsed.data.content !== undefined ? parsed.data.content : undefined,
          imageId: parsed.data.imageId !== undefined ? parsed.data.imageId : undefined,
          benefits: parsed.data.benefits !== undefined ? (parsed.data.benefits || []) : undefined,
          process: parsed.data.process !== undefined ? (parsed.data.process || []) : undefined,
          ctaTitle: parsed.data.ctaTitle !== undefined ? parsed.data.ctaTitle : undefined,
          ctaDescription: parsed.data.ctaDescription !== undefined ? parsed.data.ctaDescription : undefined,
          ctaButtonText: parsed.data.ctaButtonText !== undefined ? parsed.data.ctaButtonText : undefined,
          ctaButtonHref: parsed.data.ctaButtonHref !== undefined ? parsed.data.ctaButtonHref : undefined,
          status: parsed.data.status,
          seoTitle: parsed.data.seoTitle !== undefined ? parsed.data.seoTitle : undefined,
          seoDescription: parsed.data.seoDescription !== undefined ? parsed.data.seoDescription : undefined,
          canonicalUrl: parsed.data.canonicalUrl !== undefined ? parsed.data.canonicalUrl : undefined,
          ogTitle: parsed.data.ogTitle !== undefined ? parsed.data.ogTitle : undefined,
          ogDescription: parsed.data.ogDescription !== undefined ? parsed.data.ogDescription : undefined,
          ogImageId: parsed.data.ogImageId !== undefined ? parsed.data.ogImageId : undefined,
          robotsIndex: parsed.data.robotsIndex,
          robotsFollow: parsed.data.robotsFollow,
          sortOrder: parsed.data.sortOrder !== undefined ? parsed.data.sortOrder : undefined,
          ...(parsed.data.faqs !== undefined && parsed.data.faqs.length > 0
            ? {
                faqs: {
                  create: parsed.data.faqs.map(faq => ({
                    question: faq.question,
                    answer: faq.answer,
                    sortOrder: faq.sortOrder,
                  })),
                },
              }
            : {}),
        },
      })
      return srv
    })

    const finalService = await prisma.service.findUnique({
      where: { id: updatedService.id },
      include: {
        image: true,
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
    if (slug !== existingService.slug) await recordSeoRedirect(`/dich-vu/${existingService.slug}`, `/dich-vu/${slug}`)
    revalidatePath('/'); revalidatePath('/dich-vu'); revalidatePath(`/dich-vu/${slug}`); revalidatePath('/sitemap.xml')

    return api.ok(finalService, 'Cập nhật dịch vụ thành công')
  } catch (error: any) {
    console.error('Service Update API Error:', error)
    return api.serverError('Lỗi cập nhật dịch vụ')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findFirst({
      where: { id, deletedAt: null },
    })

    if (!service) {
      return api.notFound('Không tìm thấy dịch vụ')
    }

    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return api.ok(null, 'Xóa dịch vụ thành công (soft delete)')
  } catch (error: any) {
    console.error('Service Delete API Error:', error)
    return api.serverError('Lỗi xóa dịch vụ')
  }
}
