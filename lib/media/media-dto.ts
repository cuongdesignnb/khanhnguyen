import type { MediaFile, MediaFolder } from '@prisma/client'
import { buildMediaUsageLocations, type MediaRelationCounts } from './media-usage'
import { isLocalMediaMissing } from './media-health'
import type { MediaFileDto, MediaUsage } from '@/types/media'
import prisma from '@/lib/prisma'
import { getSettingMediaIds, mediaUsageCountSelect } from './media-usage'

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

type MediaWithRelations = MediaFile & {
  folder?: Pick<MediaFolder, 'name'> | null
  _count: MediaRelationCounts
}

export async function toMediaFileDto(
  media: MediaWithRelations,
  settingMediaIds: Set<string>,
): Promise<MediaFileDto> {
  const usages = buildMediaUsageLocations(media._count, settingMediaIds.has(media.id))
  const usage: MediaUsage[] = usages.length ? [...new Set(usages.map((item) => item.type))] : ['unused']
  return {
    id: media.id,
    folderId: media.folderId,
    folderName: media.folder?.name ?? null,
    filename: media.filename,
    originalName: media.originalName,
    path: media.path,
    url: media.url,
    src: media.url,
    mimeType: media.mimeType,
    extension: media.extension,
    format: media.extension.replace(/^\./, '').toLowerCase(),
    size: media.size,
    sizeLabel: formatBytes(media.size),
    width: media.width,
    height: media.height,
    alt: media.alt || '',
    title: media.title || '',
    type: media.type,
    usages,
    usage,
    missing: await isLocalMediaMissing(media.url),
    createdAt: media.createdAt.toISOString(),
    updatedAt: media.updatedAt.toISOString(),
    uploadedAt: media.createdAt.toISOString(),
  }
}

export async function getMediaFileDto(id: string) {
  const [media, settingMediaIds] = await Promise.all([
    prisma.mediaFile.findFirst({
      where: { id, deletedAt: null },
      include: { folder: { select: { name: true } }, _count: { select: mediaUsageCountSelect } },
    }),
    getSettingMediaIds(),
  ])
  return media ? toMediaFileDto(media, settingMediaIds) : null
}
