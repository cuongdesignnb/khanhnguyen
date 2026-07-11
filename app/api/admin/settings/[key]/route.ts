import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { getDefaultSetting, settingGroupMap } from '@/data/default-settings'
import { getSettingsByGroup, upsertSetting } from '@/lib/settings'
import { revalidatePath } from 'next/cache'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

function validate(group: string, value: Record<string, any>) {
  const errors: string[] = []
  for (const [key, field] of Object.entries(value)) {
    if (/email/i.test(key) && field && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(field))) errors.push(`${key}: email không hợp lệ`)
    if (/hotline|phone/i.test(key) && String(field || '').length > 30) errors.push(`${key}: số điện thoại quá dài`)
    if (/color/i.test(key) && field && !/^(#[0-9a-f]{3}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?\([^)]+\))$/i.test(String(field))) errors.push(`${key}: mã màu không hợp lệ`)
    if ((/url$/i.test(key) || /facebook|youtube|linkedin|messenger/i.test(key)) && field && !String(field).startsWith('/') && !/^https?:\/\//i.test(String(field)) && !/^tel:|^mailto:/i.test(String(field))) errors.push(`${key}: URL không hợp lệ`)
  }
  for (const key of ['productsPerPage', 'postsPerPage', 'newsLimit', 'featuredProductsLimit', 'relatedProductsLimit']) {
    if (key in value && (!Number.isFinite(Number(value[key])) || Number(value[key]) <= 0)) errors.push(`${key}: phải là số dương`)
  }
  if (!(group in settingGroupMap)) errors.push('Nhóm cài đặt không hợp lệ')
  return errors
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const group = decodeURIComponent((await params).key)
  if (!(group in settingGroupMap)) return Response.json({ success: false, error: 'Nhóm cài đặt không hợp lệ' }, { status: 404 })
  const data = await getSettingsByGroup(group, getDefaultSetting(group))
  return Response.json({ success: true, data })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  if (!isAdmin(auth.session)) return Response.json({ success: false, error: 'Chỉ ADMIN được sửa cài đặt website' }, { status: 403 })
  const group = decodeURIComponent((await params).key)
  const body = await request.json()
  const value = body?.value ?? body
  if (!value || typeof value !== 'object' || Array.isArray(value)) return Response.json({ success: false, error: 'Dữ liệu cài đặt không hợp lệ' }, { status: 400 })
  const errors = validate(group, value)
  if (errors.length) return Response.json({ success: false, error: errors[0], details: errors }, { status: 400 })
  await upsertSetting(group, 'main', value, { label: group, isPublic: group !== 'integrations.tracking' })
  revalidatePath('/')
  revalidatePath('/san-pham')
  revalidatePath('/tin-tuc')
  revalidatePath('/sitemap.xml')
  revalidatePath('/robots.txt')
  return Response.json({ success: true, data: value, message: 'Đã lưu cài đặt' })
}
