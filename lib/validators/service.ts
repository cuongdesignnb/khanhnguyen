import { z } from 'zod'

export const serviceFaqSchema = z.object({
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  answer: z.string().min(1, 'Câu trả lời không được để trống'),
  sortOrder: z.number().int().optional().default(0),
})

export const serviceSchema = z.object({
  title: z.string().min(1, 'Tên dịch vụ không được để trống'),
  slug: z.string().optional(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  imageId: z.string().uuid('Ảnh dịch vụ không hợp lệ').nullable().optional(),
  benefits: z.array(z.string()).nullable().optional(),
  process: z.array(z.string()).nullable().optional(),
  ctaTitle: z.string().nullable().optional(),
  ctaDescription: z.string().nullable().optional(),
  ctaButtonText: z.string().nullable().optional(),
  ctaButtonHref: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'HIDDEN']).default('PUBLISHED'),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  ogImageId: z.string().uuid('Ảnh SEO không hợp lệ').nullable().optional(),
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
  faqs: z.array(serviceFaqSchema).optional().default([]),
})
