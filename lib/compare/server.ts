import prisma from '@/lib/prisma'
import { getSettingsByGroup } from '@/lib/settings'
import { defaultSettings } from '@/data/default-settings'

export async function getCompareConfig() {
  const value = await getSettingsByGroup('products.config', defaultSettings.productsConfig)
  return { ...defaultSettings.productsConfig, ...value, compareMaxItems: Math.min(4, Math.max(2, Number(value.compareMaxItems || 4))) }
}
export async function getPublicCompareProducts(ids: string[]) {
  const dbProducts = await prisma.product.findMany({ where:{id:{in:ids},status:'PUBLISHED',deletedAt:null}, include:{category:true,brand:true,thumbnail:true,specs:{orderBy:{sortOrder:'asc'}}} })
  const map=new Map(dbProducts.map((p)=>[p.id,p]))
  return ids.map((id)=>map.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
}
export function uniqueIds(value: unknown) {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && id.trim().length > 0).map((id)=>id.trim()))] : []
}
