/**
 * Pix BR Code (EMV MPM) — gerado inteiramente no servidor a partir da chave que o
 * Pedro cadastra no painel. Sem API externa, sem gateway, sem taxa.
 *
 * Layout de chave estática com valor e txid, que é o formato mais amplamente
 * aceito pelos aplicativos bancários:
 *   00 Payload Format Indicator     "01"
 *   26 Merchant Account Information  { 00: br.gov.bcb.pix, 01: <chave> }
 *   52 Merchant Category Code        "0000"
 *   53 Transaction Currency          "986" (BRL)
 *   54 Transaction Amount            "150.00"
 *   58 Country Code                  "BR"
 *   59 Merchant Name                 <= 25 chars
 *   60 Merchant City                 <= 15 chars
 *   62 Additional Data               { 05: <txid> }
 *   63 CRC16                         CRC16/CCITT-FALSE sobre tudo + "6304"
 *
 * O campo 01 (Point of Initiation) é omitido de propósito: chave estática.
 */

/** Remove acentos e caracteres fora do ASCII imprimível, e coloca em caixa alta. */
function sanitize(input: string, max: number): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, max);
}

/** Um campo EMV: id + comprimento em 2 dígitos + valor. */
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

/** CRC16/CCITT-FALSE: poly 0x1021, init 0xFFFF, sem reflexão, sem xor final. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export type PixInput = {
  key: string;
  merchantName: string;
  merchantCity: string;
  amountCents: number;
  txid: string;
};

export function buildPixPayload({ key, merchantName, merchantCity, amountCents, txid }: PixInput): string {
  const cleanKey = key.trim();
  if (!cleanKey) throw new Error("Chave Pix não configurada");

  // txid: alfanumérico, até 25, sem espaço. Serve de referência no extrato.
  const cleanTxid = sanitize(txid, 25).replace(/[^A-Z0-9]/g, "") || "***";
  const amount = (amountCents / 100).toFixed(2);

  const merchantAccount = tlv("00", "br.gov.bcb.pix") + tlv("01", cleanKey);

  const body =
    tlv("00", "01") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", amount) +
    tlv("58", "BR") +
    tlv("59", sanitize(merchantName, 25) || "PEDRO LUCENA") +
    tlv("60", sanitize(merchantCity, 15) || "SAO PAULO") +
    tlv("62", tlv("05", cleanTxid));

  const toCheck = `${body}6304`;
  return `${toCheck}${crc16(toCheck)}`;
}

/** Confere se um payload tem CRC válido. Usado nos testes de verificação. */
export function verifyPixPayload(payload: string): boolean {
  if (payload.length < 8) return false;
  const body = payload.slice(0, -4);
  const given = payload.slice(-4);
  return crc16(body) === given.toUpperCase();
}
