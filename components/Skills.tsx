'use client'
import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { familiarTech } from '@/lib/familiarTech'

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
      { name: 'Python', level: 94 },
      { name: 'TypeScript', level: 80 },
      { name: 'C', level: 86 },
      { name: 'R', level: 77 },
    ],
  },
  {
    label: 'AI/ML & Data Science',
    skills: [
      { name: 'Numpy', level: 89 },
      { name: 'Pandas', level: 88 },
      { name: 'Scikit-learn', level: 84 },
      { name: 'Tensorflow', level: 75 },
      { name: 'Keras', level: 72 },
      { name: 'OpenCV', level: 68 },
      { name: 'LSTM', level: 71 },
      { name: 'NLP', level: 64 },
    ],
  },
  {
    label: 'Frontend',
    skills: [
      { name: 'React', level: 78 },
      { name: 'Next.js 14/16', level: 75 },
      { name: 'HTML', level: 94 },
      { name: 'CSS', level: 74 },
      { name: 'Tailwind CSS', level: 68 },
      { name: 'Framer Motion', level: 54 },
    ],
  },
  {
    label: 'Backend & API',
    skills: [
      { name: 'Django', level: 70 },
      { name: 'Node.js', level: 60 },
      { name: 'Supabase', level: 80 },
      { name: 'GroqAI API', level: 65 },
      { name: 'OpenAI API', level: 72 },
    ],
  },
  {
    label: 'Databases',
    skills: [
      { name: 'PostgreSQL', level: 70 },
      { name: 'MongoDB', level: 75 },
      { name: 'MySQL', level: 70 },
      { name: 'Redis', level: 65 },
    ],
  },
]

const EXPERIENCE = [
  {
    role: 'Project Intern',
    company: 'TATA Technologies',
    period: 'Nov 2025 — Present',
    desc: 'Developing AI-driven Effort Estimator system to optimize software development timeline planning for enterprise stakeholders. Leveraging transformer-based models with embeddings to interpret unstructured requirements and generate structured SDLC outputs.Integrating COCOMO model with historical production data and resource allocation patterns to improve estimation reliability by 30%.',
  },
  {
    role: 'Software Engineer Intern',
    company: 'Uluka Systems Pvt. Ltd.',
    period: 'Oct 2025',
    desc: 'Validated mission-critical ADS-B electronic systems through comprehensive testing using C, Python, and LAMP stack. Conducted Factory Acceptance Testing (FAT) including BOM verification, functional validation, and GPS/NTP synchronization testing. Performed EMI/EMC testing and resolved interference issues through advanced grounding and shielding techniques.',
  },
  {
    role: 'Machine Learning Intern',
    company: 'Uluka Systems Pvt. Ltd.',
    period: 'Aug 2024 - Feb 2025',
    desc: 'Architected end-to-end ML pipeline for Road Condition Assessment using real-time sensor data from Android devices, processing 10,000+ data points. Reduced feature dimensionality by 40% using PCA while engineering meaningful features (total acceleration, jerk, speed) from raw time-series signals. Implemented K-Means clustering achieving 85% accuracy in classifying road surfaces into smooth, rough, and mixed categories with geospatial visualization via Folium',
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
                {familiarTech.map(tech => (
                  <span key={tech.name} className="tech-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img
                      src={tech.localLogo}
                      alt={tech.name}
                      width={16}
                      height={16}
                      style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.src = tech.localLogo
                      }}
                    />
                    <span>{tech.name}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
