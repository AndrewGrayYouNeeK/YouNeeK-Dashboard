export interface GhRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  updated_at: string;
  private: boolean;
  open_issues_count: number;
  stargazers_count: number;
  homepage: string | null;
}

export async function fetchRepos(token?: string): Promise<GhRepo[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = token
    ? 'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner'
    : 'https://api.github.com/users/AndrewGrayYouNeeK/repos?per_page=100&sort=updated';

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub ${res.status}: ${detail.slice(0, 180)}`);
  }
  const data = (await res.json()) as GhRepo[];
  return data.sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));
}
