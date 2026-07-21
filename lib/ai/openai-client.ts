import prisma from '@/lib/prisma'
import { decryptSecret } from '@/lib/crypto'
import { normalizeOpenAIOutputTokens } from './normalize-token-limit'

export const DEFAULT_CONTENT_BASE_URL = 'https://modelapi.vn/v1'
export const DEFAULT_CONTENT_MODEL = 'gpt-5.5'
export const DEFAULT_CONTENT_WIRE_API = 'chat_completions' as const
export const DEFAULT_REASONING_EFFORT = 'high' as const
export const DEFAULT_IMAGE_BASE_URL = 'https://api.openai.com/v1'
export const DEFAULT_IMAGE_MODEL = 'gpt-image-2'
export const DEFAULT_IMAGE_QUALITY = 'medium' as const

export type OpenAiWireApi = 'chat_completions' | 'responses'
export type OpenAiImageQuality = 'low' | 'medium' | 'high' | 'auto'

export class OpenAiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly type?: string,
  ) {
    super(message)
    this.name = 'OpenAiRequestError'
  }
}

export type OpenAiRequestOptions = {
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

type OpenAiSetting = NonNullable<Awaited<ReturnType<typeof getAiSetting>>>
type Environment = Record<string, string | undefined>

export type OpenAiContentConfig = {
  apiKey: string
  baseUrl: string
  wireApi: OpenAiWireApi
  model: string
  reasoningEffort: string
  maxTokens: number
  setting: OpenAiSetting | null
}

export type OpenAiImageConfig = {
  apiKey: string | null
  baseUrl: string
  model: string
  quality: OpenAiImageQuality
  setting: OpenAiSetting | null
}

export async function getAiSetting() {
  return prisma.aiSetting.findFirst({ orderBy: { updatedAt: 'desc' } })
}

function nonEmpty(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function firstValue(dbValue: unknown, envValue: unknown, fallback: string) {
  return nonEmpty(dbValue) || nonEmpty(envValue) || fallback
}

export function normalizeHttpsBaseUrl(value: string, label = 'Base URL') {
  const normalized = value.trim().replace(/\/+$/, '')
  let parsed: URL
  try {
    parsed = new URL(normalized)
  } catch {
    throw new Error(`${label} phải là một URL HTTPS hợp lệ`)
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password) {
    throw new Error(`${label} chỉ chấp nhận URL HTTPS`)
  }
  return normalized
}

function resolveWireApi(value: unknown): OpenAiWireApi {
  const normalized = nonEmpty(value) || DEFAULT_CONTENT_WIRE_API
  if (normalized !== 'chat_completions' && normalized !== 'responses') {
    throw new Error('OPENAI_WIRE_API phải là chat_completions hoặc responses')
  }
  return normalized
}

function resolveImageQuality(value: unknown): OpenAiImageQuality {
  const normalized = nonEmpty(value) || DEFAULT_IMAGE_QUALITY
  if (!['low', 'medium', 'high', 'auto'].includes(normalized)) {
    throw new Error('OPENAI_IMAGE_QUALITY phải là low, medium, high hoặc auto')
  }
  return normalized as OpenAiImageQuality
}

function decryptIfPresent(value: unknown) {
  const encrypted = nonEmpty(value)
  return encrypted ? nonEmpty(decryptSecret(encrypted)) : undefined
}

function resolveSecret(encrypted: unknown, environmentValue: unknown) {
  return decryptIfPresent(encrypted) || nonEmpty(environmentValue)
}

export function resolveOpenAiConfig(setting: OpenAiSetting | null, environment: Environment = process.env): OpenAiContentConfig {
  const apiKey = resolveSecret(setting?.apiKeyEncrypted, environment.OPENAI_API_KEY)
  if (!apiKey) throw new Error('Chưa cấu hình API key cho provider viết bài')
  return {
    apiKey,
    baseUrl: normalizeHttpsBaseUrl(
      firstValue(setting?.baseUrl, environment.OPENAI_BASE_URL, DEFAULT_CONTENT_BASE_URL),
      'OPENAI_BASE_URL',
    ),
    wireApi: resolveWireApi(firstValue(setting?.wireApi, environment.OPENAI_WIRE_API, DEFAULT_CONTENT_WIRE_API)),
    model: firstValue(setting?.textModel, environment.OPENAI_MODEL, DEFAULT_CONTENT_MODEL),
    reasoningEffort: firstValue(setting?.reasoningEffort, environment.OPENAI_REASONING_EFFORT, DEFAULT_REASONING_EFFORT),
    maxTokens: normalizeOpenAIOutputTokens(
      setting?.maxOutputTokens ?? environment.OPENAI_MAX_TOKENS,
      4096,
    ),
    setting,
  }
}

export function resolveOpenAiImageConfig(setting: OpenAiSetting | null, environment: Environment = process.env): OpenAiImageConfig {
  return {
    apiKey: resolveSecret(setting?.imageApiKeyEncrypted, environment.OPENAI_IMAGE_API_KEY) || null,
    baseUrl: normalizeHttpsBaseUrl(
      firstValue(setting?.imageBaseUrl, environment.OPENAI_IMAGE_BASE_URL, DEFAULT_IMAGE_BASE_URL),
      'OPENAI_IMAGE_BASE_URL',
    ),
    model: firstValue(setting?.imageModel, environment.OPENAI_IMAGE_MODEL, DEFAULT_IMAGE_MODEL),
    quality: resolveImageQuality(firstValue(setting?.imageQuality, environment.OPENAI_IMAGE_QUALITY, DEFAULT_IMAGE_QUALITY)),
    setting,
  }
}

export async function getOpenAiConfig() {
  const setting = await getAiSetting()
  return resolveOpenAiConfig(setting)
}

export async function getOpenAiImageConfig() {
  const setting = await getAiSetting()
  return resolveOpenAiImageConfig(setting)
}

export async function requestOpenAiWithConfig<T>(
  config: { apiKey: string; baseUrl: string },
  path: string,
  body: unknown,
  options: OpenAiRequestOptions = {},
): Promise<T> {
  const response = await (options.fetchImpl || fetch)(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${config.apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeoutMs ?? 180_000),
  })
  const raw = await response.text()
  let data: unknown
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    data = { error: { message: raw.slice(0, 1000) } }
  }
  const errorData = data && typeof data === 'object' ? data as Record<string, unknown> : {}
  const providerError = errorData.error && typeof errorData.error === 'object'
    ? errorData.error as Record<string, unknown>
    : null
  if (!response.ok) {
    throw new OpenAiRequestError(
      String(typeof providerError?.message === 'string' && providerError.message.trim()
        ? providerError.message
        : `Provider tra ve loi HTTP ${response.status}`).slice(0, 1000),
      response.status,
      providerError?.code ? String(providerError.code) : undefined,
      providerError?.type ? String(providerError.type) : undefined,
    )
  }
  return data as T
}

export async function openAiImageRequest<T>(path: string, body: unknown, options: OpenAiRequestOptions = {}): Promise<T> {
  const config = await getOpenAiImageConfig()
  if (!config.apiKey) throw new Error('Chưa cấu hình OpenAI Image API key chính hãng')
  return requestOpenAiWithConfig({ apiKey: config.apiKey, baseUrl: config.baseUrl }, path, body, options)
}

export type OpenAiContentRequest = {
  model?: string
  instructions: string
  input: string
  text?: unknown
  maxOutputTokens?: unknown
}

function getChatResponseFormat(text: unknown) {
  if (!text || typeof text !== 'object') return undefined
  const format = (text as Record<string, unknown>).format
  if (!format || typeof format !== 'object') return undefined
  return (format as Record<string, unknown>).type === 'json_object'
    ? { type: 'json_object' as const }
    : undefined
}

export function buildOpenAiContentRequest(config: Pick<OpenAiContentConfig, 'wireApi' | 'model' | 'reasoningEffort' | 'maxTokens'>, body: OpenAiContentRequest) {
  if (config.wireApi === 'chat_completions') {
    const responseFormat = getChatResponseFormat(body.text)
    return {
      path: '/chat/completions',
      body: {
        model: body.model || config.model,
        messages: [
          { role: 'system', content: body.instructions },
          { role: 'user', content: body.input },
        ],
        max_tokens: normalizeOpenAIOutputTokens(body.maxOutputTokens ?? config.maxTokens, config.maxTokens),
        ...(responseFormat ? { response_format: responseFormat } : {}),
      },
    }
  }
  return {
    path: '/responses',
    body: {
      model: body.model || config.model,
      instructions: body.instructions,
      input: body.input,
      reasoning: { effort: config.reasoningEffort },
      max_output_tokens: normalizeOpenAIOutputTokens(body.maxOutputTokens ?? config.maxTokens, config.maxTokens),
      store: false,
      ...(body.text === undefined ? {} : { text: body.text }),
    },
  }
}

export async function openAiContentRequest<T>(body: OpenAiContentRequest, options: OpenAiRequestOptions = {}): Promise<T> {
  const config = await getOpenAiConfig()
  const request = buildOpenAiContentRequest(config, body)
  return requestOpenAiWithConfig<T>(config, request.path, request.body, options)
}

export function extractOpenAiText(response: unknown): string {
  if (!response || typeof response !== 'object') return ''
  const data = response as Record<string, unknown>
  if (typeof data.output_text === 'string') return data.output_text
  if (Array.isArray(data.output)) {
    const text = data.output.flatMap((item) => {
      if (!item || typeof item !== 'object') return []
      const content = (item as Record<string, unknown>).content
      if (!Array.isArray(content)) return []
      return content.flatMap((part) => {
        if (typeof part === 'string') return [part]
        if (!part || typeof part !== 'object') return []
        const value = (part as Record<string, unknown>).text
        return typeof value === 'string' ? [value] : []
      })
    }).join('')
    if (text) return text
  }
  const choices = data.choices
  if (Array.isArray(choices)) {
    const firstChoice = choices[0]
    const message = firstChoice && typeof firstChoice === 'object' ? (firstChoice as Record<string, unknown>).message : null
    const content = message && typeof message === 'object' ? (message as Record<string, unknown>).content : undefined
    if (typeof content === 'string') return content
    if (Array.isArray(content)) return content.map((part) => typeof part === 'string' ? part : part?.text || '').join('')
  }
  return ''
}
