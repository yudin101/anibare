import { createDecipheriv, createHash } from "crypto";

export function decryptTobeparsed(tobeparsed: string): string {
  // derive key: SHA256 of the hardcoded secret
  const key = createHash("sha256").update("Xot36i3lK3:v1").digest();

  // decode base64 to bytes
  const buf = Buffer.from(tobeparsed, "base64");

  // byte 0 is skipped, bytes 1-12 are the IV
  const iv = buf.subarray(1, 13);

  // append 00000002 to IV to get the counter
  const ctr = Buffer.alloc(16);
  iv.copy(ctr, 0);
  ctr.writeUInt32BE(2, 12);

  // ciphertext is from byte 13, strip last 16 bytes (auth tag / padding)
  const ct = buf.subarray(13, buf.length - 16);

  const decipher = createDecipheriv("aes-256-ctr", key, ctr);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString(
    "utf8",
  );
}
