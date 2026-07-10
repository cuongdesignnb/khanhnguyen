import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import prisma from '@/lib/prisma'
import { toSlug } from '@/lib/slug'
import { getAiSetting, openAiRequest } from './openai-client'
import { DEFAULT_IMAGE_PROMPT, interpolatePrompt } from './prompts'

export async function generatePostImage(input: {
  prompt?: string
  title: string
  imageModel?: string
  size?: '1536x1024' | '1024x1024' | '1024x1536'
}) {
  const setting = await getAiSetting()
  if (setting && !setting.isEnabled) throw new Error('Tính năng AI đang tắt')
  const prompt = input.prompt || interpolatePrompt(setting?.imagePrompt || DEFAULT_IMAGE_PROMPT, {
    titleOrHeading: input.title,
  })
  const result = await openAiRequest<{ data?: Array<{ b64_json?: string }> }>('/images/generations', {
    model: input.imageModel || setting?.imageModel || 'chatgpt-image-2',
    prompt,
    size: input.size || '1536x1024',
    response_format: 'b64_json',
  })
  const encoded = result.data?.[0]?.b64_json
  if (!encoded) throw new Error('OpenAI không trả về dữ liệu ảnh')
  const buffer = await sharp(Buffer.from(encoded, 'base64')).webp({ quality: 84 }).toBuffer()
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

export function insertHeadingImages(
  html: string,
  images: Array<{ heading: string; url: string; alt: string }>,
) {
  let result = html
  for (const image of images) {
    const escaped = image.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const headingPattern = new RegExp(`(<h[23][^>]*>\\s*${escaped}\\s*</h[23]>)`, 'i')
    const figure = `<figure><img src="${image.url}" alt="${image.alt.replaceAll('"', '&quot;')}" /><figcaption>${image.alt}</figcaption></figure>`
    result = result.replace(headingPattern, `$1${figure}`)
  }
  return result
}
