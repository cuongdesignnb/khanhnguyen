import { z } from 'zod'

const bannerHref = z.string().trim().max(500).refine((value) => !value || (value.startsWith('/') && value !== '#') || /^https:\/\//i.test(value), 'URL phải là đường dẫn nội bộ hoặc HTTPS hợp lệ')

export const bannerSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề banner là bắt buộc').max(180),
  subtitle: z.string().trim().max(240).nullable().optional(),
  imageId: z.string().trim().min(1, 'Vui lòng chọn ảnh banner'),
  href: bannerHref.nullable().optional(),
  buttonText: z.string().trim().max(80).nullable().optional(),
  position: z.enum(['HOME_HERO', 'HOME_PROMO', 'CATEGORY', 'POPUP', 'FOOTER']),
  isVisible: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
})

export type BannerInput = z.infer<typeof bannerSchema>
