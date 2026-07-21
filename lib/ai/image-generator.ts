import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import prisma from '@/lib/prisma'
import { toSlug } from '@/lib/slug'
import { getAiSetting, getOpenAiImageConfig, openAiImageRequest } from './openai-client'
import { DEFAULT_IMAGE_PROMPT, interpolatePrompt } from './prompts'

type GeneratedImageResponse = {
  data?: Array<{ b64_json?: string; url?: string }>
}

export type ImageWarningResult<T> = {
  image?: T
  warning?: string
}

export async function tryGeneratePostImage(input: Parameters<typeof generatePostImage>[0]): Promise<ImageWarningResult<Awaited<ReturnType<typeof generatePostImage>>>> {
  try {
    return { image: await generatePostImage(input) }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể sinh ảnh'
    const safeMessage = message.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]').slice(0, 500)
    return { warning: safeMessage.startsWith('Chưa cấu hình OpenAI Image API key') ? safeMessage : `${input.title}: ${safeMessage}` }
  }
}

export async function imageBytesFromResult(result: GeneratedImageResponse, fetchImpl: typeof fetch = fetch) {
  const item = result.data?.[0]
  if (item?.b64_json) return Buffer.from(item.b64_json, 'base64')
  if (!item?.url) throw new Error('OpenAI Image API không trả về dữ liệu ảnh')
  const parsed = new URL(item.url)
  if (parsed.protocol !== 'https:') throw new Error('URL ảnh từ provider không phải HTTPS')
  const response = await fetchImpl(parsed.toString(), { signal: AbortSignal.timeout(60_000) })
  if (!response.ok) throw new Error(`Không thể tải ảnh từ provider (HTTP ${response.status})`)
  return Buffer.from(await response.arrayBuffer())
}

export async function generatePostImage(input: {
  prompt?: string
  title: string
  imageModel?: string
  size?: '1536x1024' | '1024x1024' | '1024x1536'
}) {
  const setting = await getAiSetting()
  if (setting && !setting.isEnabled) throw new Error('Tính năng AI đang tắt')
  const config = await getOpenAiImageConfig()
  if (!config.apiKey) throw new Error('Chưa cấu hình OpenAI Image API key chính hãng. Bài viết vẫn được tạo nhưng bỏ qua sinh ảnh.')
  const prompt = input.prompt || interpolatePrompt(setting?.imagePrompt || DEFAULT_IMAGE_PROMPT, {
    titleOrHeading: input.title,
  })
  const result = await openAiImageRequest<GeneratedImageResponse>('/images/generations', {
    model: input.imageModel || config.model,
    prompt,
    n: 1,
    size: input.size || '1536x1024',
    quality: config.quality,
    output_format: 'png',
  })
  const sourceBuffer = await imageBytesFromResult(result)
  const buffer = await sharp(sourceBuffer).webp({ quality: 84 }).toBuffer()
  const folder = await prisma.mediaFolder.upsert({
    where: { slug: 'tin-tuc-ai' },
    update: { deletedAt: null },
    create: { name: 'Tin tức AI', slug: 'tin-tuc-ai' },
  })
  const now = new Date()
  const relativeDir = path.join('uploads', String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'))
  const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
  await fs.mkdir(absoluteDir, { recursive: true })
  const filename = `${toSlug(input.title).slice(0, 80) || 'anh-ai'}-${Date.now()}.webp`
  const absolutePath = path.join(absoluteDir, filename)
  await fs.writeFile(absolutePath, buffer)
  const metadata = await sharp(buffer).metadata()
  const url = `/${path.join(relativeDir, filename).replaceAll('\\', '/')}`
  const media = await prisma.mediaFile.create({
    data: {
      folderId: folder.id,
      filename,
      originalName: filename,
      path: absolutePath,
      url,
      mimeType: 'image/webp',
      extension: '.webp',
      size: buffer.length,
      width: metadata.width,
      height: metadata.height,
      alt: input.title,
      title: input.title,
      type: 'IMAGE',
    },
  })
  return { mediaId: media.id, url: media.url, alt: input.title }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] || character)
}

export function insertHeadingImages(
  html: string,
  images: Array<{ heading: string; url: string; alt: string }>,
) {
  let result = html
  for (const image of images) {
    const escapedHeading = image.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const headingPattern = new RegExp(`(<h[23][^>]*>\\s*${escapedHeading}\\s*</h[23]>)`, 'i')
    const safeAlt = escapeHtml(image.alt)
    const figure = `<figure><img src="${escapeHtml(image.url)}" alt="${safeAlt}" /><figcaption>${safeAlt}</figcaption></figure>`
    result = result.replace(headingPattern, `$1${figure}`)
  }
  return result
}
