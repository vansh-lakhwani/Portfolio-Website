'use client'
import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react'
import { GithubIcon } from '@/lib/icons'
import type { GithubRepo } from '@/lib/github'

const USERNAME = 'vansh-lakhwani'

const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
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
      {/* Global masonry CSS (reused from Certificates) */}
      <style>{`
        .projects-masonry {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 768px)  { .projects-masonry { column-count: 2; } }
        @media (min-width: 1024px) { .projects-masonry { column-count: 3; } }
        .projects-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: block;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-14"
        >
          <span className="text-mint text-[13px] font-bold uppercase tracking-[0.2em] font-body mb-3 block">
            Recent Repositories
          </span>
          <h2 className="font-heading text-5xl md:text-6xl font-black tracking-tighter mb-4">
            Featured Projects
          </h2>
          <p className="text-muted max-w-2xl text-lg leading-relaxed mt-3">
            My latest GitHub activity — sorted by most recently updated, fetched live from the API.
          </p>
        </motion.div>

        {/* ── Masonry Grid ── */}
        {repos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="projects-masonry">
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
// Repo Card (CertCard style)
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
      className="projects-item"
    >
      <div
        className="relative p-6 rounded-xl group transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(93,202,165,0.15)',
        }}
      >
        {/* Category-like Header */}
        <div className="flex items-center gap-3 mb-4">
          <GithubIcon size={18} className="text-purple-dim" />
          <span className="text-xs font-bold uppercase tracking-widest text-purple-dim">
            Repository
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-text group-hover:text-mint transition-colors duration-300 mb-2 leading-snug">
          {formatRepoName(repo.name)}
        </h3>

        {/* Date / Status */}
        <div className="flex items-center gap-3 text-xs text-muted mb-4 font-medium">
          {repo.language && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-mint/10 text-mint">
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              {repo.language}
            </span>
          )}
          <span>Updated {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Full Description (No line-clamp) */}
        <p className="text-muted text-sm mb-6 leading-relaxed">
          {repo.description ?? 'No description provided.'}
        </p>

        {/* Stats row (replaces topics if preferred, or add below) */}
        <div className="flex items-center gap-4 mb-6 text-muted">
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <Star size={12} className="text-yellow-400/70" />
              {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <GitFork size={12} />
              {repo.forks_count}
            </span>
          )}
        </div>

        {/* View Code / Live buttons at bottom */}
        <div className="flex flex-col gap-2">
          {/* Live Demo — only if homepage exists */}
          {repo.homepage && repo.homepage.trim() !== '' && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg
                         text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200
                         bg-mint text-on-mint hover:shadow-glow"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}

          {/* GitHub link — always shown */}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg
                       text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200
                       border border-white/10 text-text/80 hover:bg-white/5 hover:border-white/25"
          >
            <GithubIcon size={12} />
            View Repository
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="glass-card p-12 text-center flex flex-col items-center gap-4 border-dashed">
      <div className="w-14 h-14 rounded-xl bg-mint/10 flex items-center justify-center">
        <GithubIcon size={28} className="text-mint/60" />
      </div>
      <div>
        <p className="text-text font-medium mb-1">No repositories found</p>
        <p className="text-muted text-sm max-w-sm">
          GitHub API returned no results. Make sure GITHUB_TOKEN is set.
        </p>
      </div>
    </div>
  )
}
