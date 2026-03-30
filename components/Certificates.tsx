'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { BookOpen, Code2, Trophy, Star, Award, ExternalLink } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Category = 'all' | 'courses' | 'coding' | 'hackathon' | 'award'

interface Certificate {
  id: number
  title: string
  platform: string
  date: string
  category: Exclude<Category, 'all'>
  description?: string
  driveLink?: string
  featured?: boolean
}

// ── Data ──────────────────────────────────────────────────────────────────────
const certificatesData: Certificate[] = [
  {
    id: 1,
    title: 'Complete Node.js Developer Course',
    platform: 'Udemy',
    date: 'Oct 2024',
    category: 'courses',
    description:
      'Mastered backend architecture including REST APIs, GraphQL integration, and async programming with Node.js & Express. 40+ hours of hands-on lab projects.',
    driveLink: 'https://drive.google.com/file/d/1UY9Qs8uNCLjH9mi3lV4eYU4QnGKJVK0_/view?usp=sharing',
    featured: false,
  },
  {
    id: 2,
    title: 'Problem Solving Certificate',
    platform: 'HackerRank',
    date: '2024',
    category: 'coding',
    driveLink: 'https://drive.google.com/file/d/19DhQQXzT5fezl9NLXY02KtbenbdfKLqN/view?usp=sharing',
    featured: false,
  },
  {
    id: 3,
    title: '1st Place — TechFest Hackathon 2024',
    platform: 'VIT University',
    date: 'Jan 2024',
    category: 'hackathon',
    description:
      'Built a scalable Go-based API handling 5k+ requests/min. Integrated real-time data streaming and distributed caching to win first place.',
    driveLink: 'https://drive.google.com/file/d/1mPMSYM1LODaQbP8plXot_-V4uhgWDGkr/view?usp=sharing',
    featured: true,
  },
  {
    id: 4,
    title: 'Advanced SQL Masterclass',
    platform: 'Udemy',
    date: 'Sep 2024',
    category: 'courses',
    driveLink: 'https://drive.google.com/file/d/1mPMSYM1LODaQbP8plXot_-V4uhgWDGkr/view?usp=sharing',
    featured: false,
  },
  {
    id: 5,
    title: 'Best Project Award',
    platform: 'VIT University',
    date: 'May 2024',
    category: 'award',
    description:
      'Recognised for "Outstanding Technical Innovation" in a capstone project focusing on blockchain-based security systems.',
    featured: false,
  },
  {
    id: 6,
    title: '500+ Problems Solved on LeetCode',
    platform: 'LeetCode',
    date: '2024',
    category: 'coding',
    driveLink: 'https://leetcode.com/u/vansh-lakhwani/',
    featured: false,
  },
]

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { number: 12, label: 'Certificates earned' },
  { number: 8,  label: 'Courses completed'   },
  { number: 5,  label: 'Hackathons'           },
  { number: 3,  label: 'Awards won'           },
]

// ── Filter config ─────────────────────────────────────────────────────────────
const FILTERS: { label: string; value: Category }[] = [
  { label: 'All',                value: 'all'       },
  { label: 'Courses',            value: 'courses'   },
  { label: 'Coding & DSA',       value: 'coding'    },
  { label: 'Hackathons & Awards',value: 'hackathon' },
]

// ── Category colour map ───────────────────────────────────────────────────────
const CAT_COLORS: Record<Exclude<Category, 'all'>, { text: string; bg: string; border: string }> = {
  courses:   { text: '#C5C0FF', bg: 'rgba(127,119,221,0.12)', border: 'rgba(127,119,221,0.3)' },
  coding:    { text: '#5DCAA5', bg: 'rgba(93,202,165,0.12)',  border: 'rgba(93,202,165,0.3)'  },
  hackathon: { text: '#EF9F27', bg: 'rgba(239,159,39,0.12)', border: 'rgba(239,159,39,0.3)'  },
  award:     { text: '#ffc6b8', bg: 'rgba(216,90,48,0.12)',  border: 'rgba(216,90,48,0.3)'   },
}

const CAT_LABELS: Record<Exclude<Category, 'all'>, string> = {
  courses:   'Course',
  coding:    'Coding & DSA',
  hackathon: 'Hackathon',
  award:     'Award',
}

// ── Category icon ─────────────────────────────────────────────────────────────
function CatIcon({ cat }: { cat: Exclude<Category, 'all'> }) {
  const color = CAT_COLORS[cat].text
  const cls   = `w-5 h-5 shrink-0`
  if (cat === 'courses')   return <BookOpen   className={cls} style={{ color }} />
  if (cat === 'coding')    return <Code2       className={cls} style={{ color }} />
  if (cat === 'hackathon') return <Trophy      className={cls} style={{ color }} />
  return                          <Star        className={cls} style={{ color }} />
}

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = Math.ceil(target / (duration / 30))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ number, label, active }: { number: number; label: string; active: boolean }) {
  const count = useCountUp(number, active)
  return (
    <div className="text-center">
      <span
        className="block text-5xl md:text-6xl font-black font-heading mb-2"
        style={{ color: '#7ae6c0' }}
      >
        {count}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
    </div>
  )
}

// ── Certificate card ──────────────────────────────────────────────────────────
function CertCard({ item, index }: { item: Certificate; index: number }) {
  const colors  = CAT_COLORS[item.category]
  const isFeatured = item.featured

  const cardVariant: Variants = {
    hidden:  { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.4, delay: index * 0.08, ease: 'easeOut' as const },
    },
  }

  const inner = (
    <div
      className="relative p-6 rounded-xl group transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isFeatured
          ? '1px solid rgba(239,159,39,0.4)'
          : '1px solid rgba(93,202,165,0.15)',
        boxShadow: isFeatured
          ? '0 0 30px rgba(239,159,39,0.08)'
          : undefined,
      }}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div
          className="absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl"
          style={{ background: '#ffb4a2', color: '#3c0700' }}
        >
          Featured
        </div>
      )}

      {/* Category row */}
      <div className="flex items-center gap-3 mb-4">
        <CatIcon cat={item.category} />
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: colors.text }}
        >
          {CAT_LABELS[item.category]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-text mb-2 leading-snug">
        {item.title}
      </h3>

      {/* Platform */}
      <p className="text-mint text-sm font-semibold mb-1">{item.platform}</p>

      {/* Date */}
      <p className="text-muted text-xs mb-4">{item.date}</p>

      {/* Description */}
      {item.description && (
        <p className="text-muted text-sm mb-6 leading-relaxed">{item.description}</p>
      )}

      {/* View Certificate button */}
      {item.driveLink && (
        <div
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg
                      text-xs font-bold uppercase tracking-widest transition-colors duration-200
                      border group-hover:border-mint/50`}
          style={{
            borderColor: 'rgba(93,202,165,0.2)',
            color: '#5DCAA5',
          }}
        >
          <ExternalLink size={12} />
          {item.category === 'coding' && item.platform === 'LeetCode'
            ? 'View Profile'
            : 'View Certificate'}
        </div>
      )}
    </div>
  )

  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="masonry-item"
    >
      {item.driveLink ? (
        <a
          href={item.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {inner}
        </a>
      ) : (
        <div className="h-full">{inner}</div>
      )}
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Certificates() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const statsRef    = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  const [activeFilter, setActiveFilter] = useState<Category>('all')

  const filtered = certificatesData.filter(
    (c) => activeFilter === 'all' || c.category === activeFilter
  )

  return (
    <section id="certificates" className="py-section px-6" ref={ref}>
      {/* Global masonry CSS */}
      <style>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 768px)  { .masonry-grid { column-count: 2; } }
        @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: block;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-14"
        >
          <span className="text-mint text-[13px] font-bold uppercase tracking-[0.2em] font-body mb-3 block">
            What I&apos;ve earned
          </span>
          <h2 className="font-heading text-5xl md:text-6xl font-black tracking-tighter mb-4">
            Certificates &amp; Achievements
          </h2>
          <p className="text-muted max-w-2xl text-lg leading-relaxed">
            Proof of learning, one certificate at a time. A collection of technical
            milestones and competitive successes.
          </p>
        </motion.div>

        {/* ── Filter tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.value
            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: '#5DCAA5',
                        color: '#003829',
                      }
                    : {
                        border: '1px solid rgba(61,73,68,0.8)',
                        color: '#bdcac2',
                        background: 'transparent',
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                {f.label}
              </button>
            )
          })}
        </motion.div>

        {/* ── Masonry grid ── */}
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="masonry-grid"
        >
          {filtered.map((item, i) => (
            <CertCard key={item.id} item={item} index={i} />
          ))}
        </motion.div>

        {/* ── Stats row ── */}
        <div
          ref={statsRef}
          className="mt-20 pt-16 border-t grid grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ borderColor: 'rgba(61,73,68,0.3)' }}
        >
          {STATS.map((s) => (
            <StatCard
              key={s.label}
              number={s.number}
              label={s.label}
              active={statsInView}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
