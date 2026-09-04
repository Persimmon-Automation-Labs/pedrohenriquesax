-- Vídeo hospedado aqui precisa de capa própria; o do YouTube já traz a dele.
ALTER TABLE "MediaItem" ADD COLUMN IF NOT EXISTS "poster" TEXT NOT NULL DEFAULT '';
