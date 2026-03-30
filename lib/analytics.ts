/**
 * Lightweight resume download analytics.
 * Logs to console in dev, sends to any analytics provider in prod.
 * To hook into Google Analytics, Plausible, or similar, add your
 * tracking call inside the `if (typeof window !== 'undefined')` block.
 */
export function trackResumeDownload(source: 'hero' | 'navbar' | 'navbar-mobile' | 'footer') {
  const event = {
    event: 'resume_download',
    source,
    timestamp: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
  }

  // Dev: always log to console
  console.info('[Analytics] Resume downloaded:', event)

  if (typeof window === 'undefined') return

  // ── Google Analytics 4 (uncomment if you add GA) ──────────────
  // if (typeof window.gtag === 'function') {
  //   window.gtag('event', 'resume_download', { source })
  // }

  // ── Plausible (uncomment if you add Plausible) ──────────────────
  // if (typeof window.plausible === 'function') {
  //   window.plausible('Resume Download', { props: { source } })
  // }

  // ── Fallback: store count in localStorage for a rough local counter ──
  try {
    const key = 'resume_download_count'
    const current = parseInt(localStorage.getItem(key) ?? '0', 10)
    localStorage.setItem(key, String(current + 1))
    console.info(`[Analytics] Total resume downloads this session: ${current + 1}`)
  } catch {
    // localStorage might be blocked in private browsing — that's fine
  }
}
