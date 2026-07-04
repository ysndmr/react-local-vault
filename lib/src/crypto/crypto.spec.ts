import { describe, expect, it } from 'vitest';
import { decrypt, encrypt } from './crypto';

describe('crypto', () => {
  it('round-trips a value through encrypt/decrypt', () => {
    const encrypted = encrypt('hello world', 'secret-key');
    expect(encrypted).not.toContain('hello world');
    expect(decrypt(encrypted, 'secret-key')).toBe('hello world');
  });

  it('produces ciphertext that does not match the plaintext', () => {
    const encrypted = encrypt('{"token":"abc123"}', 'k');
    expect(encrypted.includes('abc123')).toBe(false);
  });
});
