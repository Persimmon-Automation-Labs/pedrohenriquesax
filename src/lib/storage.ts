import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { sign, unsign } from "@/lib/crypto";

/**
 * Dois depósitos, por segurança:
 *  - public/  imagens do site (capa, galeria, retrato). Servidas direto.
 *  - private/ arquivos de produto. NUNCA acessíveis por URL pública;
 *             só por link assinado de 15 minutos, e só com pedido pago.
 */
const ROOT = process.env.STORAGE_DIR || "./.storage";
const dirFor = (v: "public" | "private") => path.join(process.cwd(), ROOT, v);

/**
 * Em produção usa S3 (MinIO no servidor); sem S3_BUCKET cai no disco local,
 * que serve para desenvolvimento. O disco do contêiner é efêmero, então
 * produção SEMPRE precisa do S3 configurado.
 */
const S3_BUCKET = process.env.S3_BUCKET;
const s3 = S3_BUCKET
  ? new S3Client({
      region: process.env.S3_REGION || "us-east-1",
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  : null;

const s3Key = (v: "public" | "private", key: string) => `${v}/${key}`;

/** Prefixo do deploy path-mounted, para href cru que o Next não reescreve. */
export const basePath = process.env.NEXT_BASE_PATH || "";

export async function putFile(
  visibility: "public" | "private",
  filename: string,
  data: Buffer,
): Promise<string> {
  const ext = path.extname(filename).slice(0, 10) || "";
  const key = `${randomUUID()}${ext}`;
  if (s3) {
    await s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: s3Key(visibility, key), Body: data }));
    return key;
  }
  const dir = dirFor(visibility);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, key), data);
  return key;
}

export async function readFile(visibility: "public" | "private", key: string): Promise<Buffer> {
  const safe = path.basename(key);
  if (s3) {
    const r = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key(visibility, safe) }));
    return Buffer.from(await r.Body!.transformToByteArray());
  }
  return fs.readFile(path.join(dirFor(visibility), safe));
}

export async function deleteFile(visibility: "public" | "private", key: string) {
  const safe = path.basename(key);
  try {
    if (s3) await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: s3Key(visibility, safe) }));
    else await fs.unlink(path.join(dirFor(visibility), safe));
  } catch {}
}

/** URL pública para imagens do site. */
export const publicUrl = (key: string) => (key ? `/midia/${key}` : "");

/** Link de download assinado, válido por 15 minutos. */
export function signedDownload(orderId: string, fileId: string): string {
  const t = sign({ o: orderId, f: fileId, exp: Date.now() + 15 * 60 * 1000 });
  return `${basePath}/conta/download/${encodeURIComponent(t)}`;
}
export function readDownloadToken(token: string) {
  const p = unsign<{ o: string; f: string; exp: number }>(token);
  if (!p || p.exp < Date.now()) return null;
  return p;
}
