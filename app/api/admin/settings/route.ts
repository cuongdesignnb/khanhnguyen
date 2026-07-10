import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { getDefaultSetting, settingGroupMap } from '@/data/default-settings'

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const rows = await prisma.setting.findMany({ where: { key: 'main' }, orderBy: { group: 'asc' } })
  const stored = new Map(rows.map((row) => [row.group, row.value]))
  const data = Object.fromEntries(Object.keys(settingGroupMap).map((group) => [group, stored.get(group) ?? getDefaultSetting(group)]))
  return Response.json({ success: true, data })
}

export const dynamic = 'force-dynamic'
