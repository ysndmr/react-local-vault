# react-local-vault

Reactive, encrypted browser storage for React — built on hooks, under 2KB gzipped, zero runtime dependencies.

**Also available for:** [Angular](https://github.com/ysndmr/ngx-local-vault) ([npm](https://www.npmjs.com/package/ngx-local-vault) · [demo](https://ysndmr.github.io/ngx-local-vault/)) · [Vue](https://github.com/ysndmr/vue-local-vault) ([npm](https://www.npmjs.com/package/vue-local-vault) · [demo](https://ysndmr.github.io/vue-local-vault/))

Most storage wrappers give you a getter/setter pair and leave persistence, encryption, and expiry as an exercise for the consumer. `react-local-vault` collapses all three into a single hook: read it like `useState`, write it like `useState`, and the library takes care of encrypting the payload, syncing it to `localStorage` or `sessionStorage`, and expiring it on a TTL.

- **Hook-native** — `useVault()` returns the same `[value, setValue]` tuple shape as `useState`
- **Encrypted at rest** — payloads are obfuscated before they ever touch the browser's storage
- **TTL built in** — pass `expiresIn: '1m'` and the entry self-destructs, in-tab, without a reload
- **SSR-safe** — renders the default on first paint, hydrates from storage post-mount (no hydration mismatch)
- **Zero dependencies** — `react` as a peer, nothing else

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

const [theme, setTheme] = useVault<'light' | 'dark'>('theme', 'light');
setTheme('dark');

const [token, setToken] = useVault<string | null>('session-token', null, { expiresIn: '15m' });
setToken('jwt-goes-here');
```

`expiresIn` accepts `ms`, `s`, `m`, `h`, or `d` suffixes — `'500ms'`, `'30s'`, `'15m'`, `'2h'`, `'1d'`.

## Demo

**Live:** https://ysndmr.github.io/react-local-vault/

`demo/` is a live showcase: a theme switcher backed by `useVault()`, and a TTL demo that saves a mock profile, shows the encrypted ciphertext sitting in `localStorage` next to the decrypted reactive value, and lets you watch it auto-delete after 60 seconds.

```bash
npm install
npm run dev
```

This is an npm workspace: `lib/` is the publishable package, `demo/` depends on it via the workspace link. `npm run dev` builds the library once and starts the demo's Vite dev server.

## Publishing (maintainer)

1. Log in to npm once, locally:

   ```bash
   npm login
   ```

2. Build the library:

   ```bash
   npm run build:lib
   ```

3. Dry-run the publish before it's live:

   ```bash
   cd lib
   npm publish --dry-run
   ```

4. If the file list and `package.json` look right, publish for real:

   ```bash
   npm publish --access public
   ```

CI (`.github/workflows/publish.yml`) does this automatically on every push to `main`: it builds the library and the demo app, deploys the demo to GitHub Pages, and publishes to npm if an `NPM_TOKEN` secret is configured on the repository (`Settings → Secrets and variables → Actions`). No token, no publish step — the Pages deploy still runs.

## License

MIT
# react-local-vault
# react-local-vault
