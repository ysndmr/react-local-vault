function xor(bytes: Uint8Array, key: string): Uint8Array {
  const result = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    result[i] = bytes[i]! ^ key.charCodeAt(i % key.length);
  }
  return result;
}

export function encrypt(value: string, key: string): string {
  const bytes = new TextEncoder().encode(value);
  const xored = xor(bytes, key);
  let binary = '';
  for (const byte of xored) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function decrypt(value: string, key: string): string {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const xored = xor(bytes, key);
  return new TextDecoder().decode(xored);
}
