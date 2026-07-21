import { z } from 'zod'
import { extractOpenAiText, getAiSetting, openAiContentRequest } from './openai-client'
import {
  ARTICLE_FORMAT_REQUIREMENTS,
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

export class GeneratedNewsArticleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeneratedNewsArticleError'
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizedHeading(value: string) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLocaleLowerCase()
}

export function ensureArticleHtml(contentHtml: string, headings: string[] = []) {
  const content = contentHtml.trim()
  if (!content) return ''
  const headingSet = new Map(headings.map((heading, index) => [normalizedHeading(heading), index]))
  const hasBlockMarkup = /<(?:p|h[2-4]|ul|ol|li|blockquote|hr)\b/i.test(content)
  if (!hasBlockMarkup) {
    return content
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const headingIndex = headingSet.get(normalizedHeading(line))
        const tag = headingIndex === undefined ? 'p' : headingIndex === 0 ? 'h2' : 'h3'
        return `<${tag}>${escapeHtml(line)}</${tag}>`
      })
      .join('')
  }

  return content.replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, (full, attributes: string | undefined, innerHtml: string) => {
    const headingIndex = headingSet.get(normalizedHeading(innerHtml))
    if (headingIndex === undefined) return full
    const tag = headingIndex === 0 ? 'h2' : 'h3'
    return `<${tag}${attributes || ''}>${innerHtml}</${tag}>`
  })
}

export function extractJsonObject(raw: string) {
  const text = raw
    .replace(/^\uFEFF/, '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  const start = text.indexOf('{')
  if (start < 0) return text

  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < text.length; index += 1) {
    const character = text[index]
    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }
    if (character === '"') {
      inString = true
    } else if (character === '{') {
      depth += 1
    } else if (character === '}') {
      depth -= 1
      if (depth === 0) return text.slice(start, index + 1)
    }
  }
  return text.slice(start)
}

export function parseGeneratedNewsArticle(raw: string): GeneratedNewsArticle {
  try {
    return articleSchema.parse(JSON.parse(extractJsonObject(raw)))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new GeneratedNewsArticleError('AI tra ve noi dung khong phai JSON hop le. Vui long thu lai.')
    }
    if (error instanceof z.ZodError) {
      throw new GeneratedNewsArticleError('AI tra ve JSON khong dung cau truc bai viet. Vui long thu lai.')
    }
    throw error
  }
}

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
  const prompt = `${interpolatePrompt(setting?.articlePrompt || DEFAULT_ARTICLE_PROMPT, {
    keyword,
    language: input.language || setting?.defaultLanguage || 'Tiếng Việt',
    wordCount: input.wordCount || setting?.defaultWordCount || 1500,
    tone: input.tone || setting?.defaultTone || 'Chuyên gia tư vấn xe nâng, dễ hiểu, bán hàng nhẹ',
  })}\n\n${ARTICLE_FORMAT_REQUIREMENTS}`
  const response = await openAiContentRequest<{ output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }>; choices?: unknown[] }>({
    model: input.textModel || setting?.textModel || undefined,
    instructions: setting?.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    input: prompt,
    text: { format: { type: 'json_object' } },
    maxOutputTokens: setting?.maxOutputTokens,
  })
  const raw = extractOpenAiText(response).trim()
  if (!raw) throw new Error('OpenAI không trả về nội dung bài viết')
  const parsed = parseGeneratedNewsArticle(raw)
  return { ...parsed, contentHtml: sanitizeHtml(ensureArticleHtml(parsed.contentHtml, parsed.headings)) }
}
