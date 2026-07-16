export const OPENAI_MIN_OUTPUT_TOKENS = 16;
export const DEFAULT_TEST_OUTPUT_TOKENS = 32;
export const DEFAULT_AI_OUTPUT_TOKENS = 1024;
export const MAX_AI_OUTPUT_TOKENS = 16_384;

function clampOutputTokens(value: number) {
  return Math.min(
    MAX_AI_OUTPUT_TOKENS,
    Math.max(OPENAI_MIN_OUTPUT_TOKENS, Math.floor(value)),
  );
}

export function normalizeOpenAIOutputTokens(
  value: unknown,
  fallback = DEFAULT_AI_OUTPUT_TOKENS,
): number {
  const parsedFallback = Number(fallback);
  const safeFallback = Number.isFinite(parsedFallback)
    ? clampOutputTokens(parsedFallback)
    : DEFAULT_AI_OUTPUT_TOKENS;

  if (value === null || value === undefined || value === "") {
    return safeFallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return safeFallback;
  }

  return clampOutputTokens(parsed);
}
