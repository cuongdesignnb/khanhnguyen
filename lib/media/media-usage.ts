import type { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import type { MediaUsage, MediaUsageLocation } from '@/types/media'

export const mediaUsageCountSelect = {
  categoryBanners: true,
  categoryOgImages: true,
  brandLogos: true,
  brandOgImages: true,
  productThumbs: true,
  productOgImages: true,
  productImages: true,
  serviceImages: true,
  serviceOgImages: true,
  postThumbs: true,
  postOgImages: true,
  postCategoryOgImages: true,
  testimonials: true,
  banners: true,
  productReviewImages: true,
  pageSectionImages: true,
  pageSectionBackgrounds: true,
  pageSectionItems: true,
} satisfies Prisma.MediaFileCountOutputTypeSelect

export type MediaRelationCounts = {
  [Key in keyof typeof mediaUsageCountSelect]: number
}

function collectStrings(value: unknown, output: Set<string>) {
  if (typeof value === 'string') {
    output.add(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, output)
    return
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, output)
  }
}

export async function getSettingMediaIds() {
  const settings = await prisma.setting.findMany({ select: { value: true } })
  const values = new Set<string>()
  for (const setting of settings) collectStrings(setting.value, values)
  return values
}

export function mediaUsageWhere(
  usage: MediaUsage,
  settingMediaIds: Set<string>,
): Prisma.MediaFileWhereInput {
  const relationWhere: Record<Exclude<MediaUsage, 'setting' | 'unused'>, Prisma.MediaFileWhereInput> = {
    product: {
      OR: [
        { productThumbs: { some: {} } },
        { productOgImages: { some: {} } },
        { productImages: { some: {} } },
      ],
    },
    service: { OR: [{ serviceImages: { some: {} } }, { serviceOgImages: { some: {} } }] },
    post: {
      OR: [
        { postThumbs: { some: {} } },
        { postOgImages: { some: {} } },
        { postCategoryOgImages: { some: {} } },
      ],
    },
    banner: { banners: { some: {} } },
    category: { OR: [{ categoryBanners: { some: {} } }, { categoryOgImages: { some: {} } }] },
    brand: { OR: [{ brandLogos: { some: {} } }, { brandOgImages: { some: {} } }] },
    testimonial: { testimonials: { some: {} } },
    page: {
      OR: [
        { pageSectionImages: { some: {} } },
        { pageSectionBackgrounds: { some: {} } },
        { pageSectionItems: { some: {} } },
        { productReviewImages: { some: {} } },
      ],
    },
  }

  if (usage === 'setting') return { id: { in: [...settingMediaIds] } }
  if (usage !== 'unused') return relationWhere[usage]

  return {
    AND: [
      { productThumbs: { none: {} } },
      { productOgImages: { none: {} } },
      { productImages: { none: {} } },
      { serviceImages: { none: {} } },
      { serviceOgImages: { none: {} } },
      { postThumbs: { none: {} } },
      { postOgImages: { none: {} } },
      { postCategoryOgImages: { none: {} } },
      { banners: { none: {} } },
      { categoryBanners: { none: {} } },
      { categoryOgImages: { none: {} } },
      { brandLogos: { none: {} } },
      { brandOgImages: { none: {} } },
      { testimonials: { none: {} } },
      { pageSectionImages: { none: {} } },
      { pageSectionBackgrounds: { none: {} } },
      { pageSectionItems: { none: {} } },
      { productReviewImages: { none: {} } },
      ...(settingMediaIds.size ? [{ id: { notIn: [...settingMediaIds] } }] : []),
    ],
  }
}

export function buildMediaUsageLocations(
  counts: MediaRelationCounts,
  usedInSettings: boolean,
): MediaUsageLocation[] {
  const locations: MediaUsageLocation[] = []
  const add = (
    type: MediaUsageLocation['type'],
    label: string,
    count: number,
    href?: string,
  ) => {
    if (count > 0) locations.push({ type, label, count, href })
  }

  add('product', 'Sản phẩm', counts.productThumbs + counts.productOgImages + counts.productImages, '/admin/products')
  add('service', 'Dịch vụ', counts.serviceImages + counts.serviceOgImages, '/admin/services')
  add('post', 'Tin tức', counts.postThumbs + counts.postOgImages + counts.postCategoryOgImages, '/admin/tin-tuc')
  add('banner', 'Banner', counts.banners, '/admin/banners')
  add('category', 'Danh mục', counts.categoryBanners + counts.categoryOgImages, '/admin/categories')
  add('brand', 'Thương hiệu', counts.brandLogos + counts.brandOgImages, '/admin/brands')
  add('testimonial', 'Đánh giá', counts.testimonials)
  add(
    'page',
    'Nội dung trang',
    counts.pageSectionImages +
      counts.pageSectionBackgrounds +
      counts.pageSectionItems +
      counts.productReviewImages,
    '/admin/cai-dat',
  )
  if (usedInSettings) locations.push({ type: 'setting', label: 'Cài đặt website', count: 1, href: '/admin/cai-dat' })
  return locations
}
