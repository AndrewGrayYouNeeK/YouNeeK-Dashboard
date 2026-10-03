import { useEffect, useMemo, useState } from 'react';
import styles from './Dashboard.module.css';
import { liveProducts, TOKEN_KEY, type LiveProduct } from '../data/connections';
import { fetchRepos, type GhRepo } from '../lib/github';

interface DashboardProps {
  activePage: string;
}

const pageTitles: Record<string, string> = {
  overview: 'Overview',
  analytics: 'Analytics',
  projects: 'Projects',
  settings: 'Settings',
};

export default function Dashboard({ activePage }: DashboardProps) {
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '');
  const [draft, setDraft] = useState(token);
  const [authed, setAuthed] = useState(Boolean(token));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRepos(token || undefined)
      .then((data) => {
        if (cancelled) return;
        setRepos(data);
        setAuthed(Boolean(token));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'GitHub request failed');
        setRepos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const byName = useMemo(() => {
    const map = new Map<string, GhRepo>();
    for (const repo of repos) map.set(repo.name.toLowerCase(), repo);
    return map;
  }, [repos]);

  const connected = liveProducts.filter((p) => byName.has(p.repo.toLowerCase()));
  const openIssues = repos.reduce((sum, r) => sum + (r.open_issues_count || 0), 0);
  const latest = repos[0];

  function saveToken() {
    const next = draft.trim();
    if (next) localStorage.setItem(TOKEN_KEY, next);
    else localStorage.removeItem(TOKEN_KEY);
    setToken(next);
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>{pageTitles[activePage] ?? 'Dashboard'}</h1>
        <p className={styles.subtitle}>
          {loading ? 'Connecting to GitHub…' : error ? 'GitHub disconnected' : authed ? 'GitHub connected · public + private' : 'GitHub connected · public repos'}
        </p>
      </header>

      {activePage === 'overview' && (
        <div className={styles.grid}>
          <StatCard title="Live products" value={String(liveProducts.length)} change={`${connected.length} matched on GitHub`} positive />
          <StatCard title="Repos" value={loading ? '—' : String(repos.length)} change={authed ? 'owner, incl. private' : 'public only'} positive />
          <StatCard title="Open issues" value={loading ? '—' : String(openIssues)} change={openIssues ? 'across connected repos' : 'clean'} positive={openIssues === 0} />
          <StatCard title="Last push" value={latest ? relTime(latest.pushed_at) : '—'} change={latest ? latest.name : 'waiting'} positive />
          <div className={styles.wide}>
            <ProductStrip products={liveProducts} byName={byName} />
          </div>
          <div className={styles.wide}>
            <RecentActivity repos={repos} />
          </div>
        </div>
      )}

      {activePage === 'analytics' && (
        <div className={styles.grid}>
          <div className={styles.wide}>
            <LanguageChart repos={repos} />
          </div>
          <div className={styles.wide}>
            <ActivityChart repos={repos} />
          </div>
        </div>
      )}

      {activePage === 'projects' && (
        <Projects products={liveProducts} repos={repos} byName={byName} loading={loading} error={error} />
      )}

      {activePage === 'settings' && (
        <Settings
          draft={draft}
          setDraft={setDraft}
          onSave={saveToken}
          authed={authed}
          error={error}
          repoCount={repos.length}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, change, positive }: { title: string; value: string; change: string; positive: boolean }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>{title}</span>
      <span className={styles.cardValue}>{value}</span>
      <span className={positive ? styles.positive : styles.negative}>{change}</span>
    </div>
  );
}

function ProductStrip({ products, byName }: { products: LiveProduct[]; byName: Map<string, GhRepo> }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Connected products</span>
      <div className={styles.strip}>
        {products.map((p) => {
          const repo = byName.get(p.repo.toLowerCase());
          const href = p.url || repo?.homepage || repo?.html_url || `https://github.com/AndrewGrayYouNeeK/${p.repo}`;
          return (
            <a key={p.id} className={styles.pill} href={href} target="_blank" rel="noreferrer">
              <span className={repo ? styles.dotOn : styles.dotOff} />
              {p.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivity({ repos }: { repos: GhRepo[] }) {
  const items = repos.slice(0, 6);
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Recent pushes</span>
      {items.length === 0 ? (
        <p className={styles.muted}>Nothing loaded yet.</p>
      ) : (
        <ul className={styles.activityList}>
          {items.map((repo) => (
            <li key={repo.name} className={styles.activityItem}>
              <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}</a>
              <span className={styles.activityTime}>{relTime(repo.pushed_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguageChart({ repos }: { repos: GhRepo[] }) {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    const lang = repo.language || 'Other';
    counts.set(lang, (counts.get(lang) ?? 0) + 1);
  }
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = rows[0]?.[1] ?? 1;
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Languages across connected repos</span>
      <div className={styles.langList}>
        {rows.map(([lang, n]) => (
          <div key={lang} className={styles.langRow}>
            <span>{lang}</span>
            <div className={styles.langTrack}>
              <div className={styles.langFill} style={{ width: `${(n / max) * 100}%` }} />
            </div>
            <span className={styles.activityTime}>{n}</span>
          </div>
        ))}
        {rows.length === 0 && <p className={styles.muted}>Connect GitHub to see this.</p>}
      </div>
    </div>
  );
}

function ActivityChart({ repos }: { repos: GhRepo[] }) {
  const buckets = Array.from({ length: 12 }, () => 0);
  const now = Date.now();
  for (const repo of repos) {
    const ageDays = (now - +new Date(repo.pushed_at)) / 86400000;
    const idx = Math.min(11, Math.max(0, Math.floor(ageDays / 7)));
    buckets[11 - idx] += 1;
  }
  const max = Math.max(1, ...buckets);
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Pushes by week (older → newer)</span>
      <div className={styles.chart}>
        {buckets.map((n, i) => (
          <div key={i} className={styles.bar} style={{ height: `${(n / max) * 100}%` }} title={`${n} repos`} />
        ))}
      </div>
    </div>
  );
}

function Projects({
  products,
  repos,
  byName,
  loading,
  error,
}: {
  products: LiveProduct[];
  repos: GhRepo[];
  byName: Map<string, GhRepo>;
  loading: boolean;
  error: string | null;
}) {
  const pinned = new Set(products.map((p) => p.repo.toLowerCase()));
  const rest = repos.filter((r) => !pinned.has(r.name.toLowerCase()));
  return (
    <div className={styles.stack}>
      {error && <p className={styles.negative}>{error}</p>}
      <div className={styles.projectGrid}>
        {products.map((p) => {
          const repo = byName.get(p.repo.toLowerCase());
          return <ProjectCard key={p.id} product={p} repo={repo} />;
        })}
      </div>
      <h2 className={styles.section}>Other repos {loading ? '' : `· ${rest.length}`}</h2>
      <div className={styles.projectGrid}>
        {rest.map((repo) => (
          <a key={repo.name} className={styles.project} href={repo.html_url} target="_blank" rel="noreferrer">
            <div className={styles.projectTop}>
              <strong>{repo.name}</strong>
              <span className={styles.kind}>{repo.private ? 'private' : repo.language || 'repo'}</span>
            </div>
            <p>{repo.description || 'No description'}</p>
            <span className={styles.activityTime}>pushed {relTime(repo.pushed_at)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ product, repo }: { product: LiveProduct; repo?: GhRepo }) {
  const href = product.url || repo?.homepage || repo?.html_url || `https://github.com/AndrewGrayYouNeeK/${product.repo}`;
  const repoHref = repo?.html_url || `https://github.com/AndrewGrayYouNeeK/${product.repo}`;
  return (
    <div className={styles.project}>
      <div className={styles.projectTop}>
        <strong>{product.name}</strong>
        <span className={repo ? styles.kindOn : styles.kind}>{repo ? 'connected' : 'missing'}</span>
      </div>
      <p>{repo?.description || product.blurb}</p>
      <div className={styles.links}>
        <a href={href} target="_blank" rel="noreferrer">Open</a>
        <a href={repoHref} target="_blank" rel="noreferrer">{product.repo}</a>
        <span className={styles.activityTime}>{repo ? relTime(repo.pushed_at) : product.kind}</span>
      </div>
    </div>
  );
}

function Settings({
  draft,
  setDraft,
  onSave,
  authed,
  error,
  repoCount,
}: {
  draft: string;
  setDraft: (v: string) => void;
  onSave: () => void;
  authed: boolean;
  error: string | null;
  repoCount: number;
}) {
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>GitHub</span>
      <p className={styles.muted}>
        Public repos for AndrewGrayYouNeeK are already connected ({repoCount} loaded).
        Paste a personal access token to also pull private repos (the-architects, agent-world). It stays in this browser only.
      </p>
      <label className={styles.label}>
        Token
        <input
          className={styles.input}
          type="password"
          value={draft}
          placeholder="github_pat_…"
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
        />
      </label>
      <div className={styles.links}>
        <button className={styles.button} onClick={onSave}>Save and reconnect</button>
        <span className={authed ? styles.positive : styles.activityTime}>{authed ? 'Token saved' : 'Public only'}</span>
      </div>
      {error && <p className={styles.negative}>{error}</p>}
    </div>
  );
}

function relTime(iso: string) {
  const diff = Date.now() - +new Date(iso);
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}
