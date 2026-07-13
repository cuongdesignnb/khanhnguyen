import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { getDefaultSetting, settingGroupMap } from '@/data/default-settings'
import { getSettingsByGroup, upsertSetting } from '@/lib/settings'
import { revalidatePath } from 'next/cache'
import { normalizeVideoUrl } from '@/lib/videos/normalize-video-url'
import type { HomeVideoSettingItem } from '@/types/home-video'

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
  for (const key of ['productsPerPage', 'postsPerPage', 'newsLimit', 'featuredProductsLimit', 'categoryProductLimit', 'relatedProductsLimit', 'videoSectionLimit']) {
    if (key in value && (!Number.isFinite(Number(value[key])) || Number(value[key]) <= 0)) errors.push(`${key}: phải là số dương`)
  }
  if ('featuredProductsLimit' in value && Number(value.featuredProductsLimit) > 8) errors.push('featuredProductsLimit: tối đa 8 sản phẩm')
  if ('categoryProductLimit' in value && Number(value.categoryProductLimit) > 8) errors.push('categoryProductLimit: tối đa 8 sản phẩm')
  if ('videoSectionLimit' in value && (!Number.isInteger(value.videoSectionLimit) || value.videoSectionLimit < 1 || value.videoSectionLimit > 12)) errors.push('Số video hiển thị phải là số nguyên từ 1 đến 12.')
  if ('heroSliderIntervalMs' in value && (!Number.isInteger(value.heroSliderIntervalMs) || value.heroSliderIntervalMs < 3000 || value.heroSliderIntervalMs > 15000)) errors.push('Chu kỳ Hero Slider phải từ 3000 đến 15000 ms.')
  if ('heroSliderMaxItems' in value && (!Number.isInteger(value.heroSliderMaxItems) || value.heroSliderMaxItems < 1 || value.heroSliderMaxItems > 8)) errors.push('Hero Slider chỉ hiển thị từ 1 đến 8 banner.')
  if ('heroSliderOverlayOpacity' in value && (!Number.isInteger(value.heroSliderOverlayOpacity) || value.heroSliderOverlayOpacity < 0 || value.heroSliderOverlayOpacity > 90)) errors.push('Độ tối Hero phải từ 0 đến 90%.')
  if ('heroSliderTransition' in value && !['fade', 'slide', 'fade-zoom'].includes(value.heroSliderTransition)) errors.push('Kiểu chuyển Hero Slider không hợp lệ.')
  if (group === 'home.config') errors.push(...validateHomeVideos(value.videoItems))
  if ('cardVisibleSpecsLimit' in value && (!Number.isInteger(value.cardVisibleSpecsLimit) || value.cardVisibleSpecsLimit < 0 || value.cardVisibleSpecsLimit > 3)) errors.push('cardVisibleSpecsLimit: chỉ nhận giá trị từ 0 đến 3')
  if ('cardHoverSpecsLimit' in value && (!Number.isInteger(value.cardHoverSpecsLimit) || value.cardHoverSpecsLimit < 3 || value.cardHoverSpecsLimit > 6)) errors.push('cardHoverSpecsLimit: chỉ nhận giá trị từ 3 đến 6')
  if ('cardPrioritySpecs' in value && (!Array.isArray(value.cardPrioritySpecs) || value.cardPrioritySpecs.length > 3)) errors.push('cardPrioritySpecs: chỉ được chọn tối đa 3 thông số')
  if ('cardImageRatio' in value && !['4:3', '1:1', '16:9'].includes(value.cardImageRatio)) errors.push('cardImageRatio: tỷ lệ ảnh không hợp lệ')
  if (!(group in settingGroupMap)) errors.push('Nhóm cài đặt không hợp lệ')
  return errors
}

function validateHomeVideos(value: unknown) {
  if (!Array.isArray(value)) return ['Danh sách video không hợp lệ.']
  if (value.length > 12) return ['Chỉ được cấu hình tối đa 12 video.']
  const errors: string[] = []
  const normalizedUrls = new Set<string>()
  const ids = new Set<string>()
  value.forEach((rawItem, index) => {
    const position = index + 1
    if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
      errors.push(`Video số ${position} có dữ liệu không hợp lệ.`)
      return
    }
    const item = rawItem as Record<string, unknown>
    if (typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) errors.push(`Video số ${position} có mã nhận diện không hợp lệ.`)
    else ids.add(item.id)
    if (typeof item.title !== 'string' || !item.title.trim()) errors.push(`Video số ${position} chưa có tiêu đề.`)
    if (item.source !== 'youtube' && item.source !== 'facebook') errors.push(`Video số ${position} có nguồn không hợp lệ.`)
    const normalized = normalizeVideoUrl(item.url)
    if (!normalized || normalized.source !== item.source) errors.push(`Video số ${position} có liên kết YouTube/Facebook không hợp lệ.`)
    else if (normalizedUrls.has(normalized.embedUrl)) errors.push('Liên kết video đang bị trùng.')
    else normalizedUrls.add(normalized.embedUrl)
    if (!(item.thumbnailId === null || typeof item.thumbnailId === 'string')) errors.push(`Thumbnail của video số ${position} không hợp lệ.`)
    if (typeof item.isEnabled !== 'boolean') errors.push(`Trạng thái video số ${position} không hợp lệ.`)
    if (typeof item.sortOrder !== 'number' || !Number.isFinite(item.sortOrder)) errors.push(`Thứ tự video số ${position} không hợp lệ.`)
  })
  return errors
}

function sanitizeHomeConfig(value: Record<string, any>) {
  if (!Array.isArray(value.videoItems)) return value
  const videoItems: HomeVideoSettingItem[] = value.videoItems.map((rawItem: Record<string, unknown>) => ({
    id: String(rawItem.id),
    title: String(rawItem.title).trim(),
    source: rawItem.source as HomeVideoSettingItem['source'],
    url: String(rawItem.url).trim(),
    thumbnailId: typeof rawItem.thumbnailId === 'string' ? rawItem.thumbnailId : null,
    isEnabled: Boolean(rawItem.isEnabled),
    sortOrder: Number(rawItem.sortOrder),
  }))
  return { ...value, videoItems }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const group = decodeURIComponent((await params).key)
  if (!(group in settingGroupMap)) return Response.json({ success: false, error: 'Nhóm cài đặt không hợp lệ' }, { status: 404 })
  const fallback = getDefaultSetting(group)
  const stored = await getSettingsByGroup(group, fallback)
  const data = stored && fallback && typeof stored === 'object' && typeof fallback === 'object' && !Array.isArray(stored) && !Array.isArray(fallback)
    ? { ...fallback, ...stored }
    : stored
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
  const sanitizedValue = group === 'home.config' ? sanitizeHomeConfig(value) : value
  await upsertSetting(group, 'main', sanitizedValue, { label: group, isPublic: group !== 'integrations.tracking' })
  revalidatePath('/')
  revalidatePath('/san-pham')
  revalidatePath('/tin-tuc')
  revalidatePath('/sitemap.xml')
  revalidatePath('/robots.txt')
  return Response.json({ success: true, data: sanitizedValue, message: 'Đã lưu cài đặt' })
}
