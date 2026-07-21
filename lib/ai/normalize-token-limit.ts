export const OPENAI_MIN_OUTPUT_TOKENS = 1;
export const DEFAULT_TEST_OUTPUT_TOKENS = 32;
export const DEFAULT_AI_OUTPUT_TOKENS = 4096;
export const MAX_AI_OUTPUT_TOKENS = 128_000;

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
