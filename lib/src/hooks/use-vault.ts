import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { useVaultConfig } from '../config/vault-context';
import { decrypt, encrypt } from '../crypto/crypto';
import type { VaultEntry, VaultOptions } from '../types/vault.types';
import { isBrowser, parseDuration } from '../utils/is-browser';

export function useVault<T>(
  key: string,
  defaultValue: T,
  options?: VaultOptions
): [T, Dispatch<SetStateAction<T>>] {
  const config = useVaultConfig();
  const storageKey = config.prefix + key;
  const [value, setValue] = useState<T>(defaultValue);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const expiresAtRef = useRef<number | undefined>(undefined);
  const isFirstRunRef = useRef(true);
  const suppressPersistRef = useRef(false);

  const getStorage = (): Storage => (config.driver === 'session' ? window.sessionStorage : window.localStorage);

  const readEntry = (): VaultEntry<T> | undefined => {
    const raw = getStorage().getItem(storageKey);
    if (!raw) {
      return undefined;
    }
    try {
      return JSON.parse(decrypt(raw, config.encryptionKey)) as VaultEntry<T>;
    } catch {
      return undefined;
    }
  };

  const persist = (next: T, expiresAt: number | undefined): void => {
    const entry: VaultEntry<T> = expiresAt === undefined ? { value: next } : { value: next, expiresAt };
    getStorage().setItem(storageKey, encrypt(JSON.stringify(entry), config.encryptionKey));
  };

  const scheduleExpiry = (expiresAt: number | undefined, onExpire: () => void): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    if (expiresAt === undefined) {
      return;
    }
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      onExpire();
      return;
    }
    timerRef.current = setTimeout(onExpire, remaining);
  };

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;

      const stored = readEntry();
      const expired = stored?.expiresAt !== undefined && Date.now() >= stored.expiresAt;

      if (expired) {
        getStorage().removeItem(storageKey);
      }

      const expireNow = (): void => {
        suppressPersistRef.current = true;
        getStorage().removeItem(storageKey);
        expiresAtRef.current = undefined;
        setValue(defaultValue);
      };

      if (stored && !expired) {
        expiresAtRef.current = stored.expiresAt;

        if (stored.value !== value) {
          suppressPersistRef.current = true;
          setValue(stored.value);
        }
      }

      scheduleExpiry(expiresAtRef.current, expireNow);
      return;
    }

    if (suppressPersistRef.current) {
      suppressPersistRef.current = false;
      return;
    }

    expiresAtRef.current = options?.expiresIn ? Date.now() + parseDuration(options.expiresIn) : undefined;

    const expireNow = (): void => {
      suppressPersistRef.current = true;
      getStorage().removeItem(storageKey);
      expiresAtRef.current = undefined;
      setValue(defaultValue);
    };

    persist(value, expiresAtRef.current);
    scheduleExpiry(expiresAtRef.current, expireNow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return [value, setValue];
}
