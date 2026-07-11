import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string().min(1, 'Tên thương hiệu không được để trống'),
  slug: z.string().optional(),
  logoId: z.string().uuid('Logo không hợp lệ').nullable().optional(),
  description: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  ogImageId: z.string().uuid('Ảnh SEO không hợp lệ').nullable().optional(),
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  isVisible: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
})
