export type MediaType = 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER'

export type MediaUsage =
  | 'product'
  | 'service'
  | 'post'
  | 'banner'
  | 'category'
  | 'brand'
  | 'testimonial'
  | 'page'
  | 'setting'
  | 'unused'

export type MediaSort = 'newest' | 'oldest' | 'name-asc' | 'size-desc' | 'size-asc'

export interface MediaUsageLocation {
  type: Exclude<MediaUsage, 'unused'>
  label: string
  count: number
  href?: string
}

export interface MediaFolderDto {
  id: string
  name: string
  slug: string
  parentId: string | null
  fileCount: number
  childCount: number
  createdAt: string
}

export interface MediaFileDto {
  id: string
  folderId: string | null
  folderName: string | null
  filename: string
  originalName: string
  path: string
  url: string
  src: string
  mimeType: string
  extension: string
  format: string
  size: number
  sizeLabel: string
  width: number | null
  height: number | null
  alt: string
  title: string
  type: MediaType
  usages: MediaUsageLocation[]
  usage: MediaUsage[]
  missing: boolean
  createdAt: string
  updatedAt: string
  uploadedAt: string
}

export interface MediaListQuery {
  page: number
  limit: number
  q: string
  folderId: string
  type: '' | MediaType
  format: string
  usage: '' | MediaUsage
  sort: MediaSort
  ids?: string
}

export interface MediaListResponse {
  items: MediaFileDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type MediaUploadStatus =
  | 'queued'
  | 'validating'
  | 'uploading'
  | 'processing'
  | 'success'
  | 'error'
  | 'cancelled'

export interface MediaUploadItem {
  id: string
  file: File
  previewUrl: string
  progress: number
  status: MediaUploadStatus
  error: string | null
  result: MediaFileDto | null
}

export interface MediaHealthEntry {
  id?: string
  url: string
  filename: string
  reason: string
}

export interface MediaHealthReport {
  scannedAt: string
  totalLocalMedia: number
  healthy: number
  missingFiles: number
  orphanFiles: number
  databaseOnly: MediaHealthEntry[]
  filesystemOnly: MediaHealthEntry[]
}

export interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (items: MediaFileDto[]) => void
  multiple?: boolean
  maxSelect?: number
  acceptedTypes?: MediaType[]
  initialSelectedIds?: string[]
  folderId?: string | null
  usageContext?: Exclude<MediaUsage, 'unused'>
}
