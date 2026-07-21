import { NextRequest } from 'next/server'
import type { AiSetting } from '@prisma/client'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { encryptSecret, maskApiKey } from '@/lib/crypto'
import {
  DEFAULT_ARTICLE_PROMPT,
  DEFAULT_IMAGE_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
} from '@/lib/ai/prompts'
import {
  DEFAULT_CONTENT_BASE_URL,
  DEFAULT_CONTENT_MODEL,
  DEFAULT_CONTENT_WIRE_API,
  DEFAULT_IMAGE_BASE_URL,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_REASONING_EFFORT,
  normalizeHttpsBaseUrl,
} from '@/lib/ai/openai-client'
import {
  DEFAULT_AI_OUTPUT_TOKENS,
  MAX_AI_OUTPUT_TOKENS,
  OPENAI_MIN_OUTPUT_TOKENS,
  normalizeOpenAIOutputTokens,
} from '@/lib/ai/normalize-token-limit'

const defaults = {
  baseUrl: DEFAULT_CONTENT_BASE_URL,
  wireApi: DEFAULT_CONTENT_WIRE_API,
  textModel: DEFAULT_CONTENT_MODEL,
  reasoningEffort: DEFAULT_REASONING_EFFORT,
  imageBaseUrl: DEFAULT_IMAGE_BASE_URL,
  imageModel: DEFAULT_IMAGE_MODEL,
  imageQuality: DEFAULT_IMAGE_QUALITY,
  defaultTone: 'Chuyên gia tư vấn xe nâng, dễ hiểu, bán hàng nhẹ',
  defaultLanguage: 'vi',
  defaultWordCount: 1500,
  maxBulkItems: 10,
  generateFeaturedImage: true,
  maxOutputTokens: DEFAULT_AI_OUTPUT_TOKENS,
  generateHeadingImages: true,
  maxHeadingImages: 3,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  articlePrompt: DEFAULT_ARTICLE_PROMPT,
  imagePrompt: DEFAULT_IMAGE_PROMPT,
  isEnabled: false,
}

function nonEmpty(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function resolved(dbValue: unknown, envValue: unknown, fallback: string) {
  return nonEmpty(dbValue) || nonEmpty(envValue) || fallback
}

function safeSetting(setting: AiSetting | null) {
  const envContentKey = nonEmpty(process.env.OPENAI_API_KEY)
  const envImageKey = nonEmpty(process.env.OPENAI_IMAGE_API_KEY)
  return {
    baseUrl: resolved(setting?.baseUrl, process.env.OPENAI_BASE_URL, defaults.baseUrl),
    wireApi: resolved(setting?.wireApi, process.env.OPENAI_WIRE_API, defaults.wireApi),
    textModel: resolved(setting?.textModel, process.env.OPENAI_MODEL, defaults.textModel),
    reasoningEffort: resolved(setting?.reasoningEffort, process.env.OPENAI_REASONING_EFFORT, defaults.reasoningEffort),
    imageBaseUrl: resolved(setting?.imageBaseUrl, process.env.OPENAI_IMAGE_BASE_URL, defaults.imageBaseUrl),
    imageModel: resolved(setting?.imageModel, process.env.OPENAI_IMAGE_MODEL, defaults.imageModel),
    imageQuality: resolved(setting?.imageQuality, process.env.OPENAI_IMAGE_QUALITY, defaults.imageQuality),
    defaultTone: setting?.defaultTone || defaults.defaultTone,
    defaultLanguage: setting?.defaultLanguage || defaults.defaultLanguage,
    defaultWordCount: setting?.defaultWordCount || defaults.defaultWordCount,
    maxOutputTokens: setting
      ? normalizeOpenAIOutputTokens(setting.maxOutputTokens)
      : normalizeOpenAIOutputTokens(process.env.OPENAI_MAX_TOKENS),
    maxBulkItems: setting?.maxBulkItems || defaults.maxBulkItems,
    generateFeaturedImage: setting?.generateFeaturedImage ?? defaults.generateFeaturedImage,
    generateHeadingImages: setting?.generateHeadingImages ?? defaults.generateHeadingImages,
    maxHeadingImages: setting?.maxHeadingImages ?? defaults.maxHeadingImages,
    systemPrompt: setting?.systemPrompt || defaults.systemPrompt,
    articlePrompt: setting?.articlePrompt || defaults.articlePrompt,
    imagePrompt: setting?.imagePrompt || defaults.imagePrompt,
    isEnabled: setting?.isEnabled ?? defaults.isEnabled,
    apiKey: '',
    imageApiKey: '',
    hasApiKey: Boolean(setting?.apiKeyEncrypted || envContentKey),
    maskedApiKey: setting?.apiKeyHint || (envContentKey ? maskApiKey(envContentKey) : null),
    hasImageApiKey: Boolean(setting?.imageApiKeyEncrypted || envImageKey),
    maskedImageApiKey: setting?.imageApiKeyHint || (envImageKey ? maskApiKey(envImageKey) : null),
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const setting = await prisma.aiSetting.findFirst({ orderBy: { updatedAt: 'desc' } })
  return Response.json({ success: true, data: safeSetting(setting) })
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response

  try {
    const body = await request.json()
    const existing = await prisma.aiSetting.findFirst({ orderBy: { updatedAt: 'desc' } })
    const apiKey = nonEmpty(body.apiKey)
    const imageApiKey = nonEmpty(body.imageApiKey)
    const requestedMaxOutputTokens = body.maxOutputTokens === undefined
      ? normalizeOpenAIOutputTokens(existing?.maxOutputTokens ?? process.env.OPENAI_MAX_TOKENS)
      : Number(body.maxOutputTokens)

    if (!Number.isInteger(requestedMaxOutputTokens) || requestedMaxOutputTokens < OPENAI_MIN_OUTPUT_TOKENS || requestedMaxOutputTokens > MAX_AI_OUTPUT_TOKENS) {
      return Response.json({
        success: false,
        error: `Max Output Tokens phai la so nguyen tu ${OPENAI_MIN_OUTPUT_TOKENS} den ${MAX_AI_OUTPUT_TOKENS}.`,
      }, { status: 400 })
    }

    const wireApi = resolved(body.wireApi, existing?.wireApi || process.env.OPENAI_WIRE_API, defaults.wireApi)
    if (!['chat_completions', 'responses'].includes(wireApi)) {
      return Response.json({ success: false, error: 'Wire API khong hop le.' }, { status: 400 })
    }
    const reasoningEffort = resolved(body.reasoningEffort, existing?.reasoningEffort || process.env.OPENAI_REASONING_EFFORT, defaults.reasoningEffort)
    if (!['low', 'medium', 'high'].includes(reasoningEffort)) {
      return Response.json({ success: false, error: 'Reasoning Effort khong hop le.' }, { status: 400 })
    }
    const imageQuality = resolved(body.imageQuality, existing?.imageQuality || process.env.OPENAI_IMAGE_QUALITY, defaults.imageQuality)
    if (!['low', 'medium', 'high', 'auto'].includes(imageQuality)) {
      return Response.json({ success: false, error: 'Chat luong anh khong hop le.' }, { status: 400 })
    }

    const data = {
      baseUrl: normalizeHttpsBaseUrl(resolved(body.baseUrl, existing?.baseUrl || process.env.OPENAI_BASE_URL, defaults.baseUrl), 'AI Provider Base URL'),
      wireApi,
      textModel: resolved(body.textModel, existing?.textModel || process.env.OPENAI_MODEL, defaults.textModel),
      reasoningEffort,
      imageBaseUrl: normalizeHttpsBaseUrl(resolved(body.imageBaseUrl, existing?.imageBaseUrl || process.env.OPENAI_IMAGE_BASE_URL, defaults.imageBaseUrl), 'OpenAI Image Base URL'),
      imageModel: resolved(body.imageModel, existing?.imageModel || process.env.OPENAI_IMAGE_MODEL, defaults.imageModel),
      imageQuality,
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
      ...(imageApiKey ? { imageApiKeyEncrypted: encryptSecret(imageApiKey), imageApiKeyHint: maskApiKey(imageApiKey) } : {}),
    }

    const setting = existing
      ? await prisma.aiSetting.update({ where: { id: existing.id }, data })
      : await prisma.aiSetting.create({ data })
    return Response.json({ success: true, data: safeSetting(setting), message: 'Da luu cai dat AI' })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Khong the luu cai dat AI',
    }, { status: 400 })
  }
}
