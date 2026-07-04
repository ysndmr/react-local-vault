export interface VaultConfig {
  prefix: string;
  encryptionKey: string;
  driver: 'local' | 'session';
}

export interface VaultOptions {
  expiresIn?: string;
}

export interface VaultEntry<T> {
  value: T;
  expiresAt?: number;
}
