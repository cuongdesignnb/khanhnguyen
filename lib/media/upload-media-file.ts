import { randomUUID } from 'node:crypto'
import { mkdir, rename, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import prisma from '@/lib/prisma'
import { toSlug } from '@/lib/slug'
import { uploadRoot } from './media-path'
import type { MediaType } from '@/types/media'

type DetectedFile = {
  mimeType: string
  extension: string
  type: MediaType
  processWithSharp: boolean
}

export interface StoredMediaFile {
  filename: string
  originalName: string
  path: string
  url: string
  mimeType: string
  extension: string
  size: number
  width: number | null
  height: number | null
  type: MediaType
}

export class MediaUploadError extends Error {
  stage: 'validation' | 'processing' | 'write' | 'database'

  constructor(message: string, stage: MediaUploadError['stage'], options?: ErrorOptions) {
    super(message, options)
    this.name = 'MediaUploadError'
    this.stage = stage
  }
}

function startsWith(buffer: Buffer, signature: number[]) {
  return signature.every((byte, index) => buffer[index] === byte)
}

function detectFile(buffer: Buffer): DetectedFile | null {
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) {
    return { mimeType: 'image/jpeg', extension: '.jpg', type: 'IMAGE', processWithSharp: true }
  }
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mimeType: 'image/png', extension: '.png', type: 'IMAGE', processWithSharp: true }
  }
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    return { mimeType: 'image/webp', extension: '.webp', type: 'IMAGE', processWithSharp: true }
  }
  const gifHeader = buffer.subarray(0, 6).toString('ascii')
  if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
    return { mimeType: 'image/gif', extension: '.gif', type: 'IMAGE', processWithSharp: false }
  }
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('ascii')
    if (brand === 'avif' || brand === 'avis') {
      return { mimeType: 'image/avif', extension: '.avif', type: 'IMAGE', processWithSharp: true }
    }
    if (['heic', 'heix', 'hevc', 'hevx'].includes(brand)) {
      throw new MediaUploadError('Định dạng HEIC chưa được hỗ trợ trên server.', 'validation')
    }
  }
  if (buffer.subarray(0, 5).toString('ascii') === '%PDF-') {
    return { mimeType: 'application/pdf', extension: '.pdf', type: 'DOCUMENT', processWithSharp: false }
  }
  return null
}

function normalizedDeclaredMime(mimeType: string) {
  return mimeType.toLowerCase().split(';', 1)[0]
}

function validateDeclaredType(file: File, detected: DetectedFile) {
  const declared = normalizedDeclaredMime(file.type || '')
  if (!declared || declared === 'application/octet-stream') return
  const jpegAliases = new Set(['image/jpeg', 'image/jpg', 'image/pjpeg'])
  const compatible =
    declared === detected.mimeType ||
    (detected.mimeType === 'image/jpeg' && jpegAliases.has(declared))
  if (!compatible) {
    throw new MediaUploadError(
      `Nội dung file không đúng với định dạng khai báo (${declared}).`,
      'validation',
    )
  }
}

async function safeUnlink(filePath: string) {
  try {
    await unlink(filePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Không thể dọn file Media:', { filePath, error })
    }
  }
}

export async function writeMediaFileToVolume(file: File): Promise<StoredMediaFile> {
  if (!(file instanceof File) || file.size <= 0) {
    throw new MediaUploadError('Không tìm thấy file hợp lệ để tải lên.', 'validation')
  }

  const maxUploadSizeMb = Math.max(1, Number.parseInt(process.env.MAX_UPLOAD_SIZE_MB || '20', 10) || 20)
  if (file.size > maxUploadSizeMb * 1024 * 1024) {
    throw new MediaUploadError(`File vượt quá giới hạn ${maxUploadSizeMb} MB.`, 'validation')
  }

  const input = Buffer.from(await file.arrayBuffer())
  const detected = detectFile(input)
  if (!detected) {
    throw new MediaUploadError(
      'Nội dung file không thuộc định dạng JPG, PNG, WebP, AVIF, GIF hoặc PDF được hỗ trợ.',
      'validation',
    )
  }
  validateDeclaredType(file, detected)

  const now = new Date()
  const relativeDir = path.join(String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'))
  const absoluteDir = path.join(uploadRoot, relativeDir)
  const unique = randomUUID().replaceAll('-', '').slice(0, 12)
  const base = toSlug(path.basename(file.name, path.extname(file.name))) || 'media'

  let output = input
  let extension = detected.extension
  let mimeType = detected.mimeType
  let width: number | null = null
  let height: number | null = null

  if (detected.processWithSharp) {
    try {
      output = await sharp(input, { failOn: 'error' })
        .rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer()
      const metadata = await sharp(output, { failOn: 'error' }).metadata()
      width = metadata.width ?? null
      height = metadata.height ?? null
      extension = '.webp'
      mimeType = 'image/webp'
    } catch (error) {
      throw new MediaUploadError('Ảnh không thể xử lý bằng Sharp.', 'processing', { cause: error })
    }
  } else if (detected.type === 'IMAGE') {
    try {
      const metadata = await sharp(input, { animated: true, failOn: 'none' }).metadata()
      width = metadata.width ?? null
      height = metadata.height ?? null
    } catch {
      // GIF vẫn được giữ nguyên nếu Sharp không đọc được metadata phụ.
    }
  }

  const filename = `${base}-${unique}${extension}`
  const finalPath = path.join(absoluteDir, filename)
  const tempPath = path.join(absoluteDir, `.upload-${randomUUID()}.tmp`)

  try {
    await mkdir(absoluteDir, { recursive: true })
    await writeFile(tempPath, output, { flag: 'wx' })
    await rename(tempPath, finalPath)
  } catch (error) {
    await safeUnlink(tempPath)
    const code = (error as NodeJS.ErrnoException).code
    const message = code === 'EACCES' || code === 'EPERM'
      ? 'Không thể ghi file vào thư mục uploads. Hãy kiểm tra quyền Docker volume.'
      : 'Không thể ghi file vào thư mục uploads.'
    throw new MediaUploadError(message, 'write', { cause: error })
  }

  const finalStat = await stat(finalPath)
  const url = `/uploads/${path.join(relativeDir, filename).split(path.sep).join('/')}`
  return {
    filename,
    originalName: file.name,
    path: finalPath,
    url,
    mimeType,
    extension,
    size: finalStat.size,
    width,
    height,
    type: detected.type,
  }
}

export async function uploadMediaFile(
  file: File,
  options: { folderId?: string | null; alt?: string | null; title?: string | null } = {},
) {
  const folderId = options.folderId || null
  if (folderId) {
    const folder = await prisma.mediaFolder.findFirst({ where: { id: folderId, deletedAt: null } })
    if (!folder) throw new MediaUploadError('Thư mục Media không tồn tại.', 'validation')
  }

  const stored = await writeMediaFileToVolume(file)
  try {
    return await prisma.mediaFile.create({
      data: {
        ...stored,
        folderId,
        alt: options.alt?.trim() || null,
        title: options.title?.trim() || null,
      },
    })
  } catch (error) {
    await safeUnlink(stored.path)
    throw new MediaUploadError('Không thể tạo bản ghi Media; file đã được dọn an toàn.', 'database', { cause: error })
  }
}

export { safeUnlink }
