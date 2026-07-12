export interface NormalizedProductSpec {
  key: string
  label: string
  value: string
  sortOrder: number
}

export interface ProductSpecBaseFields {
  model?: unknown
  capacity?: unknown
  liftHeight?: unknown
  fuelType?: unknown
  manufactureYear?: unknown
  condition?: unknown
  origin?: unknown
  forkLength?: unknown
  brand?: unknown
}

export const DEFAULT_PRODUCT_SPEC_PRIORITY = [
  'model',
  'capacity',
  'liftHeight',
  'fuelType',
  'manufactureYear',
  'condition',
  'origin',
  'forkLength',
] as const

const LABELS: Record<string, { key: string; label: string }> = {
  model: { key: 'model', label: 'Model' },
  thuonghieu: { key: 'brand', label: 'Thương hiệu' },
  brand: { key: 'brand', label: 'Thương hiệu' },
  capacity: { key: 'capacity', label: 'Tải trọng nâng' },
  loadcapacity: { key: 'capacity', label: 'Tải trọng nâng' },
  taitrong: { key: 'capacity', label: 'Tải trọng nâng' },
  taitrongnang: { key: 'capacity', label: 'Tải trọng nâng' },
  sucnang: { key: 'capacity', label: 'Tải trọng nâng' },
  liftheight: { key: 'liftHeight', label: 'Chiều cao nâng' },
  chieucaonang: { key: 'liftHeight', label: 'Chiều cao nâng' },
  nangcao: { key: 'liftHeight', label: 'Chiều cao nâng' },
  chieucao: { key: 'liftHeight', label: 'Chiều cao nâng' },
  fueltype: { key: 'fuelType', label: 'Nhiên liệu' },
  nhienlieu: { key: 'fuelType', label: 'Nhiên liệu' },
  nguonnangluong: { key: 'fuelType', label: 'Nhiên liệu' },
  manufactureyear: { key: 'manufactureYear', label: 'Năm sản xuất' },
  namsanxuat: { key: 'manufactureYear', label: 'Năm sản xuất' },
  namsx: { key: 'manufactureYear', label: 'Năm sản xuất' },
  condition: { key: 'condition', label: 'Tình trạng' },
  tinhtrang: { key: 'condition', label: 'Tình trạng' },
  origin: { key: 'origin', label: 'Xuất xứ' },
  xuatxu: { key: 'origin', label: 'Xuất xứ' },
  forklength: { key: 'forkLength', label: 'Chiều dài càng' },
  chieudaicang: { key: 'forkLength', label: 'Chiều dài càng' },
}

const INVALID_TEXT = new Set(['', 'undefined', 'null', '[object object]', 'nan'])

function slugKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
}

function meaningfulText(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (INVALID_TEXT.has(trimmed.toLowerCase())) return null

    if (/^[\[{]/.test(trimmed)) {
      try {
        return meaningfulText(JSON.parse(trimmed))
      } catch {
        return null
      }
    }
    return trimmed
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'boolean') return value ? 'Có' : 'Không'
  if (Array.isArray(value)) {
    const values = value.map(meaningfulText).filter((item): item is string => Boolean(item))
    return values.length ? values.join(', ') : null
  }
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>
    for (const key of ['value', 'text', 'content', 'name']) {
      const resolved = meaningfulText(object[key])
      if (resolved) return resolved
    }
  }
  return null
}

function normalizeLabel(label: unknown, fallbackKey = '') {
  const raw = typeof label === 'string' ? label.trim() : ''
  if (!raw || /^\d+$/.test(raw) || INVALID_TEXT.has(raw.toLowerCase())) {
    if (!fallbackKey) return null
  }
  const clean = raw && !/^\d+$/.test(raw) ? raw : fallbackKey
  const mapped = LABELS[slugKey(clean)]
  return mapped || { key: slugKey(clean) || `spec-${fallbackKey}`, label: clean }
}

function flattenSpecs(input: unknown): Array<Record<string, unknown>> {
  if (typeof input === 'string' && /^[\[{]/.test(input.trim())) {
    try {
      return flattenSpecs(JSON.parse(input))
    } catch {
      return []
    }
  }
  if (Array.isArray(input)) return input.flatMap(flattenSpecs)
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return [{ key: 'specification', label: 'Thông số', value: input }]
  }
  if (!input || typeof input !== 'object') return []

  const object = input as Record<string, unknown>
  if ('label' in object || 'value' in object || 'text' in object || 'content' in object) {
    if (object.value && typeof object.value === 'object' && !Array.isArray(object.value)) {
      const nested = object.value as Record<string, unknown>
      if ('label' in nested || 'value' in nested) return flattenSpecs(nested)
    }
    return [object]
  }

  return Object.entries(object).flatMap(([label, value], index) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = value as Record<string, unknown>
      if ('label' in nested || 'value' in nested) return flattenSpecs(nested)
    }
    return [{ label, value, sortOrder: index }]
  })
}

export function normalizeProductSpecs(
  input: unknown,
  baseFields: ProductSpecBaseFields = {},
): NormalizedProductSpec[] {
  const baseSpecs = Object.entries(baseFields).map(([key, value], index) => ({
    key,
    label: LABELS[slugKey(key)]?.label || key,
    value,
    sortOrder: -100 + index,
  }))
  const candidates: Array<Record<string, unknown>> = [...baseSpecs, ...flattenSpecs(input)]
  const seen = new Set<string>()
  const output: NormalizedProductSpec[] = []

  candidates.forEach((spec, index) => {
    const nestedLabel = spec.value && typeof spec.value === 'object'
      ? (spec.value as Record<string, unknown>).label
      : undefined
    const labelInfo = normalizeLabel(spec.label ?? nestedLabel ?? spec.key, String(spec.key || ''))
    const value = meaningfulText(spec.value ?? spec.text ?? spec.content ?? spec.name)
    if (!labelInfo || !value || seen.has(labelInfo.key)) return
    seen.add(labelInfo.key)
    output.push({
      key: labelInfo.key,
      label: labelInfo.label,
      value,
      sortOrder: typeof spec.sortOrder === 'number' ? spec.sortOrder : index,
    })
  })

  return output
}

export function selectProductSpecs(
  specs: NormalizedProductSpec[],
  limit: number,
  priority: readonly string[] = DEFAULT_PRODUCT_SPEC_PRIORITY,
) {
  if (limit <= 0) return []
  const priorityMap = new Map(priority.map((key, index) => [key, index]))
  return [...specs]
    .sort((a, b) => {
      const aPriority = priorityMap.get(a.key) ?? priority.length
      const bPriority = priorityMap.get(b.key) ?? priority.length
      return aPriority - bPriority || a.sortOrder - b.sortOrder
    })
    .slice(0, limit)
}
