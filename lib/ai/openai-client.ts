import prisma from '@/lib/prisma'
import { decryptSecret } from '@/lib/crypto'
import { normalizeOpenAIOutputTokens } from './normalize-token-limit'

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

type OpenAiRequestOptions = {
  timeoutMs?: number
}

type OpenAiResponsesRequest = Record<string, unknown> & {
  maxOutputTokens?: unknown
}

export async function getAiSetting() {
  return prisma.aiSetting.findFirst({ orderBy: { updatedAt: 'desc' } })
}

export async function getOpenAiConfig() {
  const setting = await getAiSetting()
  const apiKey = setting?.apiKeyEncrypted
    ? decryptSecret(setting.apiKeyEncrypted)
    : process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('Chưa cấu hình OpenAI API key')
  return { apiKey, setting }
}

export async function openAiRequest<T>(path: string, body: unknown, options: OpenAiRequestOptions = {}): Promise<T> {
  const { apiKey } = await getOpenAiConfig()
  const response = await fetch(`https://api.openai.com/v1${path}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeoutMs ?? 180_000),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new OpenAiRequestError(
      data?.error?.message || `OpenAI trả về lỗi HTTP ${response.status}`,
      response.status,
      data?.error?.code,
      data?.error?.type,
    )
  }
  return data as T
}

export async function openAiResponsesRequest<T>(
  body: OpenAiResponsesRequest,
  options: OpenAiRequestOptions = {},
): Promise<T> {
  const { maxOutputTokens, ...requestBody } = body
  return openAiRequest<T>(
    '/responses',
    {
      ...requestBody,
      max_output_tokens: normalizeOpenAIOutputTokens(maxOutputTokens),
    },
    options,
  )
}
