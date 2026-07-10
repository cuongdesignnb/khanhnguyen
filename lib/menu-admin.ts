import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'

export async function requireMenuAdmin(request: NextRequest, write = false) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth
  if (write && (auth.session?.user as any)?.role !== 'ADMIN') {
    return { ...auth, response: Response.json({ success: false, error: 'Chỉ ADMIN được sửa menu' }, { status: 403 }) }
  }
  return auth
}

export function validateMenuItem(body: any) {
  const label = String(body.label || '').trim()
  const url = String(body.url || '').trim()
  const type = String(body.type || 'INTERNAL')
  if (!label || label.length > 100) return 'Tên hiển thị phải có 1-100 ký tự'
  if (!url || url.length > 500) return 'Link phải có 1-500 ký tự'
  if (type === 'EXTERNAL' && !/^https?:\/\//i.test(url)) return 'Link ngoài phải bắt đầu bằng http:// hoặc https://'
  if (type !== 'EXTERNAL' && type !== 'CUSTOM' && !url.startsWith('/')) return 'Route nội bộ phải bắt đầu bằng /'
  return null
}
