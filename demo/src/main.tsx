import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { VaultProvider } from 'react-local-vault';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VaultProvider config={{ prefix: 'demo_', encryptionKey: 'vault-secret' }}>
      <App />
    </VaultProvider>
  </StrictMode>
);
