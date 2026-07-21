import assert from 'node:assert/strict'
import { encryptSecret } from '../lib/crypto'
import { imageBytesFromResult } from '../lib/ai/image-generator'
import { ensureArticleHtml, parseGeneratedNewsArticle } from '../lib/ai/news-generator'
import { injectRelatedPostLinks } from '../lib/ai/internal-linking'
import {
  buildOpenAiContentRequest,
  extractOpenAiText,
  normalizeHttpsBaseUrl,
  requestOpenAiWithConfig,
  resolveOpenAiConfig,
  resolveOpenAiImageConfig,
} from '../lib/ai/openai-client'

process.env.AI_SETTINGS_SECRET = 'test-ai-settings-secret-that-is-long-enough'
const setting = {
  apiKeyEncrypted: encryptSecret('content-db-key'),
  imageApiKeyEncrypted: encryptSecret('image-db-key'),
  baseUrl: 'https://db-content.example/v1',
  wireApi: 'responses',
  reasoningEffort: 'high',
  textModel: 'gpt-5.5',
  maxOutputTokens: 4096,
  imageBaseUrl: 'https://db-images.example/v1',
  imageModel: 'gpt-image-2',
  imageQuality: 'high',
} as Parameters<typeof resolveOpenAiConfig>[0]

const content = resolveOpenAiConfig(setting, {
  OPENAI_API_KEY: 'env-content-key',
  OPENAI_BASE_URL: 'https://env-content.example/v1',
  OPENAI_WIRE_API: 'chat_completions',
  OPENAI_MODEL: 'env-model',
  OPENAI_MAX_TOKENS: '8',
})
assert.equal(content.apiKey, 'content-db-key')
assert.equal(content.baseUrl, 'https://db-content.example/v1')
assert.equal(content.wireApi, 'responses')
assert.equal(content.maxTokens, 4096)

const envOnly = resolveOpenAiConfig(null, {
  OPENAI_API_KEY: 'env-content-key',
  OPENAI_BASE_URL: 'https://env-content.example/v1',
  OPENAI_WIRE_API: 'chat_completions',
  OPENAI_MODEL: 'env-model',
  OPENAI_MAX_TOKENS: '8',
})
assert.equal(envOnly.apiKey, 'env-content-key')
assert.equal(envOnly.baseUrl, 'https://env-content.example/v1')
assert.equal(envOnly.model, 'env-model')
assert.equal(envOnly.maxTokens, 8)

const image = resolveOpenAiImageConfig(setting, {
  OPENAI_IMAGE_API_KEY: 'env-image-key',
  OPENAI_IMAGE_BASE_URL: 'https://env-images.example/v1',
  OPENAI_IMAGE_MODEL: 'env-image-model',
  OPENAI_IMAGE_QUALITY: 'low',
})
assert.equal(image.apiKey, 'image-db-key')
assert.equal(image.baseUrl, 'https://db-images.example/v1')
assert.equal(image.model, 'gpt-image-2')
assert.equal(image.quality, 'high')
assert.equal(resolveOpenAiImageConfig(null, { OPENAI_API_KEY: 'content-only-key' }).apiKey, null)

const chatRequest = buildOpenAiContentRequest({
  wireApi: 'chat_completions',
  model: 'gpt-5.5',
  reasoningEffort: 'high',
  maxTokens: 4096,
}, { instructions: 'system', input: 'user', maxOutputTokens: 32, text: { format: { type: 'json_object' } } })
assert.equal(chatRequest.path, '/chat/completions')
assert.deepEqual(chatRequest.body, {
  model: 'gpt-5.5',
  messages: [{ role: 'system', content: 'system' }, { role: 'user', content: 'user' }],
  max_tokens: 32,
  response_format: { type: 'json_object' },
})
assert.ok(!('reasoning' in chatRequest.body))
assert.ok(!('store' in chatRequest.body))

const responsesRequest = buildOpenAiContentRequest({
  wireApi: 'responses',
  model: 'gpt-5.5',
  reasoningEffort: 'high',
  maxTokens: 4096,
}, { instructions: 'system', input: 'user' })
assert.equal(responsesRequest.path, '/responses')
assert.deepEqual(responsesRequest.body, {
  model: 'gpt-5.5',
  instructions: 'system',
  input: 'user',
  reasoning: { effort: 'high' },
  max_output_tokens: 4096,
  store: false,
})

async function runHttpTest() {
  let capturedUrl = ''
  let capturedAuthorization = ''
  await requestOpenAiWithConfig(
    { apiKey: 'image-db-key', baseUrl: 'https://api.openai.com/v1' },
    '/images/generations',
    { model: 'gpt-image-2', prompt: 'test' },
    {
      fetchImpl: async (input, init) => {
        capturedUrl = String(input)
        capturedAuthorization = String(new Headers(init?.headers).get('authorization'))
        return new Response(JSON.stringify({ data: [{ b64_json: 'aGVsbG8=' }] }), { status: 200 })
      },
    },
  )
  assert.equal(capturedUrl, 'https://api.openai.com/v1/images/generations')
  assert.equal(capturedAuthorization, 'Bearer image-db-key')
  assert.ok(!capturedAuthorization.includes('content-db-key'))

  const base64Bytes = await imageBytesFromResult({ data: [{ b64_json: 'aGVsbG8=' }] })
  assert.equal(base64Bytes.toString('utf8'), 'hello')
  const urlBytes = await imageBytesFromResult(
    { data: [{ url: 'https://images.example/test.png' }] },
    async () => new Response('image-bytes', { status: 200 }),
  )
  assert.equal(urlBytes.toString('utf8'), 'image-bytes')
}

async function main() {
  assert.throws(() => normalizeHttpsBaseUrl('http://provider.example/v1'))
  assert.equal(extractOpenAiText({ output_text: 'one' }), 'one')
  assert.equal(extractOpenAiText({ output: [{ content: [{ text: 'two' }] }] }), 'two')
  assert.equal(extractOpenAiText({ choices: [{ message: { content: 'three' } }] }), 'three')
  const parsedArticle = parseGeneratedNewsArticle(`Mình sẽ viết bài ngay.\n\`\`\`json\n${JSON.stringify({
    title: 'Bai viet test',
    slug: 'bai-viet-test',
    excerpt: 'Tom tat',
    contentHtml: '<p>Noi dung</p>',
    seoTitle: 'SEO title',
    seoDescription: 'SEO description',
    focusKeywords: ['xe nang'],
    headings: ['Mo dau'],
    imagePrompts: { featured: 'Xe nang', headings: [{ heading: 'Mo dau', prompt: 'Kho hang' }] },
  })}\n\`\`\``)
  assert.equal(parsedArticle.title, 'Bai viet test')
  const formatted = ensureArticleHtml('<p>Mo dau</p><p>Xe nang la thiet bi quan trong.</p>', ['Mo dau'])
  assert.match(formatted, /^<h2>Mo dau<\/h2>/)
  const linked = injectRelatedPostLinks(
    `<p>${'Xe nang '.repeat(140)}xe nang dien.</p><p>${'Bao duong '.repeat(140)}bao duong xe nang.</p>`,
    [{ title: 'Bao duong xe nang dung cach', slug: 'bao-duong-xe-nang' }],
    ['xe nang dien'],
  )
  assert.match(linked, /href="\/tin-tuc\/bao-duong-xe-nang"/)
  await runHttpTest()
  console.log('AI provider config tests passed.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
