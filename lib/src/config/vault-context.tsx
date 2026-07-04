import { createContext, useContext, type ReactNode } from 'react';
import type { VaultConfig } from '../types/vault.types';

export const DEFAULT_VAULT_CONFIG: VaultConfig = {
  prefix: 'vault_',
  encryptionKey: 'react-local-vault',
  driver: 'local'
};

const VaultConfigContext = createContext<VaultConfig>(DEFAULT_VAULT_CONFIG);

export interface VaultProviderProps {
  config?: Partial<VaultConfig>;
  children: ReactNode;
}

export function VaultProvider({ config, children }: VaultProviderProps) {
  const value: VaultConfig = { ...DEFAULT_VAULT_CONFIG, ...config };
  return <VaultConfigContext.Provider value={value}>{children}</VaultConfigContext.Provider>;
}

export function useVaultConfig(): VaultConfig {
  return useContext(VaultConfigContext);
}
