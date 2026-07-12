import { normalizeCompareValue, normalizeSpecKey } from './normalize-spec-key'
import type { CompareGroup, CompareProduct, CompareResponse, CompareRow } from './types'
import { normalizeProductSpecs } from '@/lib/products/normalize-product-specs'

type InputProduct = any
const fields = [
  ['general','Thông tin chung','name','Tên sản phẩm'], ['general','Thông tin chung','model','Model'],
  ['general','Thông tin chung','sku','SKU'], ['general','Thông tin chung','category','Danh mục'],
  ['general','Thông tin chung','brand','Thương hiệu'], ['general','Thông tin chung','origin','Xuất xứ'],
  ['general','Thông tin chung','manufacture-year','Năm sản xuất'], ['general','Thông tin chung','condition','Tình trạng'],
  ['price','Giá và tình trạng','price','Giá bán'], ['price','Giá và tình trạng','stock-status','Trạng thái hàng'],
  ['price','Giá và tình trạng','badge','Badge'], ['lifting','Khả năng nâng','capacity','Tải trọng nâng'],
  ['lifting','Khả năng nâng','lift-height','Chiều cao nâng'], ['lifting','Khả năng nâng','fork-length','Chiều dài càng'],
  ['energy','Động cơ và năng lượng','fuel-type','Nhiên liệu'],
  ['service','Bảo hành và dịch vụ','warranty-policy','Chính sách bảo hành'],
] as const
const groupOrder: Record<string, number> = { general: 0, price: 1, lifting: 2, energy: 3, dimensions: 4, battery: 5, chassis: 6, service: 7, other: 8 }
const valueFor = (p: InputProduct, key: string): string | null => {
  const v: any = ({ name:p.name, model:p.model, sku:p.sku, category:p.category?.name, brand:p.brand?.name,
    origin:p.origin, 'manufacture-year':p.manufactureYear, condition:p.condition,
    price:p.price && Number(p.price) > 0 ? (p.priceLabel || String(p.price)) : null,
    'stock-status':p.stockStatus, badge:p.badge, capacity:p.capacity, 'lift-height':p.liftHeight,
    'fork-length':p.forkLength, 'fuel-type':p.fuelType, 'warranty-policy':p.warrantyPolicy } as any)[key]
  return v === undefined || v === null || v === '' ? null : String(v)
}
export function buildComparisonMatrix(products: InputProduct[], missingProductIds: string[] = []): CompareResponse {
  const outputProducts: CompareProduct[] = products.map((p) => ({ id:p.id, slug:p.slug, name:p.name,
    thumbnail:p.thumbnail?.url || '/images/product-placeholder.svg', price:p.price && Number(p.price)>0 ? String(p.price):null,
    priceLabel:p.price && Number(p.price)>0 ? (p.priceLabel || String(p.price)) : 'Liên hệ', model:p.model, sku:p.sku,
    categoryName:p.category.name, categorySlug:p.category.slug, brandName:p.brand?.name || null,
    stockStatus:p.stockStatus, badge:p.badge }))
  const groups = new Map<string, { label:string; rows:Map<string, CompareRow> }>()
  const add = (groupKey:string, groupLabel:string, key:string, label:string, unit:string|null, values:Record<string,string|null>) => {
    if (Object.values(values).every((v) => !v)) return
    const normalized = Object.values(values).map(normalizeCompareValue)
    const nonEmpty = new Set(normalized.filter(Boolean)); const hasMissing = normalized.some((v)=>!v)
    const row = { key, label, unit, values, isDifferent: nonEmpty.size > 1 || (hasMissing && nonEmpty.size > 0) }
    if (!groups.has(groupKey)) groups.set(groupKey,{label:groupLabel,rows:new Map()})
    groups.get(groupKey)!.rows.set(key,row)
  }
  for (const [g,gl,k,l] of fields) add(g,gl,k,l,null,Object.fromEntries(products.map((p)=>[p.id,valueFor(p,String(k))])))
  const baseKeys = new Set<string>(fields.map((f)=>f[2]))
  const dynamic = new Map<string,{label:string;group:string;unit:string|null;values:Record<string,string|null>;sort:number}>()
  products.forEach((p) => normalizeProductSpecs(p.specs).forEach((s) => {
    const key=normalizeSpecKey(s.key||s.label); if(baseKeys.has(key)) return
    const item=dynamic.get(key)||{label:s.label,group:'Thông số khác',unit:null,values:{} as Record<string,string|null>,sort:s.sortOrder||0}
    item.values[p.id]=s.value; dynamic.set(key,item)
  }))
  for(const [key,s] of dynamic) add(normalizeSpecKey(s.group),s.group,key,s.label,s.unit,Object.fromEntries(products.map((p)=>[p.id,s.values[p.id]||null])))
  const result: CompareGroup[]=[...groups].map(([key,g])=>({key,label:g.label,sortOrder:groupOrder[key]??8,rows:[...g.rows.values()]})).sort((a,b)=>a.sortOrder-b.sortOrder)
  return { products:outputProducts, groups:result, missingProductIds }
}
