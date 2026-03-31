'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, ArrowRight } from 'lucide-react'
import { trackResumeDownload } from '@/lib/analytics'
import SocialButtons from '@/components/SocialButtons'

// ── Section map ──────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'About',        id: 'hero'         },
  { label: 'Projects',     id: 'projects'     },
  { label: 'Skills',       id: 'skills'       },
  { label: 'Education',    id: 'education'    },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Contact',      id: 'contact'      },
  { label: 'Schedule',     id: 'scheduler'    },
] as const

const RESUME_URL = '/vansh-resume.pdf'

// ── Smooth scroll helper ──────────────────────────────────────────────────────
function scrollTo(id: string, close?: () => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  close?.()
}

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState<string>('hero')
  const overlayRef = useRef<HTMLDivElement>(null)

  // ── Scroll shadow ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Active section via IntersectionObserver ───────────────────────────────
  useEffect(() => {
    const observers = NAV_LINKS.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  // ── Close overlay on outside click ───────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // ── Lock body scroll when mobile menu is open ─────────────────────────────
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      {/* ── Main navbar bar ───────────────────────────────────────────────── */}
      <nav
        style={{
          background: scrolled ? 'rgba(10,15,30,0.85)' : 'rgba(10,15,30,0)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          borderBottom: scrolled ? '1px solid rgba(93,202,165,0.1)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : 'none',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="font-heading font-bold text-lg tracking-tight flex items-center gap-0 group"
            aria-label="Go to top"
          >
            <span className="text-mint transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(93,202,165,0.8)]">V</span>
            <span className="text-text">ansh</span>
            <span className="text-mint">.</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, id }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'text-mint'
                      : 'text-muted hover:text-text hover:bg-white/5'
                    }
                  `}
                >
                  {label}
                  {/* Active underline indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute bottom-0.5 left-3 right-3 h-px bg-mint rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {/* Resume ghost button */}
            <a
              href={RESUME_URL}
              download="Vansh_Lakhwani_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackResumeDownload('navbar')}
              className="resume-btn btn-ghost !py-2 !px-4 text-sm"
            >
              <span className="download-icon"><Download size={14} /></span>
              Resume
            </a>

            {/* Hire Me CTA */}
            <button
              onClick={() => scrollTo('contact')}
              className="btn-primary !py-2 !px-4 text-sm"
            >
              Hire Me <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-mint hover:bg-white/5 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay menu ───────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={close}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              ref={overlayRef}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-40 md:hidden"
              style={{
                background: 'rgba(10,15,30,0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(93,202,165,0.12)',
              }}
            >
              <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-1">
                {NAV_LINKS.map(({ label, id }, i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05 }}
                    onClick={() => { scrollTo(id, close) }}
                    className={`
                      text-left px-4 py-3 rounded-lg text-sm font-medium
                      transition-all duration-200 flex items-center justify-between group
                      ${active === id
                        ? 'text-mint bg-mint/8'
                        : 'text-muted hover:text-text hover:bg-white/5'
                      }
                    `}
                  >
                    {label}
                    {active === id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                    )}
                  </motion.button>
                ))}

                {/* Divider */}
                <div className="my-3 h-px bg-white/6" />

                {/* Resume + Hire Me */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={RESUME_URL}
                    download="Vansh_Lakhwani_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { trackResumeDownload('navbar-mobile'); close() }}
                    className="resume-btn btn-ghost justify-center !py-2.5 text-sm"
                  >
                    <span className="download-icon"><Download size={14} /></span>
                    Resume
                  </a>
                  <button
                    onClick={() => { scrollTo('contact', close) }}
                    className="btn-primary justify-center !py-2.5 text-sm"
                  >
                    Hire Me <ArrowRight size={13} />
                  </button>
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-3 mt-4 px-1">
                  <span className="text-xs text-muted uppercase tracking-widest">Find me on</span>
                  <SocialButtons size="sm" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
