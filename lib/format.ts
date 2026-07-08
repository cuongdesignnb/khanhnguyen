import { statusLabelMap, statusColorMap } from '@/types/admin'

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'Liên hệ'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'Liên hệ'
  if (num === 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(num) + 'đ'
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('vi-VN')
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return String(value)
  return date.toLocaleString('vi-VN')
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return ''
  // Basic Vietnamese phone formatter (e.g., 0901 234 567)
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return value
}

export function formatFileSize(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0 B'
  const bytes = typeof value === 'string' ? parseInt(value, 10) : value
  if (isNaN(bytes) || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function getStatusLabel(status: string | null | undefined): string {
  if (!status) return ''
  const normalized = status.toLowerCase()
  return statusLabelMap[normalized] || status
}

export function getStatusColor(status: string | null | undefined): string {
  if (!status) return 'gray'
  const normalized = status.toLowerCase()
  return statusColorMap[normalized] || 'gray'
}
