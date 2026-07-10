import fs from 'fs'
import path from 'path'
import { toSlug } from './slug'
import prisma from './prisma'

export interface UploadResult {
  id: string
  filename: string
  originalName: string
  path: string
  url: string
  mimeType: string
  extension: string
  size: number
  width?: number
  height?: number
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER'
}

export async function handleUpload(
  file: File,
  folderId?: string | null
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const maxUploadSizeMb = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10', 10)
  if (buffer.length > maxUploadSizeMb * 1024 * 1024) {
    throw new Error(`Kích thước file vượt quá giới hạn cho phép (${maxUploadSizeMb}MB)`)
  }

  // Allowed image & document types
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  const docTypes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv',
    'text/plain'
  ]

  const fileMime = file.type || 'application/octet-stream'
  const isImage = imageTypes.includes(fileMime)
  const isDoc = docTypes.includes(fileMime)

  if (!isImage && !isDoc) {
    throw new Error(
      'Định dạng file không được hỗ trợ. Chỉ cho phép upload hình ảnh (JPG, PNG, WEBP, GIF, SVG) và tài liệu (PDF, DOC, DOCX, XLS, XLSX, CSV, TXT).'
    )
  }

  const now = new Date()
  const year = now.getFullYear().toString()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')

  const relativeUploadDir = path.join('uploads', year, month)
  const absoluteUploadDir = path.join(process.cwd(), 'public', relativeUploadDir)

  if (!fs.existsSync(absoluteUploadDir)) {
    fs.mkdirSync(absoluteUploadDir, { recursive: true })
  }

  const fileExt = path.extname(file.name).toLowerCase()
  const baseName = path.basename(file.name, fileExt)
  const slugifiedName = toSlug(baseName)
  const timestamp = Date.now()

  let finalFilename = ''
  let finalPath = ''
  let finalUrl = ''
  let finalMime = ''
  let finalExt = ''
  let width: number | undefined
  let height: number | undefined
  let mediaType: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER' = 'OTHER'

  if (isImage) {
    mediaType = 'IMAGE'
    // SVG is keeping original structure
    if (fileMime === 'image/svg+xml') {
      finalFilename = `${slugifiedName}-${timestamp}${fileExt}`
      finalPath = path.join(absoluteUploadDir, finalFilename)
      finalUrl = `/${relativeUploadDir}/${finalFilename}`.replace(/\\/g, '/')
      finalMime = fileMime
      finalExt = fileExt
      fs.writeFileSync(finalPath, buffer)
    } else {
      // JPEG, PNG, WEBP, GIF -> WebP quality 82, resize max 2000px, keep ratio & transparency
      finalFilename = `${slugifiedName}-${timestamp}.webp`
      finalPath = path.join(absoluteUploadDir, finalFilename)
      finalUrl = `/${relativeUploadDir}/${finalFilename}`.replace(/\\/g, '/')
      finalMime = 'image/webp'
      finalExt = '.webp'

      try {
        const sharp = require('sharp')
        const sharpInstance = sharp(buffer)
        const metadata = await sharpInstance.metadata()

        width = metadata.width
        height = metadata.height

        // WebP quality 82, resize max width 2000px without enlarging
        await sharpInstance
          .resize({
            width: 2000,
            withoutEnlargement: true,
            fit: 'inside',
          })
          .webp({ quality: 82 })
          .toFile(finalPath)
      } catch (error) {
        console.warn('Sharp module failed, falling back to writing original image file:', error)
        finalFilename = `${slugifiedName}-${timestamp}${fileExt}`
        finalPath = path.join(absoluteUploadDir, finalFilename)
        finalUrl = `/${relativeUploadDir}/${finalFilename}`.replace(/\\/g, '/')
        finalMime = fileMime
        finalExt = fileExt
        fs.writeFileSync(finalPath, buffer)
      }
    }
  } else {
    // Document uploads - store original file unchanged
    mediaType = 'DOCUMENT'
    finalFilename = `${slugifiedName}-${timestamp}${fileExt}`
    finalPath = path.join(absoluteUploadDir, finalFilename)
    finalUrl = `/${relativeUploadDir}/${finalFilename}`.replace(/\\/g, '/')
    finalMime = fileMime
    finalExt = fileExt
    fs.writeFileSync(finalPath, buffer)
  }

  const size = buffer.length

  const mediaFile = await prisma.mediaFile.create({
    data: {
      folderId: folderId || null,
      filename: finalFilename,
      originalName: file.name,
      path: finalPath,
      url: finalUrl,
      mimeType: finalMime,
      extension: finalExt,
      size,
      width: width || null,
      height: height || null,
      type: mediaType,
    },
  })

  return {
    id: mediaFile.id,
    filename: mediaFile.filename,
    originalName: mediaFile.originalName,
    path: mediaFile.path,
    url: mediaFile.url,
    mimeType: mediaFile.mimeType,
    extension: mediaFile.extension,
    size: mediaFile.size,
    width: mediaFile.width || undefined,
    height: mediaFile.height || undefined,
    type: mediaFile.type as 'IMAGE' | 'DOCUMENT',
  }
}
