ALTER TABLE "AiSetting"
ADD COLUMN IF NOT EXISTS "maxOutputTokens" INTEGER NOT NULL DEFAULT 1024;

UPDATE "AiSetting"
SET "maxOutputTokens" = GREATEST(16, LEAST(16384, COALESCE("maxOutputTokens", 1024)));

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'AiSetting_maxOutputTokens_range'
  ) THEN
    ALTER TABLE "AiSetting"
    ADD CONSTRAINT "AiSetting_maxOutputTokens_range"
    CHECK ("maxOutputTokens" >= 16 AND "maxOutputTokens" <= 16384);
  END IF;
END
$migration$;
