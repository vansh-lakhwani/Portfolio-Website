'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, MapPin, MessageSquare, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react'
import SocialButtons, { LinkedInCard } from '@/components/SocialButtons'

const FADE_UP = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const } }),
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormState = 'idle' | 'loading' | 'success' | 'error'

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '', honeypot: '' }
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || ''

export default function Contact() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form,   setForm]   = useState(EMPTY)
  const [status, setStatus] = useState<FormState>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrMsg('')

    // Client-side email validation
    if (!EMAIL_RE.test(form.email)) {
      setErrMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      form.name.trim(),
          email:     form.email.trim(),
          subject:   form.subject.trim(),
          phone:     form.phone.trim(),
          message:   form.message.trim(),
          honeypot:  form.honeypot, // empty for real users
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      setStatus('success')
      setForm(EMPTY)
    } catch (err: unknown) {
      setStatus('error')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="py-section px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-14"
        >
          <span className="label-chip mb-4 inline-flex"><MessageSquare size={12} /> Get In Touch</span>
          <h2 className="font-heading text-display-sm font-bold mt-3">
            Let&apos;s{' '}
            <span className="bg-gradient-to-r from-mint to-mint-dim bg-clip-text text-transparent">
              connect
            </span>
          </h2>
          <p className="text-muted mt-3 max-w-lg">
            Have an opportunity, a project idea, or just want to chat? My inbox is always open.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* ── Info cards ──────────────────────────────────────── */}
          <motion.div
            variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}
            className="md:col-span-2 flex flex-col gap-4"
          >
            {[
              { icon: <Mail size={18} className="text-mint" />, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
              { icon: <MapPin size={18} className="text-mint" />, label: 'Location', value: 'India', href: null },
            ].map((item) => (
              <div key={item.label} className="glass-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-mint/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-muted text-xs mb-0.5">{item.label}</p>
                  {item.href
                    ? <a href={item.href} className="text-text font-medium hover:text-mint transition-colors">{item.value}</a>
                    : <p className="text-text font-medium">{item.value}</p>
                  }
                </div>
              </div>
            ))}

            <LinkedInCard />

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted uppercase tracking-widest">Social</span>
              <SocialButtons size="md" />
            </div>

            <div className="glass-card p-5 mt-2">
              <p className="text-xs text-muted mb-3 uppercase tracking-widest">Response time</p>
              <p className="text-text text-sm">
                Usually within <span className="text-mint font-medium">24 hours</span>. For faster response, use the{' '}
                <a className="text-purple-dim underline-offset-2 underline" href="#scheduler">scheduler</a> below.
              </p>
            </div>
          </motion.div>

          {/* ── Contact form ─────────────────────────────────────── */}
          <motion.div
            variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={2}
            className="md:col-span-3"
          >
            {/* ── Success card ── */}
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="glass-card p-10 flex flex-col items-center text-center gap-5"
              >
                <div className="w-16 h-16 rounded-full bg-mint/15 border border-mint/30 flex items-center justify-center">
                  <CheckCircle size={32} className="text-mint" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-text mb-2">Message sent! 🎉</h3>
                  <p className="text-muted text-sm max-w-xs">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-xs text-muted hover:text-mint transition-colors underline underline-offset-4 mt-2"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 flex flex-col gap-5" noValidate>

                {/* ── Honeypot (hidden from real users, visible to bots) ── */}
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                />

                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs text-muted uppercase tracking-widest">Name</label>
                    <input
                      id="name" name="name" type="text" required
                      value={form.name} onChange={handleChange}
                      placeholder="Your name"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-text placeholder-muted/50 focus:outline-none focus:border-mint/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs text-muted uppercase tracking-widest">Email</label>
                    <input
                      id="email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-text placeholder-muted/50 focus:outline-none focus:border-mint/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs text-muted uppercase tracking-widest">Phone (Optional)</label>
                    <input
                      id="phone" name="phone" type="tel"
                      value={form.phone} onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-text placeholder-muted/50 focus:outline-none focus:border-mint/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="subject" className="text-xs text-muted uppercase tracking-widest">Subject</label>
                    <input
                      id="subject" name="subject" type="text" required
                      value={form.subject} onChange={handleChange}
                      placeholder="Job opportunity / Project"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-text placeholder-muted/50 focus:outline-none focus:border-mint/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs text-muted uppercase tracking-widest">Message</label>
                  <textarea
                    id="message" name="message" required rows={5}
                    value={form.message} onChange={handleChange}
                    placeholder="Tell me about the opportunity or project..."
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-text placeholder-muted/50 focus:outline-none focus:border-mint/50 transition-colors resize-none"
                  />
                </div>

                {/* Error banner */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-coral text-sm bg-coral/10 border border-coral/20 rounded-lg px-4 py-3"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {errMsg}
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading'
                    ? <><Loader2 size={15} className="animate-spin" /> Sending...</>
                    : <><Send size={15} /> Send Message</>
                  }
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
