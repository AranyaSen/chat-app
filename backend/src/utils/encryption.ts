import crypto from "crypto";
import { env } from "@/config/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit authentication tag

/**
 * Returns a 32-byte Buffer derived from the hex key in env.
 * Throws clearly if the key is missing or the wrong length.
 */
function getKey(): Buffer {
  const hex = env.MESSAGE_ENCRYPTION_KEY;
  const key = Buffer.from(hex, "hex");
  if (key.length !== 32) {
    throw new Error(
      `MESSAGE_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Got ${key.length} bytes.`,
    );
  }
  return key;
}

/**
 * Encrypts a plaintext string.
 * Returns a single base64-encoded string in the format:
 *   <iv (12 bytes)><authTag (16 bytes)><ciphertext>
 * — stored as one value so the DB column stays a plain VARCHAR/TEXT.
 */
export function encryptMessage(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Layout: [iv | authTag | ciphertext]
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString("base64");
}

/**
 * Decrypts a base64-encoded ciphertext produced by `encryptMessage`.
 * Returns the original plaintext, or throws if the data is tampered / corrupt.
 */
export function decryptMessage(ciphertext: string): string {
  const key = getKey();
  const combined = Buffer.from(ciphertext, "base64");

  if (combined.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error("Invalid ciphertext: too short");
  }

  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  return decipher.update(encrypted) + decipher.final("utf8");
}

