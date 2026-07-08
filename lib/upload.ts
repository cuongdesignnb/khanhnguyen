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

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Định dạng file không được hỗ trợ. Chỉ cho phép upload hình ảnh (JPG, PNG, WEBP, GIF, SVG).')
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
  
  let finalFilename = `${slugifiedName}-${timestamp}.webp`
  let finalPath = path.join(absoluteUploadDir, finalFilename)
  let finalUrl = `/${relativeUploadDir}/${finalFilename}`.replace(/\\/g, '/')
  let finalMime = 'image/webp'
  let finalExt = '.webp'
  let width: number | undefined
  let height: number | undefined

  try {
    const sharp = require('sharp')
    const sharpInstance = sharp(buffer)
    const metadata = await sharpInstance.metadata()
    
    width = metadata.width
    height = metadata.height
    
    await sharpInstance.webp({ quality: 80 }).toFile(finalPath)
  } catch (error) {
    console.warn('Sharp module failed, falling back to writing original file:', error)
    finalFilename = `${slugifiedName}-${timestamp}${fileExt}`
    finalPath = path.join(absoluteUploadDir, finalFilename)
    finalUrl = `/${relativeUploadDir}/${finalFilename}`.replace(/\\/g, '/')
    finalMime = file.type
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
      type: 'IMAGE',
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
  }
}
