import prisma from '@/lib/prisma'
import { buildMenuTree } from '@/lib/menu'
export async function GET() {
  const menus = await prisma.menu.findMany({ where: { isActive: true }, include: { items: { where: { isActive: true } } } })
  return Response.json({ success: true, data: menus.map((menu) => ({ ...menu, items: buildMenuTree(menu.items) })) })
}
export const dynamic = 'force-dynamic'
