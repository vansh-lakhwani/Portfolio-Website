'use client'
import { Heart, Download } from 'lucide-react'
import { trackResumeDownload } from '@/lib/analytics'
import SocialButtons from '@/components/SocialButtons'

const NAV_LINKS = [
  { label: 'Projects',     href: '#projects'     },
  { label: 'Skills',       href: '#skills'       },
  { label: 'Education',    href: '#education'    },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact',      href: '#contact'      },
  { label: 'Schedule',     href: '#scheduler'    },
]


export default function Footer() {
  const scrollTo = (href: string) => {
    if (typeof window !== 'undefined') {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t border-white/5 bg-surface/60 backdrop-blur-glass">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="font-heading font-bold text-xl mb-2">
              <span className="text-mint">V</span>ansh<span className="text-mint">.</span>
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Backend developer fresher building reliable, scalable server-side systems.
            </p>
          </div>

          {/* Quick nav */}
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-4">Navigate</p>
            <ul className="space-y-2">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-sm text-muted hover:text-mint transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-4">Connect</p>
            <SocialButtons size="md" className="mb-4" />
            <a
              href="/vansh-resume.pdf"
              download="Vansh_Lakhwani_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackResumeDownload('footer')}
              className="resume-btn mt-4 btn-ghost flex items-center justify-center gap-2 text-sm !py-2"
            >
              <span className="download-icon"><Download size={14} /></span>
              Download Resume
            </a>
          </div>
        </div>

        <div className="section-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-xs flex items-center gap-1.5">
            Built with <Heart size={12} className="text-mint fill-mint" /> by Vansh Lakhwani
            &nbsp;·&nbsp; {new Date().getFullYear()}
            &nbsp;·&nbsp; Next.js + Tailwind + Framer Motion
          </p>
          <SocialButtons size="sm" />
        </div>
      </div>
    </footer>
  )
}
