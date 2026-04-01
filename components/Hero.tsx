'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Download, Terminal } from 'lucide-react'
import { trackResumeDownload } from '@/lib/analytics'
import SocialButtons from '@/components/SocialButtons'

const FADE = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' as const } }),
}

// Typewriter words that cycle in the hero headline
const TYPEWRITER_WORDS = ['backend logic', 'APIs', 'systems', 'pipelines', 'microservices']

function TypewriterWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % TYPEWRITER_WORDS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="relative inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={TYPEWRITER_WORDS[index]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="bg-gradient-to-r from-mint to-mint-dim bg-clip-text text-transparent inline-block"
        >
          {TYPEWRITER_WORDS[index]}
        </motion.span>
      </AnimatePresence>
      <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-mint/60 to-transparent" />
    </span>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-mint/5 blur-[80px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-purple/5 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-mint/[0.03] blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <div className="flex flex-col gap-6">
          <motion.div variants={FADE} initial="hidden" animate="visible" custom={0}>
            <span className="label-chip">
              <Terminal size={12} />
              Available for Opportunities
            </span>
          </motion.div>

          <motion.h1
            variants={FADE} initial="hidden" animate="visible" custom={1}
            className="font-heading text-display-lg font-bold leading-[1.05] tracking-tight"
          >
            Building the{' '}
            <TypewriterWord />
            {' '}that powers great products.
          </motion.h1>

          <motion.p
            variants={FADE} initial="hidden" animate="visible" custom={2}
            className="text-muted text-lg leading-relaxed max-w-md"
          >
            I&apos;m <span className="text-text font-large">Vansh Lakhwani</span>, a backend
            developer fresher crafting scalable APIs, data pipelines, and server-side systems
            with precision.
          </motion.p>

          <motion.div
            variants={FADE} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              View My Work <ArrowRight size={16} />
            </button>
            <a
              href="/vansh-resume.pdf"
              download="Vansh_Lakhwani_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackResumeDownload('hero')}
              className="resume-btn btn-primary"
            >
              <span className="download-icon"><Download size={16} /></span>
              Download Resume
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={FADE} initial="hidden" animate="visible" custom={4}
            className="flex items-center gap-3 pt-2"
          >
            <span className="text-muted text-xs tracking-wide">Find me on</span>
            <SocialButtons size="md" />
          </motion.div>
        </div>

        {/* Right — animated terminal card */}
        <motion.div
          variants={FADE} initial="hidden" animate="visible" custom={2}
          className="hidden md:block"
        >
          <motion.div
            className="glass-card p-6 font-mono text-sm"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {/* Terminal bar */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-400/70" />
              <span className="ml-4 text-muted text-xs">vansh@portfolio ~ </span>
            </div>
            {/* Lines */}
            <p className="text-muted">$ <span className="text-mint">whoami</span></p>
            <p className="text-text mt-1">Vansh Lakhwani — Backend Developer Fresher</p>
            <p className="text-muted mt-3">$ <span className="text-mint">cat skills.json</span></p>
            <pre className="mt-1 text-xs leading-6 text-text/80">{`{
  "languages": ["Python", "TypeScript", "Java"],
  "frameworks": ["Node.js", "Express", "FastAPI"],
  "databases":  ["PostgreSQL", "MongoDB", "Redis"],
  "cloud":      ["AWS", "Docker", "Vercel"]
}`}</pre>
            <p className="text-muted mt-3">$ <span className="text-mint">git status</span></p>
            <p className="text-green-400 mt-1 text-xs">✓ Open to work — ready to push to production</p>
            <span className="inline-block w-2 h-4 bg-mint/80 animate-pulse mt-2 align-middle" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-muted text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-mint/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
