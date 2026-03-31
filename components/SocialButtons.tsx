'use client'
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/lib/icons'

// Read from env — fallback to known values so it works without a server restart
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL ?? ''
const GITHUB_URL   = process.env.NEXT_PUBLIC_GITHUB_URL   ?? ''
const EMAIL        = process.env.NEXT_PUBLIC_EMAIL        ?? ''

const BUTTONS = [
  {
    label: 'LinkedIn',
    href:  LINKEDIN_URL,
    icon:  <LinkedinIcon size={18} />,
    external: true,
  },
  {
    label: 'GitHub',
    href:  GITHUB_URL,
    icon:  <GithubIcon size={18} />,
    external: true,
  },
  {
    label: 'Instagram',
    href:  'https://www.instagram.com/_vansh_lakhwani_/',
    icon:  <InstagramIcon size={18} />,
    external: true,
  },
]

interface SocialButtonsProps {
  /** 'sm' = 36px circles (Footer copyright row), 'md' = 40px (Hero/Contact, default) */
  size?: 'sm' | 'md'
  className?: string
}

export default function SocialButtons({ size = 'md', className = '' }: SocialButtonsProps) {
  const dim = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {BUTTONS.map(({ label, href, icon, external }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`
            ${dim} rounded-full
            flex items-center justify-center flex-shrink-0
            border border-white/10
            text-muted
            transition-all duration-200
            hover:text-mint hover:border-mint/40 hover:bg-mint/8
            hover:shadow-[0_0_14px_rgba(93,202,165,0.18)]
          `}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LinkedIn CTA card — prominent version for Contact left column
// ─────────────────────────────────────────────────────────────
export function LinkedInCard() {
  return (
    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        glass-card p-5 flex items-center gap-4
        group transition-all duration-300
        hover:border-[#0A66C2]/40 hover:shadow-[0_0_24px_rgba(10,102,194,0.12)]
      "
    >
      {/* LinkedIn blue icon box */}
      <div className="
        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
        bg-[#0A66C2]/15 group-hover:bg-[#0A66C2]/25 transition-colors duration-300
      ">
        <LinkedinIcon size={18} className="text-[#0A66C2]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-text font-medium text-sm">Connect on LinkedIn</p>
        <p className="text-muted text-xs mt-0.5 truncate">{LINKEDIN_URL}</p>
      </div>

      {/* Arrow indicator */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={14} height={14} viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round"
        className="text-muted group-hover:text-[#0A66C2] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    </a>
  )
}
