import { useEffect, useState, type FormEvent } from 'react';
import { useVault } from 'react-local-vault';
import './App.css';

interface DemoProfile {
  name: string;
  token: string;
}

function readRawStorage(): string {
  return localStorage.getItem('demo_profile') ?? 'empty — nothing saved yet';
}

export function App() {
  const [theme, setTheme] = useVault<'light' | 'dark'>('theme', 'light');
  const [profile, setProfile] = useVault<DemoProfile | null>('profile', null, { expiresIn: '1m' });

  const [nameInput, setNameInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [rawStorage, setRawStorage] = useState(readRawStorage());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (profile === null) {
      setSavedAt(null);
    }
  }, [profile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      setRawStorage(readRawStorage());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const secondsLeft = savedAt === null ? 0 : Math.max(60 - Math.floor((now - savedAt) / 1000), 0);

  function toggleTheme(): void {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  function saveProfile(event: FormEvent): void {
    event.preventDefault();
    const name = nameInput.trim();
    const token = tokenInput.trim();
    if (!name || !token) {
      return;
    }
    setProfile({ name, token });
    setSavedAt(Date.now());
    setNameInput('');
    setTokenInput('');
  }

  return (
    <main className="page">
      <header className="topbar">
        <span className="brand">react-local-vault</span>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <section className="hero">
        <p className="eyebrow">&lt; 2KB gzipped · zero dependencies · SSR-safe</p>
        <h1>Reactive, encrypted browser storage for React.</h1>
        <p className="lede">
          react-local-vault wraps localStorage and sessionStorage in a hook. Read it, write it,
          forget about persistence — encryption and TTL expiry happen automatically.
        </p>
      </section>

      <section className="demo-grid">
        <article className="card">
          <h2>01 — Reactive theme switcher</h2>
          <p className="dim">
            Backed by <code>useVault('theme', 'light')</code>. Refresh the page — the theme
            sticks.
          </p>
          <button type="button" className="primary" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
          <p className="current-value">
            Current value: <strong>{theme}</strong>
          </p>
        </article>

        <article className="card">
          <h2>02 — Secure data with TTL</h2>
          <p className="dim">Save a mock profile. It's encrypted at rest and self-destructs after 60 seconds.</p>

          <form className="profile-form" onSubmit={saveProfile}>
            <input
              type="text"
              placeholder="Name"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
            />
            <input
              type="text"
              placeholder="Token"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
            />
            <button type="submit" className="primary">
              Save with 60s TTL
            </button>
          </form>

          {profile ? (
            <div className="profile-live">
              <p className="dim">Decrypted, reactive value your app sees:</p>
              <pre className="code-block">{JSON.stringify(profile, null, 2)}</pre>
              <p className="countdown">Expires in {secondsLeft}s</p>
            </div>
          ) : (
            <p className="dim">No active session.</p>
          )}

          <div className="raw-view">
            <p className="dim">Raw localStorage['demo_profile']:</p>
            <pre className="code-block cipher">{rawStorage}</pre>
          </div>
        </article>
      </section>

      <section className="snippets">
        <h2>The entire API</h2>
        <pre className="code-block">{"<VaultProvider config={{ prefix: 'app_', encryptionKey: 'my-secret' }}>"}</pre>
        <pre className="code-block">{"const [theme, setTheme] = useVault('theme', 'light');\nsetTheme('dark');"}</pre>
        <pre className="code-block">{"const [token] = useVault('token', null, { expiresIn: '1m' });"}</pre>
      </section>

      <footer className="footer">
        <p>MIT licensed · Built with React hooks</p>
      </footer>
    </main>
  );
}
