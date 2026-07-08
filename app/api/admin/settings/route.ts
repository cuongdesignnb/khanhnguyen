import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { bulkSettingsSchema } from '@/lib/validators/setting'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')

    let whereClause: any = {}
    if (group) {
      whereClause.group = group
    }

    const settings = await prisma.setting.findMany({
      where: whereClause,
      orderBy: [
        { group: 'asc' },
        { key: 'asc' },
      ],
    })

    return api.ok(settings)
  } catch (error: any) {
    console.error('Settings List API Error:', error)
    return api.serverError('Lỗi lấy danh sách cấu hình')
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = bulkSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    // Verify all keys exist before executing transaction to avoid partial failures
    const keys = parsed.data.map(item => item.key)
    const existingSettings = await prisma.setting.findMany({
      where: { key: { in: keys } },
    })

    if (existingSettings.length !== keys.length) {
      const existingKeys = existingSettings.map(s => s.key)
      const missingKeys = keys.filter(k => !existingKeys.includes(k))
      return api.badRequest(`Không tìm thấy các khóa cấu hình: ${missingKeys.join(', ')}`)
    }

    const updated = await prisma.$transaction(
      parsed.data.map((item) =>
        prisma.setting.update({
          where: { key: item.key },
          data: { value: item.value },
        })
      )
    )

    return api.ok(updated, 'Cập nhật cấu hình thành công')
  } catch (error: any) {
    console.error('Settings Bulk Update API Error:', error)
    return api.serverError('Lỗi cập nhật cấu hình')
  }
}

export const dynamic = 'force-dynamic'
