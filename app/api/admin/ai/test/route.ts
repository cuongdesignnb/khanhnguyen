import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { getAiSetting, openAiRequest } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  try {
    const setting = await getAiSetting()
    const response = await openAiRequest<{ output?: unknown[] }>('/responses', {
      model: setting?.textModel || 'gpt-5.4-mini',
      input: 'Chỉ trả lời: OK',
      max_output_tokens: 10,
    })
    return Response.json({ success: true, data: { connected: Boolean(response.output?.length) } })
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Không thể kết nối OpenAI' }, { status: 400 })
  }
}
