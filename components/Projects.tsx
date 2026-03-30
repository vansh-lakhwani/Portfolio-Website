'use client'
import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react'
import { GithubIcon } from '@/lib/icons'
import type { GithubRepo } from '@/lib/github'

const USERNAME = 'vansh-lakhwani'

const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' as const },
  }),
}

/** "my-cool-project" → "My Cool Project" */
function formatRepoName(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

interface ProjectsProps {
  repos: GithubRepo[]
}

export default function Projects({ repos }: ProjectsProps) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="py-section px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-14"
        >
          <span className="label-chip mb-4 inline-flex">
            <Code2 size={12} /> Featured Projects
          </span>
          <h2 className="font-heading text-display-sm font-bold mt-3">
            Things I&apos;ve{' '}
            <span className="bg-gradient-to-r from-mint to-mint-dim bg-clip-text text-transparent">
              built
            </span>
          </h2>
          <p className="text-muted mt-3 max-w-lg">
            My recent GitHub projects — sorted by latest activity, fetched live from the API.
          </p>
        </motion.div>

        {/* ── Grid ── */}
        {repos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {repos.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} index={i} inView={inView} />
            ))}
          </div>
        )}

        {/* ── View all on GitHub ── */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={repos.length + 1}
          className="mt-10 text-center"
        >
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex"
          >
            <GithubIcon size={16} /> View all on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Repo Card
// ─────────────────────────────────────────────
function RepoCard({
  repo,
  index,
  inView,
}: {
  repo: GithubRepo
  index: number
  inView: boolean
}) {
  return (
    <motion.article
      variants={FADE_UP}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={index}
      className="glass-card flex flex-col p-5 gap-4 group h-full"
    >
      {/* ── Top row: icon + action links ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-lg bg-mint/10 flex items-center justify-center flex-shrink-0">
          <GithubIcon size={18} className="text-mint" />
        </div>

        <div className="flex items-center gap-2">
          {/* Live demo — only if homepage exists */}
          {repo.homepage && repo.homepage.trim() !== '' && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${formatRepoName(repo.name)} live demo`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium
                         border border-mint/30 text-mint hover:bg-mint/10
                         transition-all duration-200"
            >
              <ExternalLink size={11} /> Live
            </a>
          )}

          {/* GitHub link — always shown */}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${formatRepoName(repo.name)} on GitHub`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium
                       border border-white/10 text-muted hover:text-mint hover:border-mint/30
                       transition-all duration-200"
          >
            <GithubIcon size={12} /> Code
          </a>
        </div>
      </div>

      {/* ── Title ── */}
      <h3 className="font-heading font-semibold text-text group-hover:text-mint transition-colors duration-300 leading-snug">
        {formatRepoName(repo.name)}
      </h3>

      {/* ── Description ── */}
      <p className="text-muted text-sm leading-relaxed flex-1 line-clamp-3">
        {repo.description ?? 'No description provided.'}
      </p>

      {/* ── Topics (purple pills) ── */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span key={topic} className="tech-tag">
              {topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="tech-tag opacity-60">+{repo.topics.length - 4}</span>
          )}
        </div>
      )}

      {/* ── Footer: language + stats ── */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5 text-xs text-muted flex-wrap">
        {/* Primary language — mint badge */}
        {repo.language && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-mint/10 text-mint font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            {repo.language}
          </span>
        )}

        {/* Stars — only if > 0 */}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400/70" />
            {repo.stargazers_count}
          </span>
        )}

        {/* Forks — only if > 0 */}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork size={12} />
            {repo.forks_count}
          </span>
        )}
      </div>
    </motion.article>
  )
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-mint/10 flex items-center justify-center">
        <GithubIcon size={28} className="text-mint/60" />
      </div>
      <div>
        <p className="text-text font-medium mb-1">No projects found</p>
        <p className="text-muted text-sm max-w-sm">
          GitHub API returned no results. Make sure{' '}
          <code className="text-mint bg-mint/10 px-1.5 py-0.5 rounded text-xs">GITHUB_TOKEN</code>{' '}
          is set in <code className="text-mint bg-mint/10 px-1.5 py-0.5 rounded text-xs">.env.local</code>{' '}
          and the username is correct.
        </p>
      </div>
      <a
        href={`https://github.com/${USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost mt-2"
      >
        <GithubIcon size={15} /> View GitHub Profile
      </a>
    </div>
  )
}
