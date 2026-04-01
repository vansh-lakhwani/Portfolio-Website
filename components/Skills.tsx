'use client'
import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Cpu } from 'lucide-react'

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const SKILL_GROUPS = [
  {
    label: 'Languages',
    skills: [
      { name: 'Python', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'JavaScript', level: 80 },
      { name: 'Java', level: 65 },
      { name: 'SQL', level: 75 },
    ],
  },
  {
    label: 'Frameworks & Libraries',
    skills: [
      { name: 'Node.js', level: 82 },
      { name: 'Express', level: 80 },
      { name: 'FastAPI', level: 72 },
      { name: 'Next.js', level: 70 },
      { name: 'Prisma', level: 68 },
    ],
  },
  {
    label: 'Databases',
    skills: [
      { name: 'PostgreSQL', level: 78 },
      { name: 'MongoDB', level: 75 },
      { name: 'Redis', level: 65 },
      { name: 'MySQL', level: 70 },
    ],
  },
  {
    label: 'Cloud & DevOps',
    skills: [
      { name: 'Docker', level: 70 },
      { name: 'AWS', level: 60 },
      { name: 'Vercel', level: 80 },
      { name: 'GitHub Actions', level: 65 },
      { name: 'Linux', level: 72 },
    ],
  },
  {
    label: 'AI Tools',
    skills: [
      { name: 'Google Stitch', level: 70 },
      { name: 'Antigravity', level: 75 },
      { name: 'Vercel', level: 70 },
      { name: 'Claude', level: 65 },
      { name: 'ChatGPT', level: 73 },
    ],
  },
]

const EXPERIENCE = [
  {
    role: 'Project Intern',
    company: 'TATA Technologies',
    period: 'Nov 2025 — Present',
    desc: 'Actively building personal projects and seeking opportunities in backend engineering roles.',
  },
  {
    role: 'MERN Intern',
    company: 'Uluka Systems Pvt. Ltd.',
    period: 'Oct 2025',
    desc: 'Studying CS fundamentals, data structures, algorithms, and software engineering practices.',
  },
  {
    role: 'Machine Learning Intern',
    company: 'Uluka Systems Pvt. Ltd.',
    period: 'Aug 2024 - Feb 2025',
    desc: 'Studying CS fundamentals, data structures, algorithms, and software engineering practices.',
  },
]

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="py-section px-6 bg-surface/40" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-14"
        >
          <span className="label-chip mb-4 inline-flex"><Cpu size={12} /> Skills & Experience</span>
          <h2 className="font-heading text-display-sm font-bold mt-3">
            My{' '}
            <span className="bg-gradient-to-r from-mint to-mint-dim bg-clip-text text-transparent">
              technical stack
            </span>
          </h2>
          <p className="text-muted mt-3 max-w-lg">
            Tools and technologies I work with to build reliable, performant backend systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Skill bars */}
          <div className="space-y-8">
            {SKILL_GROUPS.map((group, gi) => (
              <motion.div
                key={group.label}
                variants={FADE_UP} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={gi}
              >
                <h3 className="text-xs font-medium tracking-widest uppercase text-muted mb-4">
                  {group.label}
                </h3>
                <div className="space-y-3">
                  {group.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-text/90 font-medium">{skill.name}</span>
                        <span className="text-muted">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-mint to-mint-dim"
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: gi * 0.1 + 0.3, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Experience timeline */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase text-muted mb-6">
              Experience
            </h3>
            <div className="relative space-y-6 pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-mint/50 before:via-mint/20 before:to-transparent">
              {EXPERIENCE.map((exp, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP} initial="hidden"
                  animate={inView ? 'visible' : 'hidden'} custom={i + SKILL_GROUPS.length}
                  className="relative glass-card p-5"
                >
                  <span className="absolute -left-[25px] top-5 w-3 h-3 rounded-full bg-mint border-2 border-background" />
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-heading font-semibold text-text">{exp.role}</h4>
                    <span className="text-xs text-muted whitespace-nowrap">{exp.period}</span>
                  </div>
                  <p className="text-mint text-sm font-medium mb-2">{exp.company}</p>
                  <p className="text-muted text-sm leading-relaxed">{exp.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Tools chips */}
            <motion.div
              variants={FADE_UP} initial="hidden"
              animate={inView ? 'visible' : 'hidden'} custom={SKILL_GROUPS.length + EXPERIENCE.length + 1}
              className="mt-8"
            >
              <h3 className="text-xs font-medium tracking-widest uppercase text-muted mb-4">
                Also Familiar With
              </h3>
              <div className="flex flex-wrap gap-2">
                {['REST APIs', 'GraphQL', 'WebSockets', 'JWT', 'OAuth2', 'CI/CD', 'Nginx', 'Microservices', 'Git', 'Postman', 'Jest'].map(t => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
