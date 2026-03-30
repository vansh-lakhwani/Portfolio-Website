'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Calendar, Clock, Video, Globe, Lock } from 'lucide-react'

// ── Animation variants ────────────────────────────────────────────────────────
const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

// ── Session types ─────────────────────────────────────────────────────────────
const SESSION_TYPES = [
  { label: 'Intro Call',            duration: '30 min' },
  { label: 'Technical Discussion',  duration: '45 min' },
]

// ── What to expect items ──────────────────────────────────────────────────────
const EXPECT_ITEMS = [
  {
    icon: Clock,
    title: '30-min intro',
    desc: 'Quick sync to understand your project needs and how I can help.',
  },
  {
    icon: Video,
    title: 'Google Meet link',
    desc: 'A unique meeting link will be sent automatically to your email.',
  },
  {
    icon: Globe,
    title: 'IST timezone',
    desc: 'Meetings are scheduled in Indian Standard Time (UTC+5:30).',
  },
]

export default function Scheduler() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const calUsername  = process.env.NEXT_PUBLIC_CALCOM_USERNAME ?? 'vansh-lakhwani'
  const [activeSession, setActiveSession] = useState(0)
  const [iframeMounted, setIframeMounted] = useState(false)

  // Only mount the cal.com iframe once the section is in view
  useEffect(() => {
    if (inView && !iframeMounted) setIframeMounted(true)
  }, [inView, iframeMounted])

  return (
    <section id="scheduler" className="py-section px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header (left-aligned like Stitch) ── */}
        <motion.header
          variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-14"
        >
          <span className="label-chip mb-4 inline-flex">
            <Calendar size={12} />
            Book a Call
          </span>
          <h2 className="font-heading text-5xl md:text-6xl font-bold tracking-tighter mt-4 mb-4">
            Schedule a Meeting
          </h2>
          <p className="text-muted text-xl max-w-2xl">
            Pick a time that works for you. Let&apos;s discuss system architecture,
            backend scalability, or potential collaborations.
          </p>
        </motion.header>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ─── LEFT: Info column (5 cols) ─── */}
          <motion.div
            variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}
            className="lg:col-span-5 space-y-8"
          >
            {/* Session type pills */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-purple/80 font-body">
                Select Session Type
              </h3>
              <div className="flex flex-wrap gap-3">
                {SESSION_TYPES.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setActiveSession(i)}
                    className={`
                      px-5 py-2.5 rounded-full text-sm font-medium
                      flex items-center gap-2 transition-all duration-200
                      ${activeSession === i
                        ? 'bg-mint/20 text-mint border border-mint/30'
                        : 'border border-white/10 text-muted hover:border-purple/40 hover:text-purple transition-colors'
                      }
                    `}
                  >
                    {s.label}
                    <span className="text-xs opacity-70">— {s.duration}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* What to expect */}
            <div
              className="glass-card p-8"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(93,202,165,0.05)' }}
            >
              <h3 className="font-heading text-2xl font-bold mb-6 text-text">What to expect</h3>
              <ul className="space-y-6">
                {EXPECT_ITEMS.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <Icon size={22} className="text-mint shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text">{title}</p>
                      <p className="text-sm text-muted mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability badge */}
            <div
              className="p-6 rounded-xl border"
              style={{
                background: 'rgba(22,27,43,0.8)',
                borderColor: 'rgba(61,73,68,0.3)',
              }}
            >
              <div className="flex items-center gap-3 mb-1.5">
                {/* Pulsing green dot */}
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-70" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-mint" />
                </span>
                <span className="font-bold text-text">Next available: Monday</span>
              </div>
              <p className="text-sm text-muted ml-6">Standard hours: Mon–Fri, 10am–6pm IST</p>
            </div>
          </motion.div>

          {/* ─── RIGHT: Calendar column (7 cols) ─── */}
          <motion.div
            variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={2}
            className="lg:col-span-7"
          >
            <div className="relative group">
              {/* Main calendar container */}
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  background: '#090e1c',
                  borderColor: 'rgba(122,230,192,0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(93,202,165,0.05)',
                  minHeight: 560,
                }}
              >
                {/* Gradient blobs (background decoration) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-10" aria-hidden="true">
                  <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-mint blur-[60px]" />
                  <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-purple blur-[60px]" />
                </div>

                {/* Cal.com iframe — only mounted once section enters viewport */}
                {iframeMounted ? (
                  <iframe
                    src={`https://cal.com/${calUsername}?embed=true&theme=dark&brandColor=%235DCAA5&hideBranding=1`}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    title="Book a call with Vansh"
                    className="w-full relative z-10"
                    style={{ colorScheme: 'dark', background: 'transparent', display: 'block' }}
                  />
                ) : (
                  <div
                    className="w-full flex items-center justify-center relative z-10"
                    style={{ height: 600 }}
                  >
                    <div className="flex flex-col items-center gap-3 text-muted">
                      <Calendar size={32} className="text-mint/40" />
                      <span className="text-sm">Loading calendar…</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Powered by + Secure footer */}
              <div className="mt-4 flex justify-between items-center text-xs text-muted font-body uppercase tracking-widest px-1">
                <span>Powered by Cal.com</span>
                <span className="flex items-center gap-1.5">
                  <Lock size={11} />
                  Secure Connection
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
