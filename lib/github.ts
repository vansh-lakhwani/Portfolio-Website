export interface GithubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  fork: boolean
}

const GITHUB_API = 'https://api.github.com'
const USERNAME   = process.env.GITHUB_USERNAME ?? ''
const TOKEN      = process.env.GITHUB_TOKEN

function authHeaders(): HeadersInit {
  return TOKEN
    ? { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' }
    : { Accept: 'application/vnd.github+json' }
}

/**
 * Fetch public repos sorted by most recently updated.
 * Excludes forks. Returns top `limit` results.
 */
export async function fetchGithubRepos(limit = 6): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`,
      {
        headers: authHeaders(),
        next: { revalidate: 3600 }, // ISR — refresh every hour
      }
    )

    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}: ${res.statusText}`)
    }

    const repos: GithubRepo[] = await res.json()

    return repos
      .filter((r) => !r.fork)                        // exclude forks
      .sort((a, b) =>                                 // sort by most recently updated
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, limit)
  } catch (err) {
    console.error('[github.ts] fetchGithubRepos error:', err)
    return []
  }
}

// Re-export under old name for backwards compatibility
export const getTopRepos = fetchGithubRepos

// Re-export type alias for backwards compatibility
export type GitHubRepo = GithubRepo

/** Fetch a single repo by name */
export async function getRepo(repoName: string): Promise<GithubRepo | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${USERNAME}/${repoName}`, {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
