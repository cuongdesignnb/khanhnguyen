import prisma from '@/lib/prisma'
import { decryptSecret } from '@/lib/crypto'

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

export async function openAiRequest<T>(path: string, body: unknown): Promise<T> {
  const { apiKey } = await getOpenAiConfig()
  const response = await fetch(`https://api.openai.com/v1${path}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180_000),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error?.message || `OpenAI trả về lỗi HTTP ${response.status}`)
  return data as T
}
