import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { extractOpenAiText, openAiContentRequest, OpenAiRequestError } from '@/lib/ai/openai-client'
import { DEFAULT_TEST_OUTPUT_TOKENS } from '@/lib/ai/normalize-token-limit'

function connectionErrorMessage(error: unknown) {
  if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return 'Ket noi provider qua thoi gian cho. Vui long kiem tra mang hoac thu lai.'
  }
  if (error instanceof OpenAiRequestError) {
    const details = `${error.code || ''} ${error.type || ''} ${error.message}`.toLowerCase()
    if (error.status === 401 || details.includes('invalid_api_key')) return 'API key provider khong hop le hoac da het quyen truy cap.'
    if (details.includes('max_output_tokens') || details.includes('minimum value')) return 'Gioi han token khong hop le.'
    if (details.includes('model_not_found') || details.includes('does not exist') || error.status === 404) return 'Model da chon khong ton tai hoac tai khoan chua duoc cap quyen.'
    if (details.includes('insufficient_quota') || details.includes('quota') || error.status === 429) return 'Tai khoan provider da het han muc hoac chua thiet lap thanh toan.'
  }
  return error instanceof Error ? error.message : 'Khong the ket noi den provider. Vui long thu lai.'
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const response = await openAiContentRequest<unknown>({
      instructions: 'Reply with exactly one word: OK',
      input: 'Reply with exactly one word: OK',
      maxOutputTokens: DEFAULT_TEST_OUTPUT_TOKENS,
    }, { timeoutMs: 25_000 })
    return Response.json({ success: true, data: { connected: Boolean(extractOpenAiText(response).trim()) } })
  } catch (error) {
    return Response.json({ success: false, error: connectionErrorMessage(error) }, { status: 400 })
  }
}
