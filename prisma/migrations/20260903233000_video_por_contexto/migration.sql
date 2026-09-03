-- Vídeos endereçados ao público que servem, em vez de uma página de mídia só.
DO $$ BEGIN
  CREATE TYPE "MediaContext" AS ENUM ('eventos', 'jazz', 'estudo');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "MediaItem" ADD COLUMN IF NOT EXISTS "context" "MediaContext" NOT NULL DEFAULT 'jazz';
ALTER TABLE "MediaItem" ADD COLUMN IF NOT EXISTS "credit" TEXT NOT NULL DEFAULT '';
ALTER TABLE "MediaItem" ADD COLUMN IF NOT EXISTS "year" TEXT NOT NULL DEFAULT '';
ALTER TABLE "MediaItem" ADD COLUMN IF NOT EXISTS "duration" TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS "MediaItem_context_sortOrder_idx" ON "MediaItem"("context", "sortOrder");
