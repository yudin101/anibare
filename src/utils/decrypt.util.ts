import { createDecipheriv, createHash } from "crypto";

export function decryptTobeparsed(tobeparsed: string): string {
  // derive key: SHA256 of the hardcoded secret
  const key = createHash("sha256").update("Xot36i3lK3:v1").digest();

  // decode base64 to bytes
  const buf = Buffer.from(tobeparsed, "base64");

  // buf structure
  // byte 0 = no idea
  // byte 1-12 = IV
  // byte 13 - x = ciphertext
  // last 16 bytes = auth tag

  // byte 0 is skipped, bytes 1-12 are the IV
  const iv = buf.subarray(1, 13);

  // append 00000002 to IV to get the counter
  const ctr = Buffer.alloc(16);
  iv.copy(ctr, 0); // copy IV into counter from IV's zeroth position
  ctr.writeUInt32BE(2, 12); // write 2 in counter after 12 bytes

  // ciphertext is from byte 13, strip last 16 bytes (auth tag)
  const ct = buf.subarray(13, buf.length - 16);

  const decipher = createDecipheriv("aes-256-ctr", key, ctr); // decipher "holds" information regarding next steps for ciphertext

  // update(ct) = decrypt ciphertext
  // final(ct) = check for any remaining bytes and complete the decryption process
  // lastly concatenate both and make it human readable
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString(
    "utf8",
  );
}
