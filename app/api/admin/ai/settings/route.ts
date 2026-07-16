import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { encryptSecret, maskApiKey } from '@/lib/crypto'
import { DEFAULT_ARTICLE_PROMPT, DEFAULT_IMAGE_PROMPT, DEFAULT_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { DEFAULT_AI_OUTPUT_TOKENS, MAX_AI_OUTPUT_TOKENS, OPENAI_MIN_OUTPUT_TOKENS, normalizeOpenAIOutputTokens } from '@/lib/ai/normalize-token-limit'
import type { AiSetting } from '@prisma/client'

const defaults = {
  textModel: 'gpt-5.4-mini', imageModel: 'chatgpt-image-2', defaultTone: 'Chuyên gia tư vấn xe nâng, dễ hiểu, bán hàng nhẹ',
  defaultLanguage: 'vi', defaultWordCount: 1500, maxBulkItems: 10, generateFeaturedImage: true,
  maxOutputTokens: DEFAULT_AI_OUTPUT_TOKENS,
  generateHeadingImages: true, maxHeadingImages: 3, systemPrompt: DEFAULT_SYSTEM_PROMPT,
  articlePrompt: DEFAULT_ARTICLE_PROMPT, imagePrompt: DEFAULT_IMAGE_PROMPT, isEnabled: false,
}

function safeSetting(setting: AiSetting | null) {
  const envKey = process.env.OPENAI_API_KEY
  return {
    textModel: setting?.textModel || defaults.textModel,
    imageModel: setting?.imageModel || defaults.imageModel,
    defaultTone: setting?.defaultTone || defaults.defaultTone,
    defaultLanguage: setting?.defaultLanguage || defaults.defaultLanguage,
    defaultWordCount: setting?.defaultWordCount || defaults.defaultWordCount,
    maxOutputTokens: normalizeOpenAIOutputTokens(setting?.maxOutputTokens),
    maxBulkItems: setting?.maxBulkItems || defaults.maxBulkItems,
    generateFeaturedImage: setting?.generateFeaturedImage ?? defaults.generateFeaturedImage,
    generateHeadingImages: setting?.generateHeadingImages ?? defaults.generateHeadingImages,
    maxHeadingImages: setting?.maxHeadingImages ?? defaults.maxHeadingImages,
    systemPrompt: setting?.systemPrompt || defaults.systemPrompt,
    articlePrompt: setting?.articlePrompt || defaults.articlePrompt,
    imagePrompt: setting?.imagePrompt || defaults.imagePrompt,
    isEnabled: setting?.isEnabled ?? defaults.isEnabled,
    apiKey: '',
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
  const requestedMaxOutputTokens = body.maxOutputTokens === undefined
    ? normalizeOpenAIOutputTokens(existing?.maxOutputTokens)
    : Number(body.maxOutputTokens)
  if (!Number.isInteger(requestedMaxOutputTokens) || requestedMaxOutputTokens < OPENAI_MIN_OUTPUT_TOKENS) {
    return Response.json({ success: false, error: 'Số token đầu ra của OpenAI phải từ 16 trở lên.' }, { status: 400 })
  }
  if (requestedMaxOutputTokens > MAX_AI_OUTPUT_TOKENS) {
    return Response.json({ success: false, error: 'Số token đầu ra của OpenAI không được vượt quá 16384.' }, { status: 400 })
  }
  const data = {
    textModel: String(body.textModel || defaults.textModel).trim(),
    imageModel: String(body.imageModel || defaults.imageModel).trim(),
    defaultTone: String(body.defaultTone || defaults.defaultTone),
    defaultWordCount: Math.min(3000, Math.max(500, Number(body.defaultWordCount) || 1500)),
    maxOutputTokens: requestedMaxOutputTokens,
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
