import type { MediaType, Prisma } from '@prisma/client'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { toMediaFileDto } from '@/lib/media/media-dto'
import {
  getSettingMediaIds,
  mediaUsageCountSelect,
  mediaUsageWhere,
} from '@/lib/media/media-usage'
import type { MediaSort, MediaUsage } from '@/types/media'

const mediaTypes = new Set<MediaType>(['IMAGE', 'DOCUMENT', 'VIDEO', 'OTHER'])
const mediaUsages = new Set<MediaUsage>([
  'product',
  'service',
  'post',
  'banner',
  'category',
  'brand',
  'testimonial',
  'page',
  'setting',
  'unused',
])
const mediaSorts = new Set<MediaSort>(['newest', 'oldest', 'name-asc', 'size-desc', 'size-asc'])

function clampInteger(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value || '', 10)
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback
}

function sortOrder(sort: MediaSort): Prisma.MediaFileOrderByWithRelationInput {
  if (sort === 'oldest') return { createdAt: 'asc' }
  if (sort === 'name-asc') return { originalName: 'asc' }
  if (sort === 'size-desc') return { size: 'desc' }
  if (sort === 'size-asc') return { size: 'asc' }
  return { createdAt: 'desc' }
}

export async function GET(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN', 'EDITOR'])
  if (auth.response) return auth.response

  try {
    const searchParams = request.nextUrl.searchParams
    const page = clampInteger(searchParams.get('page'), 1, 1, 1_000_000)
    const limit = clampInteger(searchParams.get('limit'), 30, 1, 100)
    const q = (searchParams.get('q') || '').trim().slice(0, 200)
    const folderId = searchParams.get('folderId') || ''
    const rawType = (searchParams.get('type') || '').toUpperCase() as MediaType
    const type = mediaTypes.has(rawType) ? rawType : null
    const rawUsage = searchParams.get('usage') as MediaUsage | null
    const usage = rawUsage && mediaUsages.has(rawUsage) ? rawUsage : null
    const rawSort = searchParams.get('sort') as MediaSort | null
    const sort = rawSort && mediaSorts.has(rawSort) ? rawSort : 'newest'
    const ids = (searchParams.get('ids') || '').split(',').map((id) => id.trim()).filter(Boolean).slice(0, 100)
    const rawFormat = (searchParams.get('format') || '').trim().toLowerCase()
    const format = rawFormat ? `.${rawFormat.replace(/^\./, '')}` : ''
    const settingMediaIds = await getSettingMediaIds()

    const filters: Prisma.MediaFileWhereInput[] = [{ deletedAt: null }]
    if (ids.length) filters.push({ id: { in: ids } })
    if (q) {
      filters.push({
        OR: [
          { filename: { contains: q, mode: 'insensitive' } },
          { originalName: { contains: q, mode: 'insensitive' } },
          { title: { contains: q, mode: 'insensitive' } },
          { alt: { contains: q, mode: 'insensitive' } },
        ],
      })
    }
    if (folderId === 'root' || folderId === 'unfiled') filters.push({ folderId: null })
    else if (folderId) filters.push({ folderId })
    if (type) filters.push({ type })
    if (format) filters.push({ extension: { equals: format, mode: 'insensitive' } })
    if (usage) filters.push(mediaUsageWhere(usage, settingMediaIds))

    const where: Prisma.MediaFileWhereInput = { AND: filters }
    const [items, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        include: { folder: { select: { name: true } }, _count: { select: mediaUsageCountSelect } },
        orderBy: sortOrder(sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.mediaFile.count({ where }),
    ])

    return api.ok({
      items: await Promise.all(items.map((item) => toMediaFileDto(item, settingMediaIds))),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (error) {
    console.error('Media list failed:', error)
    return api.serverError('Không thể lấy danh sách Media.')
  }
}

export const dynamic = 'force-dynamic'
