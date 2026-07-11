import { z } from 'zod'

export const productSpecSchema = z.object({
  label: z.string().min(1, 'Nhãn thông số không được để trống'),
  value: z.string().min(1, 'Giá trị thông số không được để trống'),
  sortOrder: z.number().int().optional().default(0),
})

export const productImageSchema = z.object({
  mediaId: z.string().uuid('Media ID không hợp lệ'),
  sortOrder: z.number().int().optional().default(0),
  isPrimary: z.boolean().optional().default(false),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  slug: z.string().optional(),
  categoryId: z.string().uuid('Danh mục không hợp lệ'),
  brandId: z.string().uuid('Thương hiệu không hợp lệ').nullable().optional(),
  thumbnailId: z.string().uuid('Ảnh đại diện không hợp lệ').nullable().optional(),
  sku: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  advantages: z.array(z.string()).nullable().optional(),
  warrantyPolicy: z.string().nullable().optional(),
  price: z.number().nonnegative('Giá không được âm').nullable().optional(),
  priceLabel: z.string().default('Liên hệ'),
  badge: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD', 'HIDDEN']).default('PUBLISHED'),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'CONTACT', 'SOLD']).default('IN_STOCK'),
  isFeatured: z.boolean().optional().default(false),
  showOnHome: z.boolean().optional().default(true),
  isBestSeller: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  capacity: z.string().nullable().optional(),
  liftHeight: z.string().nullable().optional(),
  fuelType: z.string().nullable().optional(),
  manufactureYear: z.number().int().nullable().optional(),
  forkLength: z.string().nullable().optional(),
  condition: z.string().nullable().optional(),
  origin: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  ogImageId: z.string().uuid('Ảnh SEO không hợp lệ').nullable().optional(),
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  specs: z.array(productSpecSchema).optional().default([]),
  images: z.array(productImageSchema).optional().default([]),
})
