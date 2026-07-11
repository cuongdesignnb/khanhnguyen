import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  slug: z.string().optional(),
  categoryId: z.string().uuid('Danh mục tin tức không hợp lệ').nullable().optional(),
  authorId: z.string().uuid('Tác giả không hợp lệ').nullable().optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  thumbnailId: z.string().uuid('Ảnh đại diện không hợp lệ').nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'HIDDEN']).default('DRAFT'),
  publishedAt: z.string().nullable().optional(), // ISO string or Date representation
  scheduledAt: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImageId: z.string().uuid('Ảnh SEO không hợp lệ').nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
})
