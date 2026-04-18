'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, type Variants } from 'framer-motion'
import { GraduationCap, BookOpen, Award, MapPin, Check } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface EducationItem {
  id: number
  degree: string
  branch: string
  institution: string
  affiliation: string
  yearRange: string
  score: string
  scoreType: 'cgpa' | 'percentage'
  achievements: string[]
  status: 'ongoing' | 'completed'
  icon: 'graduation' | 'book' | 'award'
}

// ── Education Data ────────────────────────────────────────────────────────────
const educationData: EducationItem[] = [
  {
    id: 1,
    degree: 'Bachelor of Technology',
    branch: 'Computer Science & Engineering',
    institution: 'Dr. D.Y. Patil School of Science and Technology',
    affiliation: 'Dr. D.Y. Patil Vidyapeeth — Specialization in AI & DS',
    yearRange: '2022 – Present',
    score: 'CGPA: 9.33',
    scoreType: 'cgpa',
    achievements: ['Top 10% of batch', 'Team Lead - Binary Brain Club'],
    status: 'ongoing',
    icon: 'graduation',
  },
  {
    id: 2,
    degree: 'Senior Secondary (Class XII)',
    branch: 'Science Stream — PCM',
    institution: 'Lifeline Public School',
    affiliation: 'CBSE Board',
    yearRange: '2020 – 2022',
    score: 'Percentage: 86.2%',
    scoreType: 'percentage',
    achievements: ['JEE Mains Score - 92.84%ile'],
    status: 'completed',
    icon: 'book',
  },
  {
    id: 3,
    degree: 'Secondary (Class X)',
    branch: 'All Subjects',
    institution: "St. Conrad's Inter College",
    affiliation: 'ICSE Board',
    yearRange: '2018 – 2020',
    score: 'Percentage: 89.8%',
    scoreType: 'percentage',
    achievements: ["NaN"],
    status: 'completed',
    icon: 'award',
  },
]

// ── Animation variants ────────────────────────────────────────────────────────
const cardLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const cardRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const dotVariant: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

// ── Lucide icon map ───────────────────────────────────────────────────────────
function ItemIcon({ type }: { type: EducationItem['icon'] }) {
  const cls = 'text-white w-5 h-5'
  if (type === 'graduation') return <GraduationCap className={cls} />
  if (type === 'book') return <BookOpen className={cls} />
  return <Award className={cls} />
}

// ── Logo with fallback initials ───────────────────────────────────────────────
function LogoAvatar({ logo, fallback }: { logo: string; fallback: string }) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center
                   border border-white/20 bg-white/10
                   text-mint font-heading font-bold text-xs tracking-wide select-none"
      >
        {fallback}
      </div>
    )
  }

  return (
    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center">
      <Image
        src={logo}
        alt={fallback}
        width={48}
        height={48}
        className="object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  )
}

// ── Ongoing badge ─────────────────────────────────────────────────────────────
function OngoingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1
                     bg-green-500/10 border border-green-500/30
                     text-green-400 text-[11px] font-bold rounded-full uppercase tracking-wide">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>
      Ongoing
    </span>
  )
}

function CompletedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1
                     bg-mint/10 border border-mint/30
                     text-mint text-[11px] font-bold rounded-full uppercase tracking-wide">
      <Check size={10} strokeWidth={3} />
      Completed
    </span>
  )
}

// ── Single education card ─────────────────────────────────────────────────────
function EducationCard({
  item,
  side,
  inView,
}: {
  item: EducationItem
  side: 'left' | 'right'
  inView: boolean
}) {
  const isLeft = side === 'left'
  const variant = isLeft ? cardLeft : cardRight

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`
        glass-card p-6 rounded-xl group cursor-default
        hover:border-mint/40 hover:shadow-[0_0_30px_rgba(93,202,165,0.12)]
        transition-shadow duration-300
        ${isLeft ? 'md:text-right' : 'md:text-left'}
      `}
    >
      {/* ── Top row: icon + year badge ── */}
      <div className={`flex items-center justify-between mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
        {/* Icon */}
        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
          <ItemIcon type={item.icon} />
        </div>

        {/* Year + Status badge */}
        <div className={`flex items-center gap-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
          {item.status === 'ongoing' ? <OngoingBadge /> : <CompletedBadge />}
          <span className="px-3 py-1 bg-mint/10 text-mint text-xs font-bold rounded-full font-body">
            {item.yearRange}
          </span>
        </div>
      </div>

      {/* ── Degree & Branch ── */}
      <h3 className="text-lg font-bold text-text mb-0.5 font-heading group-hover:text-mint transition-colors duration-200">
        {item.degree}
      </h3>
      <p className="text-mint font-medium text-sm mb-1">{item.branch}</p>
      <p className="text-muted text-[13px] mb-0.5">{item.institution}</p>
      <p className="text-muted text-[13px] mb-4">{item.affiliation}</p>

      {/* ── Score badge ── */}
      <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(127,119,221,0.15)',
            color: '#C5C0FF',
            border: '1px solid rgba(127,119,221,0.2)',
          }}
        >
          {item.score}
        </span>
      </div>

      {/* ── Achievement badges ── */}
      <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
        {item.achievements.map((ach) => (
          <span
            key={ach}
            className="px-2 py-0.5 border border-mint/40 text-mint text-[11px] rounded uppercase font-bold tracking-wide"
          >
            {ach}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Timeline dot ──────────────────────────────────────────────────────────────
function TimelineDot({ inView }: { inView: boolean }) {
  return (
    <motion.div
      variants={dotVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="absolute left-1/2 -translate-x-1/2
                 w-3 h-3 bg-mint rounded-full z-10
                 hidden md:flex items-center justify-center"
      style={{ boxShadow: '0 0 15px rgba(93,202,165,0.6)' }}
    >
      <div className="w-1.5 h-1.5 bg-white rounded-full" />
    </motion.div>
  )
}

// ── Mobile left-rail dot ──────────────────────────────────────────────────────
function MobileDot({ inView }: { inView: boolean }) {
  return (
    <motion.div
      variants={dotVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="absolute left-0 top-6 w-3 h-3 bg-mint rounded-full md:hidden flex items-center justify-center"
      style={{ boxShadow: '0 0 12px rgba(93,202,165,0.5)' }}
    >
      <div className="w-1.5 h-1.5 bg-white rounded-full" />
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Education() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="education" className="py-section px-6 bg-surface/40" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <span className="label-chip mb-4 inline-flex">
            <GraduationCap size={12} />
            My Journey
          </span>
          <h2 className="font-heading text-display-sm font-bold mt-4 tracking-tight">
            Education
          </h2>
          <p className="text-muted text-lg max-w-lg mx-auto mt-3">
            Building my foundation, one degree at a time.
          </p>
        </motion.div>

        {/* ── Timeline container ── */}
        <div className="relative">

          {/* ── Desktop center line ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] hidden md:block"
            style={{ background: 'rgba(93,202,165,0.25)' }}
          />

          {/* ── Mobile left rail ── */}
          <div
            className="absolute left-1.5 top-0 h-full w-[2px] md:hidden"
            style={{ background: 'rgba(93,202,165,0.25)' }}
          />

          {/* ── Items ── */}
          <div className="space-y-12 md:space-y-0 relative">
            {educationData.map((item, idx) => {
              const isLeft = idx % 2 === 0

              return (
                <div
                  key={item.id}
                  className={`
                    flex w-full relative
                    flex-col md:flex-row md:justify-between md:items-center
                    ${idx < educationData.length - 1 ? 'md:mb-24' : ''}
                    pl-8 md:pl-0
                  `}
                >
                  {isLeft ? (
                    /* ── LEFT layout: card first in DOM (md:order-1), spacer after (md:order-2) ── */
                    <>
                      <div className="w-full md:w-[45%] md:order-1">
                        <EducationCard item={item} side="left" inView={inView} />
                      </div>
                      <TimelineDot inView={inView} />
                      <MobileDot inView={inView} />
                      <div className="hidden md:block md:w-[45%] md:order-2" />
                    </>
                  ) : (
                    /* ── RIGHT layout: spacer first (natural order-0), card after (order-2) ── */
                    <>
                      <div className="hidden md:block md:w-[45%]" />
                      <TimelineDot inView={inView} />
                      <MobileDot inView={inView} />
                      <div className="w-full md:w-[45%] order-2">
                        <EducationCard item={item} side="right" inView={inView} />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
