import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { encryptSecret, maskApiKey } from '@/lib/crypto'
import { DEFAULT_ARTICLE_PROMPT, DEFAULT_IMAGE_PROMPT, DEFAULT_SYSTEM_PROMPT } from '@/lib/ai/prompts'

const defaults = {
  textModel: 'gpt-5.4-mini', imageModel: 'chatgpt-image-2', defaultTone: 'Chuyên gia tư vấn xe nâng, dễ hiểu, bán hàng nhẹ',
  defaultLanguage: 'vi', defaultWordCount: 1500, maxBulkItems: 10, generateFeaturedImage: true,
  generateHeadingImages: true, maxHeadingImages: 3, systemPrompt: DEFAULT_SYSTEM_PROMPT,
  articlePrompt: DEFAULT_ARTICLE_PROMPT, imagePrompt: DEFAULT_IMAGE_PROMPT, isEnabled: false,
}

function safeSetting(setting: any) {
  const envKey = process.env.OPENAI_API_KEY
  return {
    ...defaults, ...setting, apiKeyEncrypted: undefined,
    hasApiKey: Boolean(setting?.apiKeyEncrypted || envKey),
    maskedApiKey: setting?.apiKeyHint || (envKey ? maskApiKey(envKey) : null),
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  return Response.json({ success: true, data: safeSetting(await prisma.aiSetting.findFirst({ orderBy: { updatedAt: 'desc' } })) })
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const body = await request.json()
  const existing = await prisma.aiSetting.findFirst({ orderBy: { updatedAt: 'desc' } })
  const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : ''
  const data = {
    textModel: String(body.textModel || defaults.textModel).trim(),
    imageModel: String(body.imageModel || defaults.imageModel).trim(),
    defaultTone: String(body.defaultTone || defaults.defaultTone),
    defaultWordCount: Math.min(3000, Math.max(500, Number(body.defaultWordCount) || 1500)),
    maxBulkItems: Math.min(50, Math.max(1, Number(body.maxBulkItems) || 10)),
    maxHeadingImages: Math.min(10, Math.max(0, Number(body.maxHeadingImages) || 3)),
    generateFeaturedImage: body.generateFeaturedImage !== false,
    generateHeadingImages: body.generateHeadingImages !== false,
    systemPrompt: String(body.systemPrompt || defaults.systemPrompt),
    articlePrompt: String(body.articlePrompt || defaults.articlePrompt),
    imagePrompt: String(body.imagePrompt || defaults.imagePrompt),
    isEnabled: Boolean(body.isEnabled),
    ...(apiKey ? { apiKeyEncrypted: encryptSecret(apiKey), apiKeyHint: maskApiKey(apiKey) } : {}),
  }
  const setting = existing
    ? await prisma.aiSetting.update({ where: { id: existing.id }, data })
    : await prisma.aiSetting.create({ data })
  return Response.json({ success: true, data: safeSetting(setting), message: 'Đã lưu cài đặt AI' })
}
