import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { serviceSchema } from '@/lib/validators/service'
import { generateUniqueSlug } from '@/lib/slug'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let whereClause: any = { deletedAt: null }
    if (status) {
      whereClause.status = status
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        image: true,
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return api.ok(services)
  } catch (error: any) {
    console.error('Services List API Error:', error)
    return api.serverError('Lỗi lấy danh sách dịch vụ')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sanitize empty strings to null for UUID fields
    if (body.imageId === '') body.imageId = null

    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const slug = await generateUniqueSlug(parsed.data.slug || parsed.data.title, async (s) => {
      const existing = await prisma.service.findUnique({ where: { slug: s } })
      return !!existing
    })

    const service = await prisma.service.create({
      data: {
        title: parsed.data.title,
        slug,
        subtitle: parsed.data.subtitle || null,
        description: parsed.data.description || null,
        content: parsed.data.content || null,
        imageId: parsed.data.imageId || null,
        benefits: parsed.data.benefits || [],
        process: parsed.data.process || [],
        ctaTitle: parsed.data.ctaTitle || null,
        ctaDescription: parsed.data.ctaDescription || null,
        ctaButtonText: parsed.data.ctaButtonText || null,
        ctaButtonHref: parsed.data.ctaButtonHref || null,
        status: parsed.data.status,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        canonicalUrl: parsed.data.canonicalUrl || null,
        ogTitle: parsed.data.ogTitle || null,
        ogDescription: parsed.data.ogDescription || null,
        ogImageId: parsed.data.ogImageId || null,
        robotsIndex: parsed.data.robotsIndex,
        robotsFollow: parsed.data.robotsFollow,
        sortOrder: parsed.data.sortOrder,
        faqs: {
          create: parsed.data.faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer,
            sortOrder: faq.sortOrder,
          })),
        },
      },
      include: {
        image: true,
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return api.created(service, 'Tạo dịch vụ thành công')
  } catch (error: any) {
    console.error('Service Create API Error:', error)
    return api.serverError('Lỗi tạo dịch vụ')
  }
}

export const dynamic = 'force-dynamic'
