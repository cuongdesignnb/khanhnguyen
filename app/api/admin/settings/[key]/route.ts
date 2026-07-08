import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { settingSchema } from '@/lib/validators/setting'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const setting = await prisma.setting.findUnique({
      where: { key },
    })

    if (!setting) {
      return api.notFound('Không tìm thấy cấu hình')
    }

    return api.ok(setting)
  } catch (error: any) {
    console.error('Setting Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin cấu hình')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const existingSetting = await prisma.setting.findUnique({
      where: { key },
    })

    if (!existingSetting) {
      return api.notFound('Không tìm thấy cấu hình')
    }

    const body = await request.json()
    // Support updating partial setting fields
    const parsed = settingSchema.partial().safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    const updatedSetting = await prisma.setting.update({
      where: { key },
      data: {
        value: parsed.data.value !== undefined ? parsed.data.value : undefined,
        label: parsed.data.label !== undefined ? parsed.data.label : undefined,
        group: parsed.data.group !== undefined ? parsed.data.group : undefined,
        type: parsed.data.type !== undefined ? parsed.data.type : undefined,
      },
    })

    return api.ok(updatedSetting, 'Cập nhật cấu hình thành công')
  } catch (error: any) {
    console.error('Setting Update API Error:', error)
    return api.serverError('Lỗi cập nhật cấu hình')
  }
}
