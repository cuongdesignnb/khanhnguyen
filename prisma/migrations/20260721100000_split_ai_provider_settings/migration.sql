ALTER TABLE "AiSetting"
  ADD COLUMN IF NOT EXISTS "baseUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "wireApi" TEXT,
  ADD COLUMN IF NOT EXISTS "reasoningEffort" TEXT,
  ADD COLUMN IF NOT EXISTS "imageApiKeyEncrypted" TEXT,
  ADD COLUMN IF NOT EXISTS "imageApiKeyHint" TEXT,
  ADD COLUMN IF NOT EXISTS "imageBaseUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "imageQuality" TEXT;

ALTER TABLE "AiSetting"
  ALTER COLUMN "textModel" SET DEFAULT 'gpt-5.5',
  ALTER COLUMN "imageModel" SET DEFAULT 'gpt-image-2',
  ALTER COLUMN "maxOutputTokens" SET DEFAULT 4096;

UPDATE "AiSetting"
SET "maxOutputTokens" = GREATEST(1, LEAST(128000, COALESCE("maxOutputTokens", 4096)));

ALTER TABLE "AiSetting"
  DROP CONSTRAINT IF EXISTS "AiSetting_maxOutputTokens_range";

ALTER TABLE "AiSetting"
  ADD CONSTRAINT "AiSetting_maxOutputTokens_range"
  CHECK ("maxOutputTokens" >= 1 AND "maxOutputTokens" <= 128000);
