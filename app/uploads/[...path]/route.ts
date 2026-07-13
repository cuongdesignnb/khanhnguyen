import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { mediaUrlToDiskPath } from '@/lib/media/media-path'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

type UploadRouteContext = { params: Promise<{ path: string[] }> }

async function resolveUpload(params: UploadRouteContext['params']) {
  const segments = (await params).path
  if (!Array.isArray(segments) || segments.length === 0) return null
  return mediaUrlToDiskPath(`/uploads/${segments.join('/')}`)
}

function responseHeaders(filePath: string, size: number) {
  return {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Length': String(size),
    'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
  }
}

export async function GET(_request: Request, { params }: UploadRouteContext) {
  const filePath = await resolveUpload(params)
  if (!filePath) return new Response('Not found', { status: 404 })

  try {
    const [file, info] = await Promise.all([readFile(filePath), stat(filePath)])
    if (!info.isFile()) return new Response('Not found', { status: 404 })
    return new Response(new Uint8Array(file), { headers: responseHeaders(filePath, info.size) })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return new Response('Not found', { status: 404 })
    }
    console.error('Không thể đọc file upload:', { filePath, error })
    return new Response('Internal server error', { status: 500 })
  }
}

export async function HEAD(_request: Request, { params }: UploadRouteContext) {
  const filePath = await resolveUpload(params)
  if (!filePath) return new Response(null, { status: 404 })

  try {
    const info = await stat(filePath)
    if (!info.isFile()) return new Response(null, { status: 404 })
    return new Response(null, { headers: responseHeaders(filePath, info.size) })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return new Response(null, { status: 404 })
    }
    console.error('Không thể đọc metadata file upload:', { filePath, error })
    return new Response(null, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
