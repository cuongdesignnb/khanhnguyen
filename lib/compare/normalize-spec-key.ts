const aliases: Record<string, string> = {
  'tai-trong': 'capacity', 'tai-trong-nang': 'capacity', 'kha-nang-nang': 'capacity',
  'chieu-cao-nang': 'lift-height', 'chieu-dai-cang': 'fork-length',
  liftheight: 'lift-height', forklength: 'fork-length', fueltype: 'fuel-type', manufactureyear: 'manufacture-year',
}
export function normalizeSpecKey(value: string) {
  const key = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return aliases[key] || key
}
export function normalizeCompareValue(value?: string | null) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}
