import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { getAiSetting, openAiResponsesRequest, OpenAiRequestError } from '@/lib/ai/openai-client'
import { DEFAULT_TEST_OUTPUT_TOKENS } from '@/lib/ai/normalize-token-limit'

function connectionErrorMessage(error: unknown) {
  if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return 'Kết nối OpenAI quá thời gian chờ. Vui lòng kiểm tra mạng hoặc thử lại.'
  }
  if (error instanceof OpenAiRequestError) {
    const details = `${error.code || ''} ${error.type || ''} ${error.message}`.toLowerCase()
    if (error.status === 401 || details.includes('invalid_api_key')) return 'API key OpenAI không hợp lệ hoặc đã hết quyền truy cập.'
    if (details.includes('max_output_tokens') || details.includes('minimum value')) return 'Giới hạn token không hợp lệ. OpenAI yêu cầu tối thiểu 16 token.'
    if (details.includes('model_not_found') || details.includes('does not exist') || error.status === 404) return 'Model đã chọn không tồn tại hoặc tài khoản chưa được cấp quyền.'
    if (details.includes('insufficient_quota') || details.includes('quota') || error.status === 429) return 'Tài khoản OpenAI đã hết hạn mức hoặc chưa thiết lập thanh toán.'
  }
  return 'Không thể kết nối đến OpenAI. Vui lòng thử lại.'
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const setting = await getAiSetting()
    const response = await openAiResponsesRequest<{ output?: unknown[] }>({
      model: setting?.textModel || 'gpt-5.4-mini',
      input: 'Trả lời chính xác một từ: OK',
      maxOutputTokens: DEFAULT_TEST_OUTPUT_TOKENS,
    }, { timeoutMs: 25_000 })
    return Response.json({ success: true, data: { connected: Boolean(response.output?.length) } })
  } catch (error) {
    return Response.json({ success: false, error: connectionErrorMessage(error) }, { status: 400 })
  }
}
