import prisma from '@/lib/prisma'
import { defaultFooterMenu, defaultHeaderMenu, defaultMobileMenu, type DefaultMenuItem } from '@/data/default-menus'

export type MenuTreeItem = {
  id: string; label: string; url: string; type: string; target: string; icon?: string | null
  badge?: string | null; isActive?: boolean; sortOrder: number; parentId?: string | null; children: MenuTreeItem[]
}

export function buildMenuTree(items: any[], activeOnly = true): MenuTreeItem[] {
  const eligible = activeOnly ? items.filter((item) => item.isActive) : items
  const map = new Map<string, MenuTreeItem>()
  for (const item of eligible) map.set(item.id, { ...item, children: [] })
  const roots: MenuTreeItem[] = []
  for (const item of map.values()) {
    if (item.parentId && map.has(item.parentId)) map.get(item.parentId)!.children.push(item)
    else roots.push(item)
  }
  const sort = (nodes: MenuTreeItem[]) => { nodes.sort((a, b) => a.sortOrder - b.sortOrder); nodes.forEach((node) => sort(node.children)) }
  sort(roots)
  return roots
}

function fallbackTree(items: DefaultMenuItem[], prefix = 'fallback'): MenuTreeItem[] {
  return items.map((item, index) => ({
    id: `${prefix}-${index}`, label: item.label, url: item.url, type: 'INTERNAL', target: '_self',
    sortOrder: index, children: fallbackTree(item.children || [], `${prefix}-${index}`),
  }))
}

export async function getMenuByLocation(location: 'HEADER' | 'FOOTER' | 'MOBILE') {
  const fallback = location === 'FOOTER' ? defaultFooterMenu : location === 'MOBILE' ? defaultMobileMenu : defaultHeaderMenu
  try {
    const menu = await prisma.menu.findFirst({ where: { location, isActive: true }, include: { items: true } })
    if (!menu?.items.length) return { id: '', name: `${location} Menu`, location, items: fallbackTree(fallback) }
    return { ...menu, items: buildMenuTree(menu.items) }
  } catch {
    return { id: '', name: `${location} Menu`, location, items: fallbackTree(fallback) }
  }
}

export const getHeaderMenu = () => getMenuByLocation('HEADER')
export const getFooterMenu = () => getMenuByLocation('FOOTER')
export async function getMobileMenu() {
  const mobile = await getMenuByLocation('MOBILE')
  return mobile.id ? mobile : getHeaderMenu()
}
