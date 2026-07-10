import prisma from '@/lib/prisma'
import { getDefaultSetting, settingGroupMap } from '@/data/default-settings'

export async function GET() {
  try {
    const rows = await prisma.setting.findMany({ where: { key: 'main', isPublic: true } })
    const stored = new Map(rows.map((row) => [row.group, row.value]))
    const safeGroups = Object.keys(settingGroupMap).filter((group) => group !== 'integrations.tracking')
    return Response.json({ success: true, data: Object.fromEntries(safeGroups.map((group) => [group, stored.get(group) ?? getDefaultSetting(group)])) })
  } catch {
    return Response.json({ success: true, data: Object.fromEntries(Object.keys(settingGroupMap).filter((group) => group !== 'integrations.tracking').map((group) => [group, getDefaultSetting(group)])) })
  }
}

export const dynamic = 'force-dynamic'
