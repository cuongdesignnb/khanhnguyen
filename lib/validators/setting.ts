import { z } from 'zod'

export const settingSchema = z.object({
  key: z.string().min(1, 'Key không được để trống'),
  value: z.string().nullable().optional(),
  type: z.string().min(1, 'Type không được để trống'),
  label: z.string().optional(),
  group: z.string().nullable().optional(),
})

export const bulkSettingsSchema = z.array(
  z.object({
    key: z.string().min(1),
    value: z.string().nullable().optional(),
  })
)
