import { z } from 'zod'
import { getAiSetting, openAiRequest } from './openai-client'
import {
  DEFAULT_ARTICLE_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
  interpolatePrompt,
} from './prompts'
import { sanitizeHtml } from '@/lib/sanitize-html'

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1),
  excerpt: z.string(),
  contentHtml: z.string().min(1),
  seoTitle: z.string(),
  seoDescription: z.string(),
  focusKeywords: z.array(z.string()).min(1).max(7),
  headings: z.array(z.string()),
  imagePrompts: z.object({
    featured: z.string(),
    headings: z.array(z.object({ heading: z.string(), prompt: z.string() })),
  }),
})

export type GeneratedNewsArticle = z.infer<typeof articleSchema>

export async function generateNewsArticle(input: {
  keyword: string
  title?: string
  categoryName?: string
  tone?: string
  language?: string
  wordCount?: number
  textModel?: string
}) {
  const setting = await getAiSetting()
  if (setting && !setting.isEnabled) throw new Error('Tính năng AI đang tắt')
  const keyword = (input.title || input.keyword).trim()
  const prompt = interpolatePrompt(setting?.articlePrompt || DEFAULT_ARTICLE_PROMPT, {
    keyword,
    language: input.language || setting?.defaultLanguage || 'Tiếng Việt',
    wordCount: input.wordCount || setting?.defaultWordCount || 1500,
    tone: input.tone || setting?.defaultTone || 'Chuyên gia tư vấn xe nâng, dễ hiểu, bán hàng nhẹ',
  })
  const response = await openAiRequest<{ output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }>('/responses', {
    model: input.textModel || setting?.textModel || 'gpt-5.4-mini',
    instructions: setting?.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    input: prompt,
    text: { format: { type: 'json_object' } },
  })
  let raw = (response.output_text || response.output?.flatMap((item) => item.content || []).map((item) => item.text || '').join('') || '').trim()
  if (!raw) throw new Error('OpenAI không trả về nội dung bài viết')
  raw = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
  const parsed = articleSchema.parse(JSON.parse(raw))
  return { ...parsed, contentHtml: sanitizeHtml(parsed.contentHtml) }
}
