import { z } from 'zod'

export const quoteRequestSchema = z.object({
  name: z.string().min(1, 'Tên người gửi không được để trống'),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  email: z.string().email('Email không hợp lệ').or(z.string().length(0)).nullable().optional(),
  company: z.string().nullable().optional(),
  productId: z.string().nullable().optional(),
  productName: z.string().nullable().optional(),
  quantity: z.number().int().positive('Số lượng phải lớn hơn 0').optional().default(1),
  budget: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  status: z.enum(['NEW', 'PROCESSING', 'QUOTED', 'CLOSED', 'IGNORED']).default('NEW'),
  internalNote: z.string().nullable().optional(),
  assignedToId: z.string().uuid('ID nhân viên không hợp lệ').nullable().optional(),
  items: z.array(
    z.object({
      productId: z.string().nullable().optional(),
      productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
      quantity: z.number().int().positive('Số lượng phải lớn hơn 0'),
    })
  ).optional(),
})

