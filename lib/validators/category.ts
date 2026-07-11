import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  slug: z.string().optional(),
  parentId: z.string().uuid('Danh mục cha không hợp lệ').nullable().optional(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  bannerImageId: z.string().uuid('Ảnh banner không hợp lệ').nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  ogImageId: z.string().uuid('Ảnh SEO không hợp lệ').nullable().optional(),
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
  isVisible: z.boolean().optional().default(true),
})
