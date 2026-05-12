import * as crypto from "crypto";

const SECRET = process.env.FILE_SECRET;

if (!SECRET) {
  throw new Error("FILE_SECRET is not defined in environment variables");
}

// Derive a proper 32-byte key using SHA-256
function getKey(): Buffer {
  return crypto.createHash("sha256").update(SECRET).digest();
}

// Create a deterministic IV from the input (safe for file token use case)
function getIv(): Buffer {
  // 16 bytes IV required for AES
  return Buffer.alloc(16, 0);
}

export function encryptFilePath(filePath: string): string {
  if (!filePath) {
    throw new Error("filePath is required for encryption");
  }

  const key = getKey();
  const iv = getIv();

  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(filePath, "utf8"),
    cipher.final(),
  ]);

  // safer for URLs than hex
  return encrypted.toString("base64url");
}

export function decryptFilePath(token: string): string {
  if (!token) {
    throw new Error("Token is required for decryption");
  }

  try {
    const key = getKey();
    const iv = getIv();

    const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(token, "base64url")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (err) {
    throw new Error("Invalid or corrupted file token");
  }
}