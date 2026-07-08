import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Tên người liên hệ không được để trống'),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  email: z.string().email('Email không hợp lệ').or(z.string().length(0)).nullable().optional(),
  company: z.string().nullable().optional(),
  need: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  status: z.enum(['NEW', 'CALLED', 'PROCESSING', 'QUOTED', 'CLOSED', 'IGNORED']).default('NEW'),
  internalNote: z.string().nullable().optional(),
  assignedToId: z.string().uuid('ID nhân viên không hợp lệ').nullable().optional(),
})
