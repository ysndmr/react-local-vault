# react-local-vault

Reactive, encrypted browser storage for React — built on hooks, under 2KB gzipped, zero runtime dependencies.

**Live demo:** https://ysndmr.github.io/react-local-vault/
**Source:** https://github.com/ysndmr/react-local-vault
**Also available for:** [Angular](https://github.com/ysndmr/ngx-local-vault) ([npm](https://www.npmjs.com/package/ngx-local-vault) · [demo](https://ysndmr.github.io/ngx-local-vault/)) · [Vue](https://github.com/ysndmr/vue-local-vault) ([npm](https://www.npmjs.com/package/vue-local-vault) · [demo](https://ysndmr.github.io/vue-local-vault/))

## Install

```bash
npm i react-local-vault
```

Supports React `18` and `19`.

## Configure

```tsx
import { VaultProvider } from 'react-local-vault';

function Root() {
  return (
    <VaultProvider config={{ prefix: 'app_', encryptionKey: 'change-me', driver: 'local' }}>
      <App />
    </VaultProvider>
  );
}
```

## Use

```tsx
import { useVault } from 'react-local-vault';

function ThemeToggle() {
  const [theme, setTheme] = useVault<'light' | 'dark'>('theme', 'light');
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme}</button>;
}

function Session() {
  const [token, setToken] = useVault<string | null>('session-token', null, { expiresIn: '15m' });
  return <button onClick={() => setToken('jwt-goes-here')}>Sign in</button>;
}
```

`expiresIn` accepts `ms`, `s`, `m`, `h`, or `d` suffixes — `'500ms'`, `'30s'`, `'15m'`, `'2h'`, `'1d'`.

`useVault` renders `defaultValue` on first paint and hydrates from storage in an effect right after mount — this keeps it safe to use with SSR frameworks (Next.js, Remix) without hydration mismatches.

## License

MIT
