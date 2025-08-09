import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 bytes
const IV = process.env.ENCRYPTION_IV || 'abcdefghijklmnop'; // 16 bytes

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(KEY, 'utf8'),
    Buffer.from(IV, 'utf8'),
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(KEY, 'utf8'),
    Buffer.from(IV, 'utf8'),
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
