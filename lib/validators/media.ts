import { z } from 'zod'

export const mediaSchema = z.object({
  alt: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  folderId: z.string().uuid('Thư mục không hợp lệ').nullable().optional(),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER']).optional(),
})
