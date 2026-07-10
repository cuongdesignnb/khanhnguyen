import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { getDefaultSetting, settingGroupMap } from '@/data/default-settings'
import { upsertSetting } from '@/lib/settings'

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  if ((auth.session?.user as any)?.role !== 'ADMIN') return Response.json({ success: false, error: 'Chỉ ADMIN được khôi phục cài đặt' }, { status: 403 })
  const { group } = await request.json()
  if (!(group in settingGroupMap)) return Response.json({ success: false, error: 'Nhóm cài đặt không hợp lệ' }, { status: 400 })
  const value = getDefaultSetting(group)
  await upsertSetting(group, 'main', value, { label: group, isPublic: group !== 'integrations.tracking' })
  return Response.json({ success: true, data: value })
}
