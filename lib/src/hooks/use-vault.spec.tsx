import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { VaultProvider } from '../config/vault-context';
import { useVault } from './use-vault';

function wrapper({ children }: { children: ReactNode }) {
  return <VaultProvider config={{ prefix: 'test_', encryptionKey: 'test-key' }}>{children}</VaultProvider>;
}

describe('useVault', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('persists updates to localStorage, encrypted', () => {
    const { result } = renderHook(() => useVault('theme', 'light'), { wrapper });

    act(() => {
      result.current[1]('dark');
    });

    const raw = localStorage.getItem('test_theme');
    expect(raw).not.toBeNull();
    expect(raw).not.toContain('dark');
  });

  it('hydrates from a previously stored value', () => {
    const { result: first } = renderHook(() => useVault('count', 0), { wrapper });
    act(() => {
      first.current[1](5);
    });

    const { result: second } = renderHook(() => useVault('count', 0), { wrapper });
    expect(second.current[0]).toBe(5);
  });
});
