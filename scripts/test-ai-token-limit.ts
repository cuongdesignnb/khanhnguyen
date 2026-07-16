import assert from 'node:assert/strict'
import {
  DEFAULT_AI_OUTPUT_TOKENS,
  normalizeOpenAIOutputTokens,
} from '../lib/ai/normalize-token-limit'

assert.equal(normalizeOpenAIOutputTokens(10), 16)
assert.equal(normalizeOpenAIOutputTokens(16), 16)
assert.equal(normalizeOpenAIOutputTokens(32), 32)
assert.equal(normalizeOpenAIOutputTokens('1024'), 1024)
assert.equal(normalizeOpenAIOutputTokens(undefined), DEFAULT_AI_OUTPUT_TOKENS)
assert.equal(normalizeOpenAIOutputTokens(null), DEFAULT_AI_OUTPUT_TOKENS)
assert.equal(normalizeOpenAIOutputTokens(Number.NaN), DEFAULT_AI_OUTPUT_TOKENS)
assert.equal(normalizeOpenAIOutputTokens(-10), 16)
assert.equal(normalizeOpenAIOutputTokens(1000.9), 1000)
assert.equal(normalizeOpenAIOutputTokens(20_000), 16_384)

console.log('AI token limit tests passed.')
